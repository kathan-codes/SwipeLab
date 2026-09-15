import { ChatMessage, Sticker } from '../types/profile';

export const MOCK_STICKERS: Sticker[] = [
  { id: 'st-1', label: 'Nice!', emoji: '✨' },
  { id: 'st-2', label: 'Haha', emoji: '😂' },
  { id: 'st-3', label: 'Wow', emoji: '💫' },
  { id: 'st-4', label: "Let's go!", emoji: '🚀' },
  { id: 'st-5', label: 'Coffee?', emoji: '☕' },
  { id: 'st-6', label: 'Vibes', emoji: '🎧' },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'profile-1': [
    {
      id: 'm1-1',
      matchId: 'profile-1',
      sender: 'match',
      type: 'text',
      content: 'Hey! 👋 Loved your vibe on photography.',
      timestamp: '10:14 AM',
    },
    {
      id: 'm1-2',
      matchId: 'profile-1',
      sender: 'user',
      type: 'text',
      content: 'Hey Maya! Thanks, I saw your note about the 35mm film.',
      timestamp: '10:16 AM',
    },
    {
      id: 'm1-3',
      matchId: 'profile-1',
      sender: 'match',
      type: 'sticker',
      content: 'Coffee? ☕',
      timestamp: '10:18 AM',
    },
    {
      id: 'm1-4',
      matchId: 'profile-1',
      sender: 'match',
      type: 'audio-once',
      content: 'One-time audio memo',
      audioDuration: '0:07',
      listened: false,
      timestamp: '10:19 AM',
    },
  ],
  'profile-2': [
    {
      id: 'm2-1',
      matchId: 'profile-2',
      sender: 'match',
      type: 'text',
      content: 'Hey there! Fellow concrete & architecture enthusiast?',
      timestamp: 'Yesterday',
    },
    {
      id: 'm2-2',
      matchId: 'profile-2',
      sender: 'match',
      type: 'audio',
      content: 'Voice note on Brutalism',
      audioDuration: '0:12',
      timestamp: 'Yesterday',
    },
  ],
  'profile-3': [
    {
      id: 'm3-1',
      matchId: 'profile-3',
      sender: 'match',
      type: 'text',
      content: 'Hi! Ready for a botanical illustration showdown? 🌿',
      timestamp: '2 hrs ago',
    },
  ],
};
