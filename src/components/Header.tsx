'use client';

import React from 'react';
import {
  Layers,
  Heart,
  MessageCircle,
  Bell,
  Sun,
  Moon,
  SlidersHorizontal,
  Compass,
  Sparkles,
} from 'lucide-react';
import { AppView, DeckStats, ThemeMode } from '../types/profile';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  stats: DeckStats;
  matchesCount: number;
  likesYouCount: number;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenFilters?: () => void;
  isFilterActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  stats,
  matchesCount,
  likesYouCount,
  unreadNotificationsCount,
  onToggleNotifications,
  theme,
  onToggleTheme,
  onOpenFilters,
  isFilterActive = false,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between z-30 shrink-0">
      {/* Brand Identity */}
      <div
        onClick={() => onSelectView('discover')}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500/20 via-zinc-800 to-emerald-500/20 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
          <Layers className="w-4 h-4 text-zinc-100" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-white text-base sm:text-lg">
              SwipeLab
            </span>
            <span className="text-[9px] uppercase font-mono tracking-wider px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-white/5">
              v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1 sm:gap-1.5 bg-zinc-900/90 border border-white/10 p-1 rounded-2xl shadow-inner">
        {/* Discover Tab */}
        <button
          type="button"
          onClick={() => onSelectView('discover')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'discover'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Discover</span>
        </button>

        {/* Likes You Tab */}
        <button
          type="button"
          onClick={() => onSelectView('likes_you')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'likes_you'
              ? 'bg-zinc-800 text-rose-300 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${likesYouCount > 0 ? 'text-rose-500' : ''}`} />
          <span className="hidden sm:inline">Likes You</span>
          {likesYouCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white font-bold">
              {likesYouCount}
            </span>
          )}
        </button>

        {/* Matches / Messages Tab */}
        <button
          type="button"
          onClick={() => onSelectView('matches')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'matches'
              ? 'bg-zinc-800 text-emerald-300 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageCircle
            className={`w-3.5 h-3.5 ${matchesCount > 0 ? 'text-emerald-400' : ''}`}
          />
          <span className="hidden sm:inline">Matches</span>
          {matchesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[10px] text-zinc-950 font-bold">
              {matchesCount}
            </span>
          )}
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => onSelectView('settings')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            currentView === 'settings'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Settings & Profile"
          aria-label="Settings and profile"
        >
          <span className="text-xs">⚙️</span>
          <span className="hidden md:inline">Settings</span>
        </button>
      </nav>

      {/* Right Controls: Filters, Notifications, Theme */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Filters Trigger (Active in Discover View) */}
        {currentView === 'discover' && onOpenFilters && (
          <button
            type="button"
            onClick={onOpenFilters}
            className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
              isFilterActive
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900/90 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Discovery Filters"
            aria-label="Discovery filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isFilterActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>
        )}

        {/* Notifications Popover Trigger */}
        <button
          type="button"
          onClick={onToggleNotifications}
          className="relative p-2 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[9px] font-bold text-zinc-950 flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-sky-400" />
          )}
        </button>
      </div>
    </header>
  );
};
