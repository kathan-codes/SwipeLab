'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MapPin, MessageCircle } from 'lucide-react';
import { Profile } from '../types/profile';

interface MatchesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Profile[];
}

export const MatchesDrawer: React.FC<MatchesDrawerProps> = ({ isOpen, onClose, matches }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          {/* Backdrop click to dismiss */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-md h-full bg-zinc-900 border-l border-white/10 p-6 flex flex-col shadow-2xl z-10 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-xl font-bold text-white tracking-tight">Your Matches</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
                  {matches.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close matches panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match list */}
            {matches.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-zinc-300">No matches yet</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Swipe right on profiles with mutual chemistry to simulate a match!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 border border-white/5 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-700">
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <h4 className="text-sm font-bold text-white truncate">{profile.name}</h4>
                        <span className="text-xs text-zinc-400 font-light">{profile.age}</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        {profile.location}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
