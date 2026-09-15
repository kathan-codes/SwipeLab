import { Profile, DiscoveryPreferences } from '../types/profile';

export interface CompatibilityReason {
  label: string;
  iconType: 'interest' | 'location' | 'age' | 'verified' | 'spark';
}

export interface CompatibilityResult {
  score: number;
  reasons: CompatibilityReason[];
}

/**
 * Deterministically computes a profile's compatibility score and reasons
 * based on profile attributes and the user's discovery preferences.
 */
export function calculateCompatibility(
  profile: Profile,
  preferences?: DiscoveryPreferences | null
): CompatibilityResult {
  // Base deterministic seed from profile ID string characters
  let seed = 0;
  for (let i = 0; i < profile.id.length; i++) {
    seed = (seed * 31 + profile.id.charCodeAt(i)) % 1000;
  }

  const userInterests = preferences?.interests || [
    'Photography',
    'Coffee',
    'Film',
    'Music',
    'Travel',
    'Books',
  ];

  // Find shared interests
  const sharedInterests = profile.interests.filter((interest) =>
    userInterests.some((ui) => ui.toLowerCase() === interest.toLowerCase())
  );

  const reasons: CompatibilityReason[] = [];

  // Add shared interests reasons
  sharedInterests.slice(0, 2).forEach((interest) => {
    reasons.push({
      label: `Shared interest: ${interest}`,
      iconType: 'interest',
    });
  });

  // Location reason
  if (profile.location) {
    const city = profile.location.split('·')[0].trim();
    reasons.push({
      label: `Discovery area: ${city} (${profile.distanceKm || 4} km away)`,
      iconType: 'location',
    });
  }

  // Age reason
  const minAge = preferences?.minAge ?? 20;
  const maxAge = preferences?.maxAge ?? 30;
  if (profile.age >= minAge && profile.age <= maxAge) {
    reasons.push({
      label: `Within preferred age range (${profile.age} yrs)`,
      iconType: 'age',
    });
  } else {
    reasons.push({
      label: `Complementary personality & lifestyle`,
      iconType: 'spark',
    });
  }

  if (profile.verified) {
    reasons.push({
      label: `Verified genuine identity`,
      iconType: 'verified',
    });
  }

  // Deterministic score calculation:
  // Base 74 + up to 10 for shared interests + 6 for location + 6 for age + seed variation (0-5)
  let score = 74;
  score += Math.min(12, sharedInterests.length * 6);
  if (profile.distanceKm && profile.distanceKm <= 8) score += 5;
  if (profile.verified) score += 3;
  score += (seed % 6);

  // Clamp score between 75 and 98
  score = Math.min(98, Math.max(75, score));

  return {
    score,
    reasons: reasons.slice(0, 4),
  };
}
