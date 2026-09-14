'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, CheckCircle2, Sparkles, ChevronDown, ChevronUp, Compass } from 'lucide-react';
import { Profile } from '../types/profile';

interface ProfileCardProps {
  profile: Profile;
  isTopCard?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isTopCard = false }) => {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 select-none shadow-2xl flex flex-col justify-end">
      {/* Background Profile Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={profile.image}
          alt={`${profile.name}, ${profile.age}`}
          fill
          priority={isTopCard}
          sizes="(max-width: 640px) 100vw, 420px"
          className="object-cover object-center pointer-events-none transition-transform duration-700 ease-out"
        />
        
        {/* Subtle Dark Vignette & Bottom Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/15 pointer-events-none" />
      </div>

      {/* Top Meta Bar */}
      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between pointer-events-none mb-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-zinc-200">
          <Compass className="w-3 h-3 text-zinc-300" />
          <span>{profile.distanceKm} km away</span>
        </div>

        {profile.verified && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-[11px] font-medium text-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Bottom Profile Information Overlay */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-3">
        {/* Name & Age Header */}
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

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-rose-400/90 shrink-0" />
          <span>{profile.location}</span>
        </div>

        {/* Bio Quote */}
        <p className="text-sm text-zinc-200/95 leading-relaxed font-normal italic border-l-2 border-white/20 pl-2.5 my-0.5">
          &ldquo;{profile.bio}&rdquo;
        </p>

        {/* Interests Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-xs font-medium text-zinc-200 transition-colors"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Optional Interactive Prompt Expand for More Depth */}
        {profile.prompt && (
          <div className="mt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullBio(!showFullBio);
              }}
              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300 transition-colors"
            >
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {profile.prompt.question}
              </span>
              {showFullBio ? (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {showFullBio && (
              <div className="mt-1.5 px-3 py-2 rounded-xl bg-zinc-900/95 border border-white/10 text-xs text-zinc-300 animate-in fade-in duration-200 leading-relaxed">
                {profile.prompt.answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
