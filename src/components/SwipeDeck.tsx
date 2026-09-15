'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Profile, SwipeDirection, DeckStats, FilterOptions } from '../types/profile';
import { SwipeCard } from './SwipeCard';
import { ActionButtons } from './ActionButtons';
import { EmptyDeck } from './EmptyDeck';
import { MatchModal } from './MatchModal';
import { ProfileDetailModal } from './ProfileDetailModal';
import { FiltersModal } from './FiltersModal';
import { hapticUndo, hapticButton } from '../utils/haptics';
import { addStoredReportedId, getStoredReportedIds } from '../utils/storage';

interface SwipeDeckProps {
  allProfiles: Profile[];
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  matches: Profile[];
  onAddMatch: (profile: Profile) => void;
  onRemoveMatch: (profileId: string) => void;
  onOpenChatWithProfile?: (profile: Profile) => void;
  isFiltersModalOpen: boolean;
  onCloseFiltersModal: () => void;
  onOpenFiltersModal: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  allProfiles = [],
  filters = { minAge: 18, maxAge: 35, locations: [], interests: [], gender: 'all' },
  onApplyFilters,
  matches = [],
  onAddMatch,
  onRemoveMatch,
  onOpenChatWithProfile,
  isFiltersModalOpen,
  onCloseFiltersModal,
  onOpenFiltersModal,
}) => {
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<{ profile: Profile; direction: SwipeDirection }[]>([]);
  const [activeMatch, setActiveMatch] = useState<Profile | null>(null);
  const [forcedSwipe, setForcedSwipe] = useState<SwipeDirection | null>(null);
  const [dragProgress, setDragProgress] = useState<number>(0); // -1 to 1
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<Profile | null>(null);

  // Initialize reported IDs from local storage
  useEffect(() => {
    setReportedIds(getStoredReportedIds());
  }, []);

  // Filter profiles based on current active filters & exclude reported
  const filteredProfiles = useMemo(() => {
    const list = allProfiles || [];
    const minAge = filters?.minAge ?? 18;
    const maxAge = filters?.maxAge ?? 35;
    const locations = filters?.locations || [];
    const interests = filters?.interests || [];
    const gender = filters?.gender || 'all';

    return list.filter((p) => {
      // Exclude reported
      if (reportedIds.includes(p.id)) return false;

      // Age filter
      if (p.age < minAge || p.age > maxAge) return false;

      // Location filter
      if (locations.length > 0) {
        const matchLoc = locations.some((loc) =>
          p.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!matchLoc) return false;
      }

      // Interests filter
      if (interests.length > 0) {
        const matchInt = interests.some((int) =>
          p.interests.some((pi) => pi.toLowerCase().includes(int.toLowerCase()))
        );
        if (!matchInt) return false;
      }

      // Gender filter
      if (gender !== 'all' && p.gender) {
        if (gender === 'women' && p.gender !== 'woman') return false;
        if (gender === 'men' && p.gender !== 'man') return false;
        if (gender === 'non-binary' && p.gender !== 'non-binary') return false;
      }

      return true;
    });
  }, [allProfiles, filters, reportedIds]);

  // If filter changes, adjust currentIndex if needed
  useEffect(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, [filters]);

  // Computed statistics
  const total = filteredProfiles.length;
  const remaining = Math.max(0, total - currentIndex);
  const likedCount = history.filter((h) => h.direction === 'right').length;
  const passedCount = history.filter((h) => h.direction === 'left').length;

  const stats: DeckStats = {
    total,
    remaining,
    liked: likedCount,
    passed: passedCount,
    matches: matches.length,
  };

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      const currentProfile = filteredProfiles[currentIndex];
      if (!currentProfile) return;

      // Update history
      setHistory((prev) => [...prev, { profile: currentProfile, direction }]);

      // Check for simulated match
      if (direction === 'right' && currentProfile.simulatedMatch) {
        onAddMatch(currentProfile);
        setActiveMatch(currentProfile);
      }

      setDragProgress(0);
      setForcedSwipe(null);
      setCurrentIndex((prev) => prev + 1);
    },
    [filteredProfiles, currentIndex, onAddMatch]
  );

  const handleActionClick = useCallback((direction: SwipeDirection) => {
    setForcedSwipe(direction);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0 || currentIndex === 0) return;

    hapticUndo();
    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));

    // If it was a match, remove from matches
    if (lastAction.direction === 'right' && lastAction.profile.simulatedMatch) {
      onRemoveMatch(lastAction.profile.id);
    }
  }, [history, currentIndex, onRemoveMatch]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setHistory([]);
    setActiveMatch(null);
    setDragProgress(0);
    setForcedSwipe(null);
  }, []);

  const handleReportProfile = useCallback(
    (profileId: string, _reason: string) => {
      addStoredReportedId(profileId);
      setReportedIds((prev) => [...prev, profileId]);
      if (selectedDetailProfile?.id === profileId) {
        setSelectedDetailProfile(null);
      }
    },
    [selectedDetailProfile]
  );

  const currentProfile = filteredProfiles[currentIndex];
  const nextProfile = filteredProfiles[currentIndex + 1];
  const thirdProfile = filteredProfiles[currentIndex + 2];
  const isDeckEmpty = currentIndex >= filteredProfiles.length;

  // Global keyboard shortcuts for Enter (View Profile) and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Enter' && currentProfile && !selectedDetailProfile && !isDeckEmpty) {
        e.preventDefault();
        setSelectedDetailProfile(currentProfile);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile, selectedDetailProfile, isDeckEmpty]);

  // Realtime interpolation for cards underneath based on drag displacement
  const absProgress = Math.min(1, Math.abs(dragProgress));
  const nextCardScale = 0.95 + absProgress * 0.05;
  const nextCardY = 10 - absProgress * 10;
  const nextCardOpacity = 0.88 + absProgress * 0.12;

  const thirdCardScale = 0.90 + absProgress * 0.05;
  const thirdCardY = 20 - absProgress * 10;
  const thirdCardOpacity = 0.55 + absProgress * 0.25;

  const hasActiveFilters =
    filters.locations.length > 0 ||
    filters.interests.length > 0 ||
    filters.gender !== 'all' ||
    filters.minAge > 18 ||
    filters.maxAge < 35;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-3 relative w-full select-none">
      {/* Dynamic Swipe Feedback Progress Bar */}
      <div className="w-full max-w-[340px] mb-2 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 px-2">
        <span
          className={`font-bold transition-all duration-150 ${
            dragProgress < -0.15 ? 'text-rose-400 scale-105' : 'text-zinc-500'
          }`}
        >
          PASS
        </span>

        {/* Minimal tactile indicator bar */}
        <div className="relative w-36 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
          {/* Center marker */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2" />
          {/* Active progress fill */}
          {dragProgress !== 0 && (
            <div
              className={`absolute top-0 bottom-0 transition-all duration-75 ${
                dragProgress > 0 ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
              style={{
                left: dragProgress > 0 ? '50%' : `${50 + dragProgress * 50}%`,
                width: `${Math.abs(dragProgress) * 50}%`,
              }}
            />
          )}
        </div>

        <span
          className={`font-bold transition-all duration-150 ${
            dragProgress > 0.15 ? 'text-emerald-400 scale-105' : 'text-zinc-500'
          }`}
        >
          LIKE
        </span>
      </div>

      {/* Card Stage Container */}
      <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[500px] sm:h-[560px] flex items-center justify-center">
        {isDeckEmpty ? (
          <EmptyDeck
            stats={stats}
            onReset={handleReset}
            isFiltered={hasActiveFilters && total === 0}
            onOpenFilters={onOpenFiltersModal}
          />
        ) : (
          <div className="relative w-full h-full">
            {/* Third Card in stack */}
            {thirdProfile && (
              <div
                style={{
                  transform: `scale(${thirdCardScale}) translateY(${thirdCardY}px)`,
                  opacity: thirdCardOpacity,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
                className="absolute inset-0 z-0 origin-bottom pointer-events-none"
              >
                <SwipeCard profile={thirdProfile} isTopCard={false} onSwipe={() => {}} />
              </div>
            )}

            {/* Second Card in stack */}
            {nextProfile && (
              <div
                style={{
                  transform: `scale(${nextCardScale}) translateY(${nextCardY}px)`,
                  opacity: nextCardOpacity,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
                className="absolute inset-0 z-10 origin-bottom pointer-events-none"
              >
                <SwipeCard profile={nextProfile} isTopCard={false} onSwipe={() => {}} />
              </div>
            )}

            {/* Active Top Card */}
            {currentProfile && (
              <div className="absolute inset-0 z-20">
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  isTopCard={true}
                  onSwipe={handleSwipe}
                  onDragProgress={setDragProgress}
                  forcedSwipe={forcedSwipe}
                  onForcedSwipeComplete={() => setForcedSwipe(null)}
                  onOpenDetails={() => setSelectedDetailProfile(currentProfile)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Below the Card */}
      <div className="w-full mt-2 sm:mt-3 z-20">
        <ActionButtons
          onSwipeAction={handleActionClick}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          disabled={isDeckEmpty || forcedSwipe !== null}
        />
      </div>

      {/* Footer Shortcut Hints */}
      <div className="mt-2 text-center text-[10px] font-mono text-zinc-400 hidden sm:flex items-center gap-3">
        <span>
          <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">←</kbd> Pass
        </span>
        <span>·</span>
        <span>
          <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">→</kbd> Like
        </span>
        <span>·</span>
        <span>
          <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Z</kbd> Undo
        </span>
        <span>·</span>
        <span>
          <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Enter</kbd> Profile Details
        </span>
      </div>

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedDetailProfile}
        isOpen={selectedDetailProfile !== null}
        onClose={() => setSelectedDetailProfile(null)}
        onAction={(direction) => {
          setSelectedDetailProfile(null);
          handleActionClick(direction);
        }}
        onReport={handleReportProfile}
      />

      {/* Filters Modal */}
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={onCloseFiltersModal}
        filters={filters}
        onApplyFilters={onApplyFilters}
        allProfiles={allProfiles}
      />

      {/* Match Celebration Modal */}
      <MatchModal
        matchedProfile={activeMatch}
        onClose={() => setActiveMatch(null)}
        onOpenChat={onOpenChatWithProfile}
      />
    </div>
  );
};
