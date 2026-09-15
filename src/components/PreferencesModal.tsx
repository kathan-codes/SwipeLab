'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Moon, Sun, Save, Check, Keyboard, Compass } from 'lucide-react';
import { UserPreferences, GenderOption } from '../types/profile';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const AVAILABLE_LOCATIONS = [
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Mumbai',
  'Delhi',
  'Bengaluru',
];

const AVAILABLE_INTERESTS = [
  'Photography',
  'Film',
  'Coffee',
  'Music',
  'Travel',
  'Books',
  'Sports',
  'Art',
  'Coding',
  'Food',
];

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  theme,
  onToggleTheme,
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    setLocalPrefs(preferences);
    setSavedSuccess(false);
  }, [preferences, isOpen]);

  if (!isOpen) return null;

  const toggleLocation = (loc: string) => {
    setLocalPrefs((prev) => {
      const exists = prev.locations.includes(loc);
      return {
        ...prev,
        locations: exists
          ? prev.locations.filter((l) => l !== loc)
          : [...prev.locations, loc],
      };
    });
  };

  const toggleInterest = (interest: string) => {
    setLocalPrefs((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Discovery Preferences & Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Settings Form */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
            {/* Theme Toggle Section */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Appearance Theme</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Currently using <span className="font-semibold text-zinc-200 capitalize">{theme}</span> interface
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-white/10 transition-all active:scale-95"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-sky-400" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Maximum Distance Setting */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-rose-400" />
                  Maximum Distance
                </span>
                <span className="font-mono text-rose-400">{localPrefs.maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={localPrefs.maxDistanceKm}
                onChange={(e) =>
                  setLocalPrefs((prev) => ({
                    ...prev,
                    maxDistanceKm: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-rose-500"
              />
            </div>

            {/* Age Range Setting */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-2">
                <span>Preferred Age Range</span>
                <span className="font-mono text-rose-400">
                  {localPrefs.ageRange[0]} — {localPrefs.ageRange[1]} yrs
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min="18"
                  max="28"
                  value={localPrefs.ageRange[0]}
                  onChange={(e) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      ageRange: [
                        Math.min(parseInt(e.target.value), prev.ageRange[1] - 1),
                        prev.ageRange[1],
                      ],
                    }))
                  }
                  className="w-full accent-rose-500"
                />
                <input
                  type="range"
                  min="21"
                  max="35"
                  value={localPrefs.ageRange[1]}
                  onChange={(e) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      ageRange: [
                        prev.ageRange[0],
                        Math.max(parseInt(e.target.value), prev.ageRange[0] + 1),
                      ],
                    }))
                  }
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* Gender Preference */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-2">
                Discovery Gender Filter
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['all', 'women', 'men', 'non-binary'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setLocalPrefs((prev) => ({
                        ...prev,
                        gender: g as GenderOption | 'all',
                      }))
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-medium capitalize border transition-all ${
                      localPrefs.gender === g
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-sm'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Locations */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-2">
                Preferred Cities
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LOCATIONS.map((loc) => {
                  const isSelected = localPrefs.locations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{loc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Interests */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 block mb-2">
                Preferred Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = localPrefs.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Keyboard Shortcuts Cheat Sheet */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Keyboard className="w-4 h-4 text-zinc-400" />
                <span>Keyboard Shortcuts Reference</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/60 border border-white/5">
                  <span>Pass profile</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">←</kbd>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/60 border border-white/5">
                  <span>Like profile</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">→</kbd>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/60 border border-white/5">
                  <span>Undo swipe</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">Z</kbd>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/60 border border-white/5">
                  <span>View profile</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/60 border border-white/5 col-span-2">
                  <span>Close any open modal</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">Esc</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Preferences Saved!</span>
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
