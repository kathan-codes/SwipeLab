export interface ProfilePrompt {
  question: string;
  answer: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender?: 'woman' | 'man' | 'non-binary';
  orientation?: string;
  pronouns?: string;
  location: string;
  distanceKm?: number;
  bio: string;
  interests: string[];
  image: string;
  photos: string[];
  prompt?: ProfilePrompt;
  simulatedMatch: boolean;
  verified?: boolean;
  likesYou?: boolean;
  compatibilityScore?: number;
}

export type SwipeDirection = 'left' | 'right';

export interface DeckStats {
  total: number;
  remaining: number;
  liked: number;
  passed: number;
  matches: number;
}

export interface FilterOptions {
  minAge: number;
  maxAge: number;
  locations: string[];
  interests: string[];
  gender: string; // 'all' | 'women' | 'men' | 'non-binary'
  orientation?: string;
}

export interface DiscoveryPreferences {
  minAge: number;
  maxAge: number;
  locations: string[];
  interests: string[];
  gender: string;
  orientation: string;
  maxDistanceKm: number;
}

export type MessageType = 'text' | 'emoji' | 'sticker' | 'audio' | 'one_time_audio';

export interface MockMessage {
  id: string;
  sender: 'user' | 'match';
  type: MessageType;
  content: string;
  duration?: number; // duration in seconds for audio
  isListened?: boolean; // for one-time audio
  timestamp: string;
}

export type NotificationType = 'like' | 'match' | 'special_like' | 'voice_message';

export interface MockNotification {
  id: string;
  type: NotificationType;
  profileId: string;
  profileName: string;
  profileAvatar: string;
  message: string;
  time: string;
  read: boolean;
}

export type ThemeMode = 'dark' | 'light';

export type AppView = 'discover' | 'likes_you' | 'matches' | 'settings';
