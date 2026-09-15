'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Send,
  Smile,
  Sticker as StickerIcon,
  Play,
  Pause,
  Clock,
  Sparkles,
  MapPin,
  Check,
  CheckCheck,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { Profile, MockMessage } from '../types/profile';
import { INITIAL_MESSAGES_MAP } from '../data/mockProfiles';

interface MessagingViewProps {
  matches: Profile[];
  initialMatchId?: string | null;
  onOpenProfile?: (profile: Profile) => void;
  onBackToDiscover?: () => void;
}

const QUICK_EMOJIS = ['😂', '❤️', '👍', '👋', '😊', '🎉', '☕', '✨'];

const STICKERS = [
  { label: 'Nice! ✨', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { label: 'Haha 😂', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { label: 'Wow 😮', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { label: "Let's go! 🚀", bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { label: 'Coffee? ☕', bg: 'bg-amber-600/20 text-amber-200 border-amber-500/30' },
  { label: 'Cheers! 🥂', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
];

export const MessagingView: React.FC<MessagingViewProps> = ({
  matches,
  initialMatchId,
  onOpenProfile,
  onBackToDiscover,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(
    initialMatchId || (matches[0]?.id ?? null)
  );
  const [messagesMap, setMessagesMap] = useState<Record<string, MockMessage[]>>(INITIAL_MESSAGES_MAP);
  const [inputText, setInputText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showStickerPicker, setShowStickerPicker] = useState<boolean>(false);

  // Audio playback simulator states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0); // 0 to 100
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesMap, selectedMatchId]);

  // Keep selected match in sync if matches list changes
  useEffect(() => {
    if (initialMatchId) {
      setSelectedMatchId(initialMatchId);
    } else if (!selectedMatchId && matches.length > 0) {
      setSelectedMatchId(matches[0].id);
    }
  }, [initialMatchId, matches, selectedMatchId]);

  const activeMatch = matches.find((m) => m.id === selectedMatchId) || null;
  const currentMessages = selectedMatchId ? messagesMap[selectedMatchId] || [] : [];

  // Cleanup audio timer
  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  const handleTogglePlayAudio = (message: MockMessage) => {
    if (message.type === 'one_time_audio' && message.isListened) {
      return; // already listened, cannot replay
    }

    if (playingAudioId === message.id) {
      // Pause
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(null);
      return;
    }

    // Start playing
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setPlayingAudioId(message.id);
    setAudioProgress(0);

    const totalSeconds = message.duration || 8;
    const intervalMs = 100;
    const step = (intervalMs / (totalSeconds * 1000)) * 100;

    let current = 0;
    audioIntervalRef.current = setInterval(() => {
      current += step;
      if (current >= 100) {
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        setPlayingAudioId(null);
        setAudioProgress(0);

        // If it's a one_time_audio, mark as listened
        if (message.type === 'one_time_audio' && selectedMatchId) {
          setMessagesMap((prev) => {
            const list = prev[selectedMatchId] || [];
            return {
              ...prev,
              [selectedMatchId]: list.map((msg) =>
                msg.id === message.id ? { ...msg, isListened: true } : msg
              ),
            };
          });
        }
      } else {
        setAudioProgress(current);
      }
    }, intervalMs);
  };

  const handleSendMessage = (content: string, type: MockMessage['type'] = 'text') => {
    if (!content.trim() || !selectedMatchId) return;

    const newMessage: MockMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedMatchId]: [...(prev[selectedMatchId] || []), newMessage],
    }));

    setInputText('');
    setShowEmojiPicker(false);
    setShowStickerPicker(false);

    // Realistic simulated reply after 1.5 seconds
    setTimeout(() => {
      const replies = [
        "That's so true! 😄",
        'Haha definitely! By the way, are you free this weekend for coffee?',
        'Totally agree with you on that! 🙌',
        'I love that! Tell me more about your recent projects.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: MockMessage = {
        id: `reply-${Date.now()}`,
        sender: 'match',
        type: 'text',
        content: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessagesMap((prev) => ({
        ...prev,
        [selectedMatchId]: [...(prev[selectedMatchId] || []), replyMsg],
      }));
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto my-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-rose-500 mb-4 shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1.5">No matches yet</h3>
        <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-6">
          Swipe right on candidate profiles in the Discover deck or connect with people who liked you to start chatting!
        </p>
        {onBackToDiscover && (
          <button
            type="button"
            onClick={onBackToDiscover}
            className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-all shadow-md active:scale-95"
          >
            Go to Discover
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 h-[calc(100vh-140px)] min-h-[500px]">
      {/* Sidebar: Matches List */}
      <div className="w-full sm:w-72 md:w-80 shrink-0 bg-zinc-900/90 border border-white/10 rounded-3xl p-3 sm:p-4 flex flex-col shadow-xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
          <h3 className="text-base font-bold text-white tracking-tight">Your Matches</h3>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
            {matches.length}
          </span>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
          {matches.map((match) => {
            const isSelected = match.id === selectedMatchId;
            const msgs = messagesMap[match.id] || [];
            const lastMsg = msgs[msgs.length - 1];

            return (
              <button
                key={match.id}
                type="button"
                onClick={() => setSelectedMatchId(match.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-colors ${
                  isSelected
                    ? 'bg-zinc-800 border-rose-500/40 shadow-sm'
                    : 'bg-zinc-950/40 border-transparent hover:bg-zinc-800/60'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                  <Image src={match.image} alt={match.name} fill className="object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{match.name}</span>
                    <span className="text-[10px] text-zinc-500">{match.age}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {lastMsg ? lastMsg.content : `Say hi to ${match.name}! 👋`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Conversation Area */}
      {activeMatch ? (
        <div className="flex-1 bg-zinc-900/90 border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-zinc-950/40 shrink-0">
            <div className="flex items-center gap-3">
              <div
                onClick={() => onOpenProfile && onOpenProfile(activeMatch)}
                className="relative w-10 h-10 rounded-xl overflow-hidden cursor-pointer border border-white/10"
                title="View profile details"
              >
                <Image src={activeMatch.image} alt={activeMatch.name} fill className="object-cover" />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onOpenProfile && onOpenProfile(activeMatch)}
                  className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{activeMatch.name}</span>
                  <span className="text-xs font-light text-zinc-400">{activeMatch.age}</span>
                </button>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active now
                </span>
              </div>
            </div>

            {onOpenProfile && (
              <button
                type="button"
                onClick={() => onOpenProfile(activeMatch)}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-800 border border-white/10 transition-colors"
              >
                View Profile
              </button>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* Icebreaker Match Welcome */}
            <div className="text-center py-4 px-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                You matched with {activeMatch.name}
              </div>
              <p className="text-[11px] text-zinc-500">
                You both liked each other. Send an icebreaker to get things started!
              </p>
            </div>

            {/* Message Thread */}
            {currentMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isPlayingThis = playingAudioId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Text Message */}
                  {msg.type === 'text' && (
                    <div
                      className={`max-w-[80%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-rose-600 text-white rounded-br-sm shadow-md'
                          : 'bg-zinc-800 border border-white/10 text-zinc-100 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* Sticker Message */}
                  {msg.type === 'sticker' && (
                    <div className="p-3 rounded-2xl border text-sm font-bold shadow-md bg-zinc-800 border-white/15">
                      {msg.content}
                    </div>
                  )}

                  {/* Standard Audio Message */}
                  {msg.type === 'audio' && (
                    <div className="p-3 rounded-2xl bg-zinc-800/90 border border-white/10 flex items-center gap-3 w-60 shadow-md">
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(msg)}
                        className="w-9 h-9 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center hover:bg-emerald-400 transition-colors shrink-0"
                        aria-label={isPlayingThis ? 'Pause audio' : 'Play audio'}
                      >
                        {isPlayingThis ? (
                          <Pause className="w-4 h-4 fill-zinc-950" />
                        ) : (
                          <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-100"
                            style={{ width: isPlayingThis ? `${audioProgress}%` : '0%' }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1 text-[10px] text-zinc-400">
                          <span>Voice Note</span>
                          <span>0:0{msg.duration ?? 8}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* One-Time Listenable Audio Message */}
                  {msg.type === 'one_time_audio' && (
                    <div
                      className={`p-3 rounded-2xl border flex items-center gap-3 w-64 shadow-md transition-all ${
                        msg.isListened
                          ? 'bg-zinc-950/60 border-white/5 opacity-60'
                          : 'bg-gradient-to-r from-purple-900/40 to-zinc-800 border-purple-500/30'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(msg)}
                        disabled={msg.isListened}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          msg.isListened
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : isPlayingThis
                            ? 'bg-purple-500 text-white animate-pulse'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                        aria-label="Play one-time audio"
                      >
                        {msg.isListened ? (
                          <Check className="w-4 h-4" />
                        ) : isPlayingThis ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-200">
                            {msg.isListened ? '✓ Listened' : '◉ One-time audio'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            0:0{msg.duration ?? 7}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-700/60 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="h-full bg-purple-400 transition-all duration-100"
                            style={{
                              width: msg.isListened ? '100%' : isPlayingThis ? `${audioProgress}%` : '0%',
                            }}
                          />
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-1">
                          {msg.isListened ? 'Disappears after single listen' : 'Tap to listen once'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[10px] text-zinc-500 mt-1 font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Picker Bar Popovers */}
          {showEmojiPicker && (
            <div className="p-2 bg-zinc-950 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSendMessage(emoji, 'text')}
                  className="text-lg p-1.5 hover:bg-zinc-800 rounded-xl transition-colors shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {showStickerPicker && (
            <div className="p-2.5 bg-zinc-950 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.label}
                  type="button"
                  onClick={() => handleSendMessage(sticker.label, 'sticker')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 active:scale-95 ${sticker.bg}`}
                >
                  {sticker.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-zinc-950/60 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowStickerPicker(false);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                showEmojiPicker
                  ? 'bg-zinc-800 border-white/20 text-yellow-400'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Quick emojis"
              aria-label="Toggle emoji picker"
            >
              <Smile className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowStickerPicker(!showStickerPicker);
                setShowEmojiPicker(false);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                showStickerPicker
                  ? 'bg-zinc-800 border-white/20 text-purple-400'
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Custom stickers"
              aria-label="Toggle sticker picker"
            >
              <StickerIcon className="w-4 h-4" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeMatch.name}...`}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className={`p-2 rounded-xl transition-all ${
                inputText.trim()
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
