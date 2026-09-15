/**
 * Safe haptic feedback helper using progressive enhancement.
 * Gracefully no-ops in browsers or environments without vibration support.
 */

export const triggerHaptic = (pattern: number | number[]) => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore unsupported devices / permissions silently
  }
};

/**
 * Triggered once when the swipe threshold is crossed during dragging
 */
export const hapticThreshold = () => triggerHaptic(15);

/**
 * Triggered when clicking Like or Pass buttons
 */
export const hapticButton = () => triggerHaptic(20);

/**
 * Triggered on mutual simulated match
 */
export const hapticMatch = () => triggerHaptic([35, 50, 75]);

/**
 * Triggered when undoing a swipe
 */
export const hapticUndo = () => triggerHaptic(12);
