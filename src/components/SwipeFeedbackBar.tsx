'use client';

import React from 'react';
import { X, Heart } from 'lucide-react';

interface SwipeFeedbackBarProps {
  dragProgress: number; // -1 to 1 (left to right)
}

export const SwipeFeedbackBar: React.FC<SwipeFeedbackBarProps> = ({ dragProgress }) => {
  // Clamp progress for calculations
  const clampedProgress = Math.max(-1, Math.min(1, dragProgress));
  const absProgress = Math.abs(clampedProgress);
  const isRight = clampedProgress > 0;
  const isLeft = clampedProgress < 0;
  const isCommitted = absProgress >= 0.73; // corresponds to ~110px / 150px

  // Opacities derived continuously from drag position
  const passOpacity = isLeft ? Math.min(1, 0.2 + absProgress * 0.8) : 0.25;
  const likeOpacity = isRight ? Math.min(1, 0.2 + absProgress * 0.8) : 0.25;

  // Track position from -45% to +45%
  const dotOffset = clampedProgress * 42;

  return (
    <div
      className="w-full max-w-xs mx-auto px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono select-none"
      aria-hidden="true"
    >
      {/* Left indicator: PASS */}
      <div
        style={{ opacity: passOpacity }}
        className={`flex items-center gap-1 font-bold transition-colors duration-150 ${
          isLeft && isCommitted
            ? 'text-rose-500 scale-105'
            : isLeft
            ? 'text-rose-400'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        <X className="w-3.5 h-3.5" />
        <span>PASS</span>
      </div>

      {/* Center dynamic progress track */}
      <div className="flex-1 relative h-2 bg-zinc-200 dark:bg-zinc-800/80 rounded-full overflow-visible flex items-center justify-center border border-black/5 dark:border-white/5">
        {/* Center neutral notch */}
        <div className="w-1 h-2 bg-zinc-400/40 dark:bg-zinc-600/40 rounded-full" />

        {/* Left threshold marker */}
        <div className="absolute left-[25%] w-0.5 h-1.5 bg-rose-500/30 rounded-full" />

        {/* Right threshold marker */}
        <div className="absolute right-[25%] w-0.5 h-1.5 bg-emerald-500/30 rounded-full" />

        {/* Dynamic moving dot */}
        <div
          style={{
            transform: `translateX(${dotOffset}px)`,
            transition: absProgress === 0 ? 'transform 0.25s ease-out' : 'none',
          }}
          className={`absolute w-3 h-3 rounded-full shadow-md ${
            isLeft
              ? isCommitted
                ? 'bg-rose-500 ring-4 ring-rose-500/20 scale-125'
                : 'bg-rose-400 scale-110'
              : isRight
              ? isCommitted
                ? 'bg-emerald-400 ring-4 ring-emerald-400/20 scale-125'
                : 'bg-emerald-400 scale-110'
              : 'bg-zinc-400 dark:bg-zinc-500 scale-90'
          }`}
        />
      </div>

      {/* Right indicator: LIKE */}
      <div
        style={{ opacity: likeOpacity }}
        className={`flex items-center gap-1 font-bold transition-colors duration-150 ${
          isRight && isCommitted
            ? 'text-emerald-400 scale-105'
            : isRight
            ? 'text-emerald-300'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        <span>LIKE</span>
        <Heart className="w-3.5 h-3.5 fill-current" />
      </div>
    </div>
  );
};
