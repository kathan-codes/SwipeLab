'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Profile } from '../types/profile';

interface MatchModalProps {
  matchedProfile: Profile | null;
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ matchedProfile, onClose }) => {
  useEffect(() => {
    if (matchedProfile) {
      // Elegant, restrained confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f43f5e', '#38bdf8', '#fbbf24'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        // Fallback gracefully if canvas unavailable
      }

      // Close on Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [matchedProfile, onClose]);

  return (
    <AnimatePresence>
      {matchedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/15 p-6 text-center shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="Close match dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Subtle glow badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Simulated Discovery
            </div>

            {/* Title */}
            <h3 className="text-3xl font-black tracking-tight text-white uppercase mb-1">
              It&apos;s a Match!
            </h3>
            <p className="text-sm text-zinc-300 mb-6">
              You and <span className="font-semibold text-white">{matchedProfile.name}</span> liked each other.
            </p>

            {/* Interlocking Portrait Avatars */}
            <div className="relative w-44 h-28 mx-auto mb-6 flex items-center justify-center">
              {/* User Avatar Placeholder */}
              <div className="absolute left-4 w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl rotate-[-6deg] bg-zinc-800">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                  alt="You"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Matched Profile Avatar */}
              <div className="absolute right-4 w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-400 shadow-xl rotate-[6deg] bg-zinc-800">
                <Image
                  src={matchedProfile.image}
                  alt={matchedProfile.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                <span>Keep Discovering</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-colors border border-white/5 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Simulate Icebreaker Note</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
