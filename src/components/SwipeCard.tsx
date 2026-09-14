'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'motion/react';
import { Profile, SwipeDirection } from '../types/profile';
import { ProfileCard } from './ProfileCard';

interface SwipeCardProps {
  profile: Profile;
  isTopCard: boolean;
  onSwipe: (direction: SwipeDirection) => void;
  onDragProgress?: (progress: number) => void; // -1 to 1 (left to right)
  forcedSwipe?: SwipeDirection | null;
  onForcedSwipeComplete?: () => void;
}

const SWIPE_THRESHOLD = 110;
const SWIPE_VELOCITY_THRESHOLD = 450;

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  isTopCard,
  onSwipe,
  onDragProgress,
  forcedSwipe,
  onForcedSwipeComplete,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic rotation derived from horizontal displacement
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);

  // Stamps opacity and scale
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const likeScale = useTransform(x, [20, 110], [0.85, 1.05]);
  const passOpacity = useTransform(x, [-20, -110], [0, 1]);
  const passScale = useTransform(x, [-20, -110], [0.85, 1.05]);

  // Track drag progress for underlying card reaction
  useEffect(() => {
    if (!isTopCard) return;
    const unsubscribe = x.on('change', (latest) => {
      if (onDragProgress) {
        const clamped = Math.max(-1, Math.min(1, latest / 150));
        onDragProgress(clamped);
      }
    });
    return () => unsubscribe();
  }, [x, isTopCard, onDragProgress]);

  // Handle external programmatically forced swipes (from buttons or keyboard)
  useEffect(() => {
    if (forcedSwipe && isTopCard) {
      const targetX = forcedSwipe === 'right' ? 850 : -850;
      const targetRotate = forcedSwipe === 'right' ? 22 : -22;

      Promise.all([
        animate(x, targetX, { duration: 0.38, ease: [0.32, 0.72, 0, 1] }),
        animate(rotate, targetRotate, { duration: 0.38, ease: [0.32, 0.72, 0, 1] }),
      ]).then(() => {
        onSwipe(forcedSwipe);
        if (onForcedSwipeComplete) onForcedSwipeComplete();
      });
    }
  }, [forcedSwipe, isTopCard, onSwipe, onForcedSwipeComplete, x, rotate]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    const isSwipedRight =
      offsetX > SWIPE_THRESHOLD || velocityX > SWIPE_VELOCITY_THRESHOLD;
    const isSwipedLeft =
      offsetX < -SWIPE_THRESHOLD || velocityX < -SWIPE_VELOCITY_THRESHOLD;

    if (isSwipedRight) {
      animate(x, 850, {
        duration: 0.34,
        ease: [0.32, 0.72, 0, 1],
      }).then(() => {
        onSwipe('right');
      });
    } else if (isSwipedLeft) {
      animate(x, -850, {
        duration: 0.34,
        ease: [0.32, 0.72, 0, 1],
      }).then(() => {
        onSwipe('left');
      });
    } else {
      // Below threshold: smooth physical spring return
      animate(x, 0, {
        type: 'spring',
        stiffness: 450,
        damping: 30,
      });
      animate(y, 0, {
        type: 'spring',
        stiffness: 450,
        damping: 30,
      });
      if (onDragProgress) onDragProgress(0);
    }
  };

  if (!isTopCard) {
    return (
      <div className="w-full h-full pointer-events-none">
        <ProfileCard profile={profile} isTopCard={false} />
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        x,
        y,
        rotate,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.88}
      onDragEnd={handleDragEnd}
      className="relative w-full h-full cursor-grab active:cursor-grabbing swipe-card-container will-change-transform select-none"
    >
      <ProfileCard profile={profile} isTopCard={true} />

      {/* LIKE Stamp (Right Swipe) */}
      <motion.div
        style={{
          opacity: likeOpacity,
          scale: likeScale,
        }}
        className="absolute top-8 left-7 z-30 pointer-events-none -rotate-12 border-[3px] sm:border-4 border-emerald-400 text-emerald-400 font-black tracking-widest text-2xl sm:text-3xl uppercase px-4 py-1.5 rounded-xl bg-emerald-950/60 backdrop-blur-sm shadow-xl"
      >
        LIKE
      </motion.div>

      {/* PASS / NOPE Stamp (Left Swipe) */}
      <motion.div
        style={{
          opacity: passOpacity,
          scale: passScale,
        }}
        className="absolute top-8 right-7 z-30 pointer-events-none rotate-12 border-[3px] sm:border-4 border-rose-500 text-rose-500 font-black tracking-widest text-2xl sm:text-3xl uppercase px-4 py-1.5 rounded-xl bg-rose-950/60 backdrop-blur-sm shadow-xl"
      >
        PASS
      </motion.div>
    </motion.div>
  );
};
