'use client';

import React, { useState, useCallback } from 'react';
import { Profile, SwipeDirection, DeckStats } from '../types/profile';
import { INITIAL_PROFILES } from '../data/mockProfiles';
import { SwipeCard } from './SwipeCard';
import { ActionButtons } from './ActionButtons';
import { EmptyDeck } from './EmptyDeck';
import { MatchModal } from './MatchModal';
import { Header } from './Header';
import { MatchesDrawer } from './MatchesDrawer';

export const SwipeDeck: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<{ profile: Profile; direction: SwipeDirection }[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [activeMatch, setActiveMatch] = useState<Profile | null>(null);
  const [isMatchesDrawerOpen, setIsMatchesDrawerOpen] = useState<boolean>(false);
  const [forcedSwipe, setForcedSwipe] = useState<SwipeDirection | null>(null);
  const [dragProgress, setDragProgress] = useState<number>(0); // -1 to 1

  // Computed statistics
  const total = profiles.length;
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
      const currentProfile = profiles[currentIndex];
      if (!currentProfile) return;

      // Update history
      setHistory((prev) => [...prev, { profile: currentProfile, direction }]);

      // Check for simulated match
      if (direction === 'right' && currentProfile.simulatedMatch) {
        setMatches((prev) => [...prev, currentProfile]);
        setActiveMatch(currentProfile);
      }

      setDragProgress(0);
      setForcedSwipe(null);
      setCurrentIndex((prev) => prev + 1);
    },
    [profiles, currentIndex]
  );

  const handleActionClick = useCallback((direction: SwipeDirection) => {
    setForcedSwipe(direction);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0 || currentIndex === 0) return;

    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);

    // If it was a match, remove from matches
    if (lastAction.direction === 'right' && lastAction.profile.simulatedMatch) {
      setMatches((prev) => prev.filter((m) => m.id !== lastAction.profile.id));
    }
  }, [history, currentIndex]);

  const handleReset = useCallback(() => {
    setProfiles(INITIAL_PROFILES);
    setCurrentIndex(0);
    setHistory([]);
    setMatches([]);
    setActiveMatch(null);
    setDragProgress(0);
    setForcedSwipe(null);
  }, []);

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const thirdProfile = profiles[currentIndex + 2];
  const isDeckEmpty = currentIndex >= profiles.length;

  // Realtime interpolation for cards underneath based on drag displacement
  const absProgress = Math.min(1, Math.abs(dragProgress));
  const nextCardScale = 0.95 + absProgress * 0.05;
  const nextCardY = 10 - absProgress * 10;
  const nextCardOpacity = 0.88 + absProgress * 0.12;

  const thirdCardScale = 0.90 + absProgress * 0.05;
  const thirdCardY = 20 - absProgress * 10;
  const thirdCardOpacity = 0.55 + absProgress * 0.25;

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between select-none relative overflow-hidden">
      {/* Top Header */}
      <Header
        stats={stats}
        matchesCount={matches.length}
        onOpenMatches={() => setIsMatchesDrawerOpen(true)}
      />

      {/* Main Interactive Deck Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4 relative w-full">
        {/* Card Stage Container */}
        <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[520px] sm:h-[580px] flex items-center justify-center">
          {isDeckEmpty ? (
            <EmptyDeck stats={stats} onReset={handleReset} />
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
                  <SwipeCard
                    profile={thirdProfile}
                    isTopCard={false}
                    onSwipe={() => {}}
                  />
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
                  <SwipeCard
                    profile={nextProfile}
                    isTopCard={false}
                    onSwipe={() => {}}
                  />
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
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Below the Card */}
        <div className="w-full mt-2 sm:mt-4 z-20">
          <ActionButtons
            onSwipeAction={handleActionClick}
            onUndo={handleUndo}
            canUndo={history.length > 0 && !isDeckEmpty}
            disabled={isDeckEmpty || forcedSwipe !== null}
          />
        </div>
      </main>

      {/* Minimal Footer / Keyboard Navigation Hint */}
      <footer className="w-full py-2.5 px-4 text-center z-10 text-[11px] text-zinc-400 font-mono flex items-center justify-center gap-4">
        <span>Drag cards horizontally or use buttons</span>
        <span className="hidden sm:inline text-zinc-500">·</span>
        <span className="hidden sm:inline">
          Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">←</kbd> Pass, <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">→</kbd> Like
        </span>
      </footer>

      {/* Match Celebration Modal */}
      <MatchModal
        matchedProfile={activeMatch}
        onClose={() => setActiveMatch(null)}
      />

      {/* Matches Drawer Panel */}
      <MatchesDrawer
        isOpen={isMatchesDrawerOpen}
        onClose={() => setIsMatchesDrawerOpen(false)}
        matches={matches}
      />
    </div>
  );
};
