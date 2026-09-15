'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Heart, X, Sparkles, MapPin, CheckCircle2, UserCheck } from 'lucide-react';
import { Profile } from '../types/profile';
import { ProfileDetailModal } from './ProfileDetailModal';
import { calculateCompatibility } from '../utils/compatibility';
import { hapticMatch, hapticButton } from '../utils/haptics';

interface LikesYouViewProps {
  profiles: Profile[];
  onLikeBack: (profile: Profile) => void;
  onPass: (profileId: string) => void;
  onReport: (profileId: string, reason: string) => void;
}

export const LikesYouView: React.FC<LikesYouViewProps> = ({
  profiles,
  onLikeBack,
  onPass,
  onReport,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const likesYouProfiles = profiles.filter((p) => p.likesYou);

  const handleLikeBack = (e: React.MouseEvent, profile: Profile) => {
    e.stopPropagation();
    hapticMatch();
    onLikeBack(profile);
  };

  const handlePass = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    hapticButton();
    onPass(profileId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex-1 flex flex-col">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Likes You</h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              {likesYouProfiles.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            People who expressed mutual interest in connecting with you
          </p>
        </div>
      </div>

      {/* Grid */}
      {likesYouProfiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-zinc-900/60 border border-white/5 my-auto">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No new likes yet</h3>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
            Your next connection might be around the corner. Keep discovering profiles in the main deck!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {likesYouProfiles.map((profile) => {
            const { score } = calculateCompatibility(profile);
            return (
              <motion.div
                key={profile.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedProfile(profile)}
                className="group relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg cursor-pointer select-none flex flex-col justify-end"
              >
                {/* Background Image */}
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {score}%
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-3 sm:p-3.5 flex flex-col gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                      {profile.name}
                    </h3>
                    <span className="text-sm font-light text-zinc-300">{profile.age}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-zinc-300 truncate">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{profile.location.split('·')[0]}</span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 mt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={(e) => handlePass(e, profile.id)}
                      className="flex-1 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                      title="Pass"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleLikeBack(e, profile)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
                      title="Like Back to Match"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Match</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        isOpen={selectedProfile !== null}
        onClose={() => setSelectedProfile(null)}
        onAction={(dir) => {
          if (!selectedProfile) return;
          if (dir === 'right') {
            onLikeBack(selectedProfile);
          } else {
            onPass(selectedProfile.id);
          }
          setSelectedProfile(null);
        }}
        onReport={(id, reason) => {
          onReport(id, reason);
          setSelectedProfile(null);
        }}
      />
    </div>
  );
};
