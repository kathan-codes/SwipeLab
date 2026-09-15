'use client';

import React, { useState } from 'react';
import {
  Compass,
  Moon,
  Sun,
  Keyboard,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Bell,
  Heart,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ThemeMode, DiscoveryPreferences, DeckStats } from '../types/profile';
import { DiscoveryPreferencesModal } from './DiscoveryPreferencesModal';

interface SettingsViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  preferences: DiscoveryPreferences;
  onSavePreferences: (prefs: DiscoveryPreferences) => void;
  stats: DeckStats;
  onResetDeck: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  preferences,
  onSavePreferences,
  stats,
  onResetDeck,
}) => {
  const [isPrefsModalOpen, setIsPrefsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex-1 flex flex-col space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Your Profile & Settings</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure discovery filters, theme, and interactive options
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-4 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-lg flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-zinc-800 to-emerald-500/20 border border-white/10 flex items-center justify-center text-zinc-200">
          <Layers className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white truncate">SwipeLab Explorer</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Active Session
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Local prototype profile · Fictional discovery sandbox
          </p>
        </div>
      </div>

      {/* Discovery Preferences Item */}
      <div className="rounded-3xl bg-zinc-900/80 border border-white/10 divide-y divide-white/5 shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => setIsPrefsModalOpen(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Discovery Preferences</h4>
              <p className="text-xs text-zinc-400">
                Age: {preferences.minAge}–{preferences.maxAge} yrs · {preferences.locations.length} cities selected
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Appearance</h4>
              <p className="text-xs text-zinc-400">
                Current theme: <span className="capitalize text-zinc-200">{theme}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference Guide */}
      <div className="p-4 rounded-3xl bg-zinc-900/80 border border-white/10 shadow-md">
        <div className="flex items-center gap-2 mb-3 text-zinc-300">
          <Keyboard className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider">Keyboard Shortcuts</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-zinc-400">Pass card</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-zinc-200">
              ←
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-zinc-400">Like card</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-zinc-200">
              →
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-zinc-400">Undo swipe</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-zinc-200">
              Z
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-zinc-400">View profile</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-zinc-200">
              Enter
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-white/5 col-span-2">
            <span className="text-zinc-400">Close open modal / dialog</span>
            <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-zinc-200">
              Esc
            </kbd>
          </div>
        </div>
      </div>

      {/* Session Stats & Reset Deck */}
      <div className="p-4 rounded-3xl bg-zinc-900/80 border border-white/10 shadow-md">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Session Statistics
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Swiped</span>
            <span className="text-base font-bold text-white">
              {stats.liked + stats.passed}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 block">Likes</span>
            <span className="text-base font-bold text-emerald-300">{stats.liked}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] text-rose-400 block">Matches</span>
            <span className="text-base font-bold text-rose-300">{stats.matches}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetDeck}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Discovery Deck</span>
        </button>
      </div>

      {/* Preferences Modal */}
      <DiscoveryPreferencesModal
        isOpen={isPrefsModalOpen}
        onClose={() => setIsPrefsModalOpen(false)}
        preferences={preferences}
        onSavePreferences={onSavePreferences}
      />
    </div>
  );
};
