'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, X, Save, Check } from 'lucide-react';
import { DiscoveryPreferences } from '../types/profile';
import { DEFAULT_PREFERENCES, setStoredPreferences } from '../utils/storage';

interface DiscoveryPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: DiscoveryPreferences;
  onSavePreferences: (prefs: DiscoveryPreferences) => void;
}

const LOCATIONS_LIST = ['Ahmedabad', 'Surat', 'Vadodara', 'Mumbai', 'Bengaluru', 'Delhi'];
const INTERESTS_LIST = [
  'Photography',
  'Coffee',
  'Film',
  'Music',
  'Travel',
  'Books',
  'Art',
  'Coding',
  'Food',
  'Sports',
];

export const DiscoveryPreferencesModal: React.FC<DiscoveryPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [draft, setDraft] = useState<DiscoveryPreferences>(preferences);
  const [savedToast, setSavedToast] = useState(false);

  React.useEffect(() => {
    setDraft(preferences);
  }, [preferences, isOpen]);

  if (!isOpen) return null;

  const toggleLocation = (loc: string) => {
    setDraft((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter((l) => l !== loc)
        : [...prev.locations, loc],
    }));
  };

  const toggleInterest = (int: string) => {
    setDraft((prev) => ({
      ...prev,
      interests: prev.interests.includes(int)
        ? prev.interests.filter((i) => i !== int)
        : [...prev.interests, int],
    }));
  };

  const handleSave = () => {
    setStoredPreferences(draft);
    onSavePreferences(draft);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md max-h-[90vh] rounded-3xl bg-zinc-900 border border-white/10 p-5 sm:p-6 shadow-2xl z-10 flex flex-col overflow-hidden text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white">Discovery Preferences</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close preferences"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
            {/* Age */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Target Age Range
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {draft.minAge} – {draft.maxAge} years
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-zinc-500">Min</span>
                  <input
                    type="range"
                    min="18"
                    max="28"
                    value={draft.minAge}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        minAge: Math.min(Number(e.target.value), draft.maxAge - 1),
                      })
                    }
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500">Max</span>
                  <input
                    type="range"
                    min="22"
                    max="45"
                    value={draft.maxAge}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        maxAge: Math.max(Number(e.target.value), draft.minAge + 1),
                      })
                    }
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Max Distance */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Maximum Distance
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {draft.maxDistanceKm} km
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={draft.maxDistanceKm}
                onChange={(e) => setDraft({ ...draft, maxDistanceKm: Number(e.target.value) })}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Preferred Locations */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                Preferred Cities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {LOCATIONS_LIST.map((loc) => {
                  const isSelected = draft.locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                          : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-sky-400" />}
                      <span>{loc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Interests */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                Passions You Love Seeing
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS_LIST.map((int) => {
                  const isSelected = draft.interests.includes(int);
                  return (
                    <button
                      key={int}
                      type="button"
                      onClick={() => toggleInterest(int)}
                      className={`px-2.5 py-1 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{int}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setDraft(DEFAULT_PREFERENCES)}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-medium transition-colors"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>Saved locally!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
