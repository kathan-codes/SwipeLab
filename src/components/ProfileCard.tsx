'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, CheckCircle2, Sparkles, ChevronDown, ChevronUp, Compass, Info } from 'lucide-react';
import { Profile } from '../types/profile';
import { calculateCompatibility } from '../utils/compatibility';

interface ProfileCardProps {
  profile: Profile;
  isTopCard?: boolean;
  onOpenDetails?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isTopCard = false,
  onOpenDetails,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : [profile.image];

  const { score } = calculateCompatibility(profile);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length > 1) {
      setCurrentPhotoIdx((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length > 1) {
      setCurrentPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 select-none shadow-2xl flex flex-col justify-end">
      {/* Background Profile Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={photos[currentPhotoIdx] || profile.image}
          alt={`${profile.name}, ${profile.age}`}
          fill
          priority={isTopCard}
          sizes="(max-width: 640px) 100vw, 420px"
          className="object-cover object-center pointer-events-none transition-transform duration-700 ease-out"
        />

        {/* Subtle Dark Vignette & Bottom Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/15 pointer-events-none" />
      </div>

      {/* Top Segmented Photo Indicators */}
      {photos.length > 1 && (
        <div className="absolute top-3 inset-x-4 z-20 flex gap-1 pointer-events-none">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm"
            >
              <div
                className={`h-full transition-all duration-200 ${
                  idx === currentPhotoIdx ? 'bg-white' : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Photo Cycle Tap Zones (Top Half of Card) */}
      {isTopCard && photos.length > 1 && (
        <div className="absolute top-0 inset-x-0 h-1/2 z-10 flex pointer-events-auto">
          <div
            onClick={handlePrevPhoto}
            className="w-1/2 h-full cursor-pointer"
            aria-label="Previous photo"
            title="Previous photo"
          />
          <div
            onClick={handleNextPhoto}
            className="w-1/2 h-full cursor-pointer"
            aria-label="Next photo"
            title="Next photo"
          />
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between mb-auto mt-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-medium text-zinc-200">
          <Compass className="w-3 h-3 text-zinc-300" />
          <span>{profile.distanceKm ?? 4} km away</span>
        </div>

        <div className="flex items-center gap-2">
          {profile.verified && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-[11px] font-medium text-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Verified</span>
            </div>
          )}

          {/* Compatibility Score Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{score}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Profile Information Overlay */}
      <div className="relative z-20 p-5 sm:p-6 flex flex-col gap-2.5 pointer-events-auto">
        {/* Name & Age Header + View Profile Button */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
              {profile.name}
            </h2>
            <span className="text-2xl sm:text-3xl font-light text-zinc-300">
              {profile.age}
            </span>
            {profile.pronouns && (
              <span className="text-xs text-zinc-400 font-mono ml-1">
                ({profile.pronouns})
              </span>
            )}
          </div>

          {/* View Profile Affordance */}
          {onOpenDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
              className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-1 active:scale-95"
              aria-label="View full profile details"
            >
              <Info className="w-3 h-3 text-emerald-400" />
              <span>Details</span>
            </button>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-rose-400/90 shrink-0" />
          <span>{profile.location}</span>
        </div>

        {/* Bio Quote */}
        <p className="text-sm text-zinc-200/95 leading-relaxed font-normal italic border-l-2 border-white/20 pl-2.5 my-0.5 line-clamp-2">
          &ldquo;{profile.bio}&rdquo;
        </p>

        {/* Interests Tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-xs font-medium text-zinc-200 transition-colors"
            >
              {interest}
            </span>
          ))}
          {profile.interests.length > 4 && (
            <span className="px-2 py-1 rounded-lg bg-zinc-900/60 text-xs text-zinc-400">
              +{profile.interests.length - 4}
            </span>
          )}
        </div>

        {/* Optional Interactive Prompt Expand for More Depth */}
        {profile.prompt && (
          <div className="mt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullBio(!showFullBio);
              }}
              className="w-full flex items-center justify-between text-left px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300 transition-colors"
            >
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{profile.prompt.question}</span>
              </span>
              {showFullBio ? (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              )}
            </button>

            {showFullBio && (
              <div className="mt-1 px-3 py-2 rounded-xl bg-zinc-900/95 border border-white/10 text-xs text-zinc-300 animate-in fade-in duration-200 leading-relaxed">
                {profile.prompt.answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
