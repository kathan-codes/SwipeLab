'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Profile,
  AppView,
  ThemeMode,
  FilterOptions,
  DiscoveryPreferences,
  MockNotification,
  DeckStats,
} from '@/types/profile';
import { INITIAL_PROFILES, INITIAL_NOTIFICATIONS } from '@/data/mockProfiles';
import {
  getStoredTheme,
  setStoredTheme,
  getStoredPreferences,
  setStoredPreferences,
  DEFAULT_FILTERS,
} from '@/utils/storage';
import { Header } from '@/components/Header';
import { SwipeDeck } from '@/components/SwipeDeck';
import { LikesYouView } from '@/components/LikesYouView';
import { MessagingView } from '@/components/MessagingView';
import { SettingsView } from '@/components/SettingsView';
import { NotificationsPopover } from '@/components/NotificationsPopover';
import { ProfileDetailModal } from '@/components/ProfileDetailModal';
import { MatchModal } from '@/components/MatchModal';
import { hapticMatch } from '@/utils/haptics';

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [currentView, setCurrentView] = useState<AppView>('discover');
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [notifications, setNotifications] = useState<MockNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [discoveryPreferences, setDiscoveryPreferences] = useState<DiscoveryPreferences>(getStoredPreferences());
  const [chatTargetProfile, setChatTargetProfile] = useState<Profile | null>(null);
  const [inspectedProfile, setInspectedProfile] = useState<Profile | null>(null);
  const [activeMatchCelebration, setActiveMatchCelebration] = useState<Profile | null>(null);

  // Initialize theme from storage and apply to DOM
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setStoredTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  // Likes You management
  const likesYouProfiles = profiles.filter((p) => p.likesYou);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleAddMatch = useCallback((profile: Profile) => {
    setMatches((prev) => {
      if (prev.some((m) => m.id === profile.id)) return prev;
      return [...prev, profile];
    });
  }, []);

  const handleRemoveMatch = useCallback((profileId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== profileId));
  }, []);

  // Like Back from Likes You view
  const handleLikeBack = useCallback((profile: Profile) => {
    handleAddMatch(profile);
    setActiveMatchCelebration(profile);
    // Remove from likesYou list so it converts into an active match
    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? { ...p, likesYou: false } : p))
    );
  }, [handleAddMatch]);

  const handlePassInLikesYou = useCallback((profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, likesYou: false } : p))
    );
  }, []);

  const handleOpenChatWithProfile = useCallback((profile: Profile) => {
    handleAddMatch(profile);
    setChatTargetProfile(profile);
    setCurrentView('matches');
  }, [handleAddMatch]);

  const handleMarkNotifAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllNotifsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleSelectNotification = useCallback((notif: MockNotification) => {
    if (notif.type === 'match' || notif.type === 'voice_message') {
      const match = matches.find((m) => m.id === notif.profileId);
      if (match) {
        setChatTargetProfile(match);
        setCurrentView('matches');
      } else {
        const found = profiles.find((p) => p.id === notif.profileId);
        if (found) {
          handleAddMatch(found);
          setChatTargetProfile(found);
          setCurrentView('matches');
        }
      }
    } else {
      const found = profiles.find((p) => p.id === notif.profileId);
      if (found) {
        setInspectedProfile(found);
      }
    }
    setIsNotificationsOpen(false);
  }, [matches, profiles, handleAddMatch]);

  // Overall session statistics
  const stats: DeckStats = {
    total: profiles.length,
    remaining: profiles.length,
    liked: matches.length,
    passed: 0,
    matches: matches.length,
  };

  const isFilterActive =
    filters.locations.length > 0 ||
    filters.interests.length > 0 ||
    filters.gender !== 'all' ||
    filters.minAge > 18 ||
    filters.maxAge < 35;

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setIsNotificationsOpen(false);
        }}
        stats={stats}
        matchesCount={matches.length}
        likesYouCount={likesYouProfiles.length}
        unreadNotificationsCount={unreadNotifCount}
        onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenFilters={() => setIsFiltersModalOpen(true)}
        isFilterActive={isFilterActive}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifAsRead}
        onMarkAllAsRead={handleMarkAllNotifsAsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col w-full relative">
        {currentView === 'discover' && (
          <SwipeDeck
            allProfiles={profiles}
            filters={filters}
            onApplyFilters={setFilters}
            matches={matches}
            onAddMatch={handleAddMatch}
            onRemoveMatch={handleRemoveMatch}
            onOpenChatWithProfile={handleOpenChatWithProfile}
            isFiltersModalOpen={isFiltersModalOpen}
            onCloseFiltersModal={() => setIsFiltersModalOpen(false)}
            onOpenFiltersModal={() => setIsFiltersModalOpen(true)}
          />
        )}

        {currentView === 'likes_you' && (
          <LikesYouView
            profiles={profiles}
            onLikeBack={handleLikeBack}
            onPass={handlePassInLikesYou}
            onReport={(id) => {
              setProfiles((prev) => prev.filter((p) => p.id !== id));
            }}
          />
        )}

        {currentView === 'matches' && (
          <MessagingView
            matches={matches}
            initialMatchId={chatTargetProfile?.id}
            onOpenProfile={(p) => setInspectedProfile(p)}
            onBackToDiscover={() => setCurrentView('discover')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            theme={theme}
            onToggleTheme={handleToggleTheme}
            preferences={discoveryPreferences}
            onSavePreferences={setDiscoveryPreferences}
            stats={stats}
            onResetDeck={() => {
              setProfiles(INITIAL_PROFILES);
              setMatches([]);
              setChatTargetProfile(null);
            }}
          />
        )}
      </main>

      {/* Profile Detail Modal if opened globally */}
      <ProfileDetailModal
        profile={inspectedProfile}
        isOpen={inspectedProfile !== null}
        onClose={() => setInspectedProfile(null)}
        onAction={(dir) => {
          if (!inspectedProfile) return;
          if (dir === 'right') {
            handleAddMatch(inspectedProfile);
            setActiveMatchCelebration(inspectedProfile);
          }
          setInspectedProfile(null);
        }}
        onReport={(id) => {
          setProfiles((prev) => prev.filter((p) => p.id !== id));
          setMatches((prev) => prev.filter((m) => m.id !== id));
          setInspectedProfile(null);
        }}
      />

      {/* Global Match Celebration Modal for Likes You / Global matches */}
      <MatchModal
        matchedProfile={activeMatchCelebration}
        onClose={() => setActiveMatchCelebration(null)}
        onOpenChat={(profile) => {
          setActiveMatchCelebration(null);
          handleOpenChatWithProfile(profile);
        }}
      />
    </div>
  );
}
