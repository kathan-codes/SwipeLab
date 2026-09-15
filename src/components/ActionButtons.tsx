'use client';

import React, { useEffect } from 'react';
import { X, Heart, RotateCcw } from 'lucide-react';
import { SwipeDirection } from '../types/profile';
import { hapticButton, hapticUndo } from '../utils/haptics';

interface ActionButtonsProps {
  onSwipeAction: (direction: SwipeDirection) => void;
  onUndo?: () => void;
  canUndo?: boolean;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSwipeAction,
  onUndo,
  canUndo = false,
  disabled = false,
}) => {
  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing keyboard if user is in an input or textarea
      if (
        disabled ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        hapticButton();
        onSwipeAction('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        hapticButton();
        onSwipeAction('right');
      } else if ((e.key === 'z' || e.key === 'Z') && canUndo && onUndo) {
        e.preventDefault();
        hapticUndo();
        onUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSwipeAction, onUndo, canUndo, disabled]);

  const handleAction = (dir: SwipeDirection) => {
    hapticButton();
    onSwipeAction(dir);
  };

  const handleUndoClick = () => {
    if (!canUndo || !onUndo || disabled) return;
    hapticUndo();
    onUndo();
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center justify-center gap-2 select-none">
      {/* Undo Button at top of cluster */}
      <button
        type="button"
        onClick={handleUndoClick}
        disabled={disabled || !canUndo}
        aria-label="Undo previous swipe (Z key)"
        title="Undo previous swipe (Z)"
        className={`group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${
          canUndo && !disabled
            ? 'bg-zinc-900/90 border-white/10 text-amber-300 hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-md'
            : 'bg-zinc-950/40 border-white/5 text-zinc-600 opacity-40 cursor-not-allowed'
        }`}
      >
        <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-45" />
        <span>Undo</span>
        <kbd className="hidden sm:inline text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
          Z
        </kbd>
      </button>

      {/* Main PASS / LIKE Controls */}
      <div className="w-full flex items-center justify-center gap-8 pt-1">
        {/* PASS Button */}
        <button
          type="button"
          onClick={() => handleAction('left')}
          disabled={disabled}
          aria-label="Pass on this profile (Left Arrow key)"
          className="group relative w-16 h-16 rounded-full flex flex-col items-center justify-center bg-zinc-900 border border-white/10 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/40 hover:text-rose-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          <X className="w-7 h-7 transition-transform duration-200 group-hover:rotate-6" />
          <span className="sr-only">Pass</span>
          <span className="absolute -bottom-5 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-300">
            ← Pass
          </span>
        </button>

        {/* LIKE Button */}
        <button
          type="button"
          onClick={() => handleAction('right')}
          disabled={disabled}
          aria-label="Like this profile (Right Arrow key)"
          className="group relative w-16 h-16 rounded-full flex flex-col items-center justify-center bg-zinc-900 border border-white/10 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:text-emerald-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <Heart className="w-7 h-7 transition-transform duration-200 group-hover:scale-110 fill-emerald-500/20 group-hover:fill-emerald-400" />
          <span className="sr-only">Like</span>
          <span className="absolute -bottom-5 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-300">
            Like →
          </span>
        </button>
      </div>
    </div>
  );
};
