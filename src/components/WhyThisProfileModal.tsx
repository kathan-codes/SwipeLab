'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check, MapPin, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { Profile } from '../types/profile';
import { calculateCompatibility, CompatibilityReason } from '../utils/compatibility';

interface WhyThisProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyThisProfileModal: React.FC<WhyThisProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !profile) return null;

  const { score, reasons } = calculateCompatibility(profile);

  const renderIcon = (type: CompatibilityReason['iconType']) => {
    switch (type) {
      case 'interest':
        return <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'age':
        return <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'verified':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 p-6 shadow-2xl z-10 text-zinc-100"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close why this profile dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Why {profile.name}?</h3>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
              {score}% Compatible
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              Based on your discovery preferences
            </span>
          </div>

          <div className="space-y-2.5 mb-6">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-white/5 text-xs text-zinc-200"
              >
                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                  {renderIcon(reason.iconType)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="leading-snug">{reason.label}</span>
                </div>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 text-center mb-5 leading-relaxed">
            Compatibility signals are simulated transparently from mutual interests, location proximity, and age preference alignment.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
          >
            Got it
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
