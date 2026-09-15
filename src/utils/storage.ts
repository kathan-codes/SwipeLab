import { DiscoveryPreferences, FilterOptions, ThemeMode } from '../types/profile';

const THEME_KEY = 'swipelab_theme';
const PREFS_KEY = 'swipelab_discovery_prefs';
const REPORTED_KEY = 'swipelab_reported_ids';

export const DEFAULT_PREFERENCES: DiscoveryPreferences = {
  minAge: 18,
  maxAge: 32,
  locations: ['Ahmedabad', 'Surat', 'Vadodara', 'Mumbai', 'Bengaluru', 'Delhi'],
  interests: ['Photography', 'Music', 'Film', 'Coffee', 'Travel', 'Books', 'Art'],
  gender: 'all',
  orientation: 'all',
  maxDistanceKm: 30,
};

export const DEFAULT_FILTERS: FilterOptions = {
  minAge: 18,
  maxAge: 35,
  locations: [],
  interests: [],
  gender: 'all',
};

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    // Ignore storage restrictions
  }
  return 'dark';
}

export function setStoredTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore
  }
}

export function getStoredPreferences(): DiscoveryPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore
  }
  return DEFAULT_PREFERENCES;
}

export function setStoredPreferences(prefs: DiscoveryPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore
  }
}

export function getStoredReportedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REPORTED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return [];
}

export function addStoredReportedId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredReportedIds();
    if (!current.includes(id)) {
      localStorage.setItem(REPORTED_KEY, JSON.stringify([...current, id]));
    }
  } catch {
    // Ignore
  }
}
