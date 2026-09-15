'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  ChevronLeft,
  Send,
  Smile,
  Sparkles,
  Play,
  Pause,
  Volume2,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { Profile, ChatMessage, Sticker } from '../types/profile';
import { MOCK_STICKERS, INITIAL_MESSAGES } from '../data/mockMessages';
import { triggerHaptic } from '../utils/haptics';

interface MessengerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Profile[];
  initialSelectedMatch?: Profile | null;
}

export const MessengerDrawer: React.FC<MessengerDrawerProps> = ({
  isOpen,
  onClose,
  matches,
  initialSelectedMatch = null,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(initialSelectedMatch);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showStickerPicker, setShowStickerPicker] = useState<boolean>(false);

  // Simulated audio playback state: messageId -> { isPlaying: boolean, progress: number }
  const [audioPlayback, setAudioPlayback] = useState<Record<string, { isPlaying: boolean; progress: number }>>({});
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync selected match if prop changes
  useEffect(() => {
    if (initialSelectedMatch) {
      setSelectedMatch(initialSelectedMatch);
    }
  }, [initialSelectedMatch]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedMatch]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, []);

  const handleSendMessage = (content: string, type: ChatMessage['type'] = 'text', audioDuration?: string) => {
    if (!selectedMatch || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      matchId: selectedMatch.id,
      sender: 'user',
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      audioDuration,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedMatch.id]: [...(prev[selectedMatch.id] || []), newMessage],
    }));

    setInputText('');
    setShowEmojiPicker(false);
    setShowStickerPicker(false);
    triggerHaptic('tap');
  };

  const handlePlayAudio = (message: ChatMessage) => {
    const isPlaying = audioPlayback[message.id]?.isPlaying;

    if (isPlaying) {
      // Pause
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
      setAudioPlayback((prev) => ({
        ...prev,
        [message.id]: { ...(prev[message.id] || { progress: 0 }), isPlaying: false },
      }));
      return;
    }

    // Play simulation
    triggerHaptic('tap');
    let currentProgress = audioPlayback[message.id]?.progress || 0;
    if (currentProgress >= 100) currentProgress = 0;

    setAudioPlayback((prev) => ({
      ...prev,
      [message.id]: { isPlaying: true, progress: currentProgress },
    }));

    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);

    playbackIntervalRef.current = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 100) {
        if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
        setAudioPlayback((prev) => ({
          ...prev,
          [message.id]: { isPlaying: false, progress: 100 },
        }));

        // If one-time audio, permanently lock it
        if (message.type === 'audio-once') {
          setMessages((prev) => {
            const list = prev[message.matchId] || [];
            return {
              ...prev,
              [message.matchId]: list.map((m) =>
                m.id === message.id ? { ...m, listened: true } : m
              ),
            };
          });
        }
      } else {
        setAudioPlayback((prev) => ({
          ...prev,
          [message.id]: { isPlaying: true, progress: currentProgress },
        }));
      }
    }, 150);
  };

  if (!isOpen) return null;

  const currentMatchMessages = selectedMatch ? messages[selectedMatch.id] || [] : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 27, stiffness: 300 }}
          className="relative w-full max-w-md h-full bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          {/* Main Top Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-20">
            {selectedMatch ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Back to matches list"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={selectedMatch.image}
                    alt={selectedMatch.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {selectedMatch.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-rose-400" />
                    <span>{selectedMatch.location.split('·')[0]}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Matches & Messages
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
                  {matches.length}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close matches panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Matches List vs Active Chat */}
          {!selectedMatch ? (
            <div className="flex-1 overflow-y-auto p-4">
              {matches.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
                    <Heart className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">No matches yet</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                      Start a conversation after you match with profiles in Discovery or the Likes You tab!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 px-1">
                    Your Connections
                  </h4>
                  {matches.map((profile) => {
                    const matchMsgs = messages[profile.id] || [];
                    const lastMsg = matchMsgs[matchMsgs.length - 1];

                    return (
                      <div
                        key={profile.id}
                        onClick={() => setSelectedMatch(profile)}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-white/10 transition-all cursor-pointer select-none group"
                      >
                        <div className="relative w-13 h-13 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                          <Image
                            src={profile.image}
                            alt={profile.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                              {profile.name}
                            </h4>
                            {lastMsg && (
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {lastMsg.timestamp}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">
                            {lastMsg ? lastMsg.content : `You matched with ${profile.name}! Say hi 👋`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Active Conversation View */
            <div className="flex-1 flex flex-col min-h-0 bg-zinc-950">
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-center my-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[11px] text-zinc-400">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>You matched with {selectedMatch.name}</span>
                  </div>
                </div>

                {currentMatchMessages.map((msg) => {
                  const isUser = msg.sender === 'user';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      {/* Audio Message Type */}
                      {msg.type === 'audio' && (
                        <div
                          className={`p-3 rounded-2xl border max-w-[80%] space-y-2 ${
                            isUser
                              ? 'bg-rose-500/20 border-rose-500/30 text-white'
                              : 'bg-zinc-900 border-white/10 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(msg)}
                              className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow transition-transform active:scale-90"
                              aria-label="Play audio"
                            >
                              {audioPlayback[msg.id]?.isPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="text-xs font-semibold flex items-center gap-1.5">
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Voice Memo</span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {msg.audioDuration || '0:08'}
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${audioPlayback[msg.id]?.progress || 0}%` }}
                              className="h-full bg-rose-400 rounded-full transition-all duration-150"
                            />
                          </div>
                        </div>
                      )}

                      {/* One-Time Audio Message Type */}
                      {msg.type === 'audio-once' && (
                        <div
                          className={`p-3.5 rounded-2xl border max-w-[82%] space-y-2 ${
                            msg.listened
                              ? 'bg-zinc-900/60 border-white/5 opacity-70 text-zinc-400'
                              : 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {!msg.listened ? (
                              <button
                                type="button"
                                onClick={() => handlePlayAudio(msg)}
                                disabled={audioPlayback[msg.id]?.isPlaying}
                                className="w-8 h-8 rounded-full bg-purple-400 text-zinc-950 flex items-center justify-center shadow transition-transform active:scale-90"
                              >
                                {audioPlayback[msg.id]?.isPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </button>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                <span>{msg.listened ? '✓ Listened' : '◉ One-time audio'}</span>
                              </div>
                              <span className="text-[10px] opacity-80 font-mono">
                                {msg.listened ? 'Expiring memo' : `${msg.audioDuration || '0:07'} · Tap to listen`}
                              </span>
                            </div>
                          </div>

                          {!msg.listened && (
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${audioPlayback[msg.id]?.progress || 0}%` }}
                                className="h-full bg-purple-400 rounded-full transition-all duration-150"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sticker Type */}
                      {msg.type === 'sticker' && (
                        <div className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-xl font-bold shadow-lg flex items-center gap-2">
                          <span>{msg.content}</span>
                        </div>
                      )}

                      {/* Standard Text & Emoji */}
                      {(msg.type === 'text' || msg.type === 'emoji') && (
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                            isUser
                              ? 'bg-rose-600 text-white rounded-br-xs'
                              : 'bg-zinc-900 text-zinc-100 border border-white/10 rounded-bl-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                      )}

                      <span className="text-[10px] text-zinc-400 font-mono mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="p-2.5 bg-zinc-900 border-t border-white/10 flex items-center justify-around">
                  {['😂', '❤️', '👍', '👋', '😊', '🎉'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSendMessage(emoji, 'emoji')}
                      className="text-2xl hover:scale-125 transition-transform p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Original Sticker Collection Popover */}
              {showStickerPicker && (
                <div className="p-3 bg-zinc-900 border-t border-white/10 grid grid-cols-3 gap-2">
                  {MOCK_STICKERS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSendMessage(`${st.label} ${st.emoji}`, 'sticker')}
                      className="py-2 px-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/5 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>{st.emoji}</span>
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Bottom Input Field */}
              <div className="p-3 border-t border-white/10 bg-zinc-950 flex items-center gap-2">
                {/* Emoji toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowStickerPicker(false);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    showEmojiPicker
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                  aria-label="Toggle emoji picker"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Sticker toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setShowStickerPicker(!showStickerPicker);
                    setShowEmojiPicker(false);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    showStickerPicker
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                  aria-label="Toggle original stickers"
                >
                  <Sparkles className="w-5 h-5" />
                </button>

                {/* Text input: Enter sends, Shift+Enter new line */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputText, 'text');
                    }
                  }}
                  placeholder={`Message ${selectedMatch.name}...`}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500"
                />

                {/* Send button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage(inputText, 'text')}
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl transition-all ${
                    inputText.trim()
                      ? 'bg-rose-500 hover:bg-rose-400 text-white active:scale-95 shadow-md'
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
