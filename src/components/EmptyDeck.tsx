'use client';

import React from 'react';
import { RotateCcw, Heart, Flame, Sparkles } from 'lucide-react';
import { DeckStats } from '../types/profile';

interface EmptyDeckProps {
  stats: DeckStats;
  onReset: () => void;
}

export const EmptyDeck: React.FC<EmptyDeckProps> = ({ stats, onReset }) => {
  return (
    <div className="w-full h-full rounded-2xl md:rounded-3xl bg-zinc-900/90 border border-white/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center mb-6 shadow-inner text-emerald-400">
        <Sparkles className="w-8 h-8" />
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
        You&apos;ve reached the end.
      </h3>
      <p className="text-sm text-zinc-400 max-w-xs mb-8">
        No more profiles for now. You&apos;ve explored all candidate cards in this workshop session.
      </p>

      {/* Mini Session Stats Summary */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-8">
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex flex-col items-center">
          <span className="text-xs text-zinc-400">Reviewed</span>
          <span className="text-xl font-bold text-zinc-200 mt-0.5">{stats.total}</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center">
          <span className="text-xs text-emerald-300">Liked</span>
          <span className="text-xl font-bold text-emerald-400 mt-0.5">{stats.liked}</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col items-center">
          <span className="text-xs text-rose-300">Matches</span>
          <span className="text-xl font-bold text-rose-400 mt-0.5">{stats.matches}</span>
        </div>
      </div>

      {/* Reset Deck Button */}
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Start Again</span>
      </button>
    </div>
  );
};
