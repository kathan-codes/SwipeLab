'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import { FilterOptions, Profile } from '../types/profile';
import { DEFAULT_FILTERS } from '../utils/storage';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  allProfiles: Profile[];
}

const AVAILABLE_LOCATIONS = [
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Mumbai',
  'Bengaluru',
  'Delhi',
];

const AVAILABLE_INTERESTS = [
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

const GENDER_OPTIONS = [
  { label: 'Everyone', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Non-binary', value: 'non-binary' },
];

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  allProfiles = [],
}) => {
  const [draft, setDraft] = useState<FilterOptions>(filters);

  // Sync draft when opened
  React.useEffect(() => {
    setDraft(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  // Calculate matching profiles count in real time
  const matchingCount = (allProfiles || []).filter((p) => {
    if (p.age < draft.minAge || p.age > draft.maxAge) return false;
    if (draft.locations.length > 0) {
      const matchLoc = draft.locations.some((loc) =>
        p.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (!matchLoc) return false;
    }
    if (draft.interests.length > 0) {
      const matchInt = draft.interests.some((int) =>
        p.interests.some((pi) => pi.toLowerCase().includes(int.toLowerCase()))
      );
      if (!matchInt) return false;
    }
    if (draft.gender !== 'all' && p.gender) {
      if (draft.gender === 'women' && p.gender !== 'woman') return false;
      if (draft.gender === 'men' && p.gender !== 'man') return false;
      if (draft.gender === 'non-binary' && p.gender !== 'non-binary') return false;
    }
    return true;
  }).length;

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

  const handleClear = () => {
    setDraft(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApplyFilters(draft);
    onClose();
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
              <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Discovery Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
            {/* Age Range Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Age Range
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {draft.minAge} — {draft.maxAge} yrs
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-zinc-500 mb-1 block">Min age</span>
                  <input
                    type="range"
                    min="18"
                    max="30"
                    value={draft.minAge}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        minAge: Math.min(Number(e.target.value), draft.maxAge - 1),
                      })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 mb-1 block">Max age</span>
                  <input
                    type="range"
                    min="20"
                    max="35"
                    value={draft.maxAge}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        maxAge: Math.max(Number(e.target.value), draft.minAge + 1),
                      })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                Show Me
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraft({ ...draft, gender: opt.value })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors text-center ${
                      draft.gender === opt.value
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Locations Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Locations
                </label>
                {draft.locations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, locations: [] })}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    Any location
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LOCATIONS.map((loc) => {
                  const isSelected = draft.locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{loc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Interests
                </label>
                {draft.interests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, interests: [] })}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    Any interest
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_INTERESTS.map((int) => {
                  const isSelected = draft.interests.includes(int);
                  return (
                    <button
                      key={int}
                      type="button"
                      onClick={() => toggleInterest(int)}
                      className={`px-2.5 py-1 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                          : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-rose-400" />}
                      <span>{int}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with counts and actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Apply Filters</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-100 text-[10px] font-mono">
                {matchingCount} match{matchingCount === 1 ? '' : 'es'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
