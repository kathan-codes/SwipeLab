export interface ProfilePrompt {
  question: string;
  answer: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  pronouns?: string;
  location: string;
  distanceKm?: number;
  bio: string;
  interests: string[];
  image: string;
  prompt?: ProfilePrompt;
  simulatedMatch: boolean;
  verified?: boolean;
}

export type SwipeDirection = 'left' | 'right';

export interface DeckStats {
  total: number;
  remaining: number;
  liked: number;
  passed: number;
  matches: number;
}
