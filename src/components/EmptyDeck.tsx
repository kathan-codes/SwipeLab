'use client';

import React from 'react';
import { RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';
import { DeckStats } from '../types/profile';

interface EmptyDeckProps {
  stats: DeckStats;
  onReset: () => void;
  isFiltered?: boolean;
  onOpenFilters?: () => void;
}

export const EmptyDeck: React.FC<EmptyDeckProps> = ({
  stats,
  onReset,
  isFiltered = false,
  onOpenFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="w-full h-full rounded-2xl md:rounded-3xl bg-zinc-900/90 border border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center mb-5 text-amber-400">
          <SlidersHorizontal className="w-7 h-7" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
          No profiles match your filters
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mb-6">
          Try widening your preferences or clearing active filters to see more candidate cards.
        </p>

        <div className="flex items-center gap-3">
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Adjust Filters</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Deck</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl md:rounded-3xl bg-zinc-900/90 border border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center mb-5 text-emerald-400">
        <Sparkles className="w-8 h-8" />
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
        You&apos;ve reached the end
      </h3>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mb-6">
        No more profiles for now. You&apos;ve reviewed all candidate cards in this discovery session.
      </p>

      {/* Mini Session Stats Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs mb-6">
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] sm:text-xs text-zinc-400">Reviewed</span>
          <span className="text-lg sm:text-xl font-bold text-zinc-200 mt-0.5">{stats.total}</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center">
          <span className="text-[10px] sm:text-xs text-emerald-300">Liked</span>
          <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">{stats.liked}</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col items-center">
          <span className="text-[10px] sm:text-xs text-rose-300">Matches</span>
          <span className="text-lg sm:text-xl font-bold text-rose-400 mt-0.5">{stats.matches}</span>
        </div>
      </div>

      {/* Reset Deck Button */}
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-lg active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Start Again</span>
      </button>
    </div>
  );
};
