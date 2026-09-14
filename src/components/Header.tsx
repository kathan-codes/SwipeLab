'use client';

import React from 'react';
import { Sparkles, Heart, Layers, Command } from 'lucide-react';
import { DeckStats } from '../types/profile';

interface HeaderProps {
  stats: DeckStats;
  onOpenMatches: () => void;
  matchesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ stats, onOpenMatches, matchesCount }) => {
  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between z-30">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500/20 via-zinc-800 to-emerald-500/20 border border-white/10 flex items-center justify-center shadow-inner">
          <Layers className="w-4 h-4 text-zinc-100" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight text-zinc-100 text-lg">SwipeLab</span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-white/5">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-normal">Tactile Discovery Workshop</p>
        </div>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-2">
        {/* Remaining Count Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{stats.remaining} remaining</span>
        </div>

        {/* Matches Drawer Trigger */}
        <button
          onClick={onOpenMatches}
          aria-label={`View matches (${matchesCount})`}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
            matchesCount > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              matchesCount > 0 ? 'fill-rose-500 text-rose-500 group-hover:scale-110' : ''
            }`}
          />
          <span>Matches</span>
          {matchesCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white font-bold">
              {matchesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
