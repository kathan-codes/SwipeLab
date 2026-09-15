'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, CheckCheck, X, Heart, Sparkles, Star, Mic } from 'lucide-react';
import { MockNotification, NotificationType } from '../types/profile';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: MockNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: MockNotification) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />;
      case 'match':
        return <Sparkles className="w-3 h-3 text-emerald-400" />;
      case 'special_like':
        return <Star className="w-3 h-3 text-amber-400 fill-amber-400" />;
      case 'voice_message':
        return <Mic className="w-3 h-3 text-sky-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 bg-black/60 backdrop-blur-sm sm:bg-transparent">
        {/* Click outside backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative w-full sm:w-96 rounded-b-3xl sm:rounded-3xl bg-zinc-900 border border-white/10 p-4 sm:p-5 shadow-2xl z-10 sm:mt-14 sm:mr-6 text-zinc-100 max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto py-2 space-y-2 flex-1 pr-0.5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                You&apos;re all caught up. No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    if (onSelectNotification) onSelectNotification(notif);
                  }}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-zinc-950/40 border-white/5 opacity-75 hover:opacity-100 hover:bg-zinc-800/50'
                      : 'bg-zinc-800/80 border-white/10 hover:bg-zinc-800 shadow-md'
                  }`}
                >
                  {/* Avatar with type badge */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                    <Image
                      src={notif.profileAvatar}
                      alt={notif.profileName}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center border border-white/10">
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-200 leading-snug">
                      <span className="font-semibold text-white">{notif.profileName}</span>{' '}
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                      {notif.time}
                    </span>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
