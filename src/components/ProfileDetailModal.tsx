'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Heart,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { Profile, SwipeDirection } from '../types/profile';
import { calculateCompatibility } from '../utils/compatibility';
import { WhyThisProfileModal } from './WhyThisProfileModal';
import { ReportModal } from './ReportModal';
import { hapticButton } from '../utils/haptics';

interface ProfileDetailModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (direction: SwipeDirection) => void;
  onReport?: (profileId: string, reason: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  onClose,
  onAction,
  onReport,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Reset photo index when profile changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
    setIsWhyModalOpen(false);
    setIsReportModalOpen(false);
  }, [profile?.id]);

  const photos = profile?.photos && profile.photos.length > 0
    ? profile.photos
    : profile?.image ? [profile.image] : [];

  const handleNextPhoto = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || isWhyModalOpen || isReportModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isWhyModalOpen, isReportModalOpen, onClose, handleNextPhoto, handlePrevPhoto]);

  if (!isOpen || !profile) return null;

  const { score } = calculateCompatibility(profile);

  const handleSwipeAction = (direction: SwipeDirection) => {
    hapticButton();
    onClose();
    if (onAction) onAction(direction);
  };

  const handleReportSubmitted = (id: string, reason: string) => {
    if (onReport) onReport(id, reason);
    setIsReportModalOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-md my-auto rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl z-10 overflow-hidden text-zinc-100 flex flex-col max-h-[92vh]"
        >
          {/* Top Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close profile details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Multi-Photo Carousel Area */}
          <div className="relative w-full h-80 sm:h-96 shrink-0 bg-zinc-950 select-none overflow-hidden">
            {photos[currentPhotoIndex] && (
              <Image
                src={photos[currentPhotoIndex]}
                alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
                fill
                priority
                className="object-cover"
              />
            )}

            {/* Gradient Scrims */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />

            {/* Photo Segmented Progress Bars (Instagram/Tinder style) */}
            {photos.length > 1 && (
              <div className="absolute top-3 inset-x-4 z-20 flex gap-1.5 pointer-events-none">
                {photos.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm"
                  >
                    <div
                      className={`h-full transition-all duration-200 ${
                        idx === currentPhotoIndex
                          ? 'bg-white'
                          : idx < currentPhotoIndex
                          ? 'bg-white/70'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Photo Tap Zones (Left/Right) */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer focus:outline-none flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Previous photo"
                >
                  <span className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer focus:outline-none flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Next photo"
                >
                  <span className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </button>
              </>
            )}

            {/* Distance & Verified Pill */}
            <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-zinc-200">
                <Compass className="w-3.5 h-3.5 text-zinc-300" />
                <span>{profile.distanceKm ?? 4} km away</span>
              </div>
              {profile.verified && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/25 backdrop-blur-md border border-blue-400/40 text-[11px] font-medium text-blue-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Profile Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Header: Name, Age, Pronouns */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold tracking-tight text-white">{profile.name}</h2>
                  <span className="text-2xl font-light text-zinc-300">{profile.age}</span>
                  {profile.pronouns && (
                    <span className="text-xs text-zinc-400 font-mono">({profile.pronouns})</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>

              {/* Compatibility Pill */}
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {score}% Match
                </span>
              </div>
            </div>

            {/* "Why This Profile?" Card Button */}
            <button
              type="button"
              onClick={() => setIsWhyModalOpen(true)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-200 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Why this profile was recommended to you</span>
              </div>
              <span className="text-zinc-400 text-[11px] group-hover:text-white transition-colors">
                View signals →
              </span>
            </button>

            {/* Bio Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                About
              </h3>
              <p className="text-sm text-zinc-200 leading-relaxed italic border-l-2 border-white/20 pl-3">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>

            {/* Interests Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                Interests & Passions
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Card if available */}
            {profile.prompt && (
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {profile.prompt.question}
                </p>
                <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                  {profile.prompt.answer}
                </p>
              </div>
            )}

            {/* Action Bar inside Details: Pass, Like, and Report */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-rose-400 transition-colors p-2"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report profile</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSwipeAction('left')}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <X className="w-4 h-4" />
                  <span>Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwipeAction('right')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Like</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sub-modals */}
        <WhyThisProfileModal
          profile={profile}
          isOpen={isWhyModalOpen}
          onClose={() => setIsWhyModalOpen(false)}
        />

        <ReportModal
          profile={profile}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onReportSubmitted={handleReportSubmitted}
        />
      </div>
    </AnimatePresence>
  );
};
