'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, X, Heart, Sparkles, Star, Volume2 } from 'lucide-react';
import { NotificationItem, NotificationType } from '../types/profile';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'like':
      return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
    case 'match':
      return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    case 'superlike':
      return <Star className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />;
    case 'voice':
      return <Volume2 className="w-3.5 h-3.5 text-purple-400" />;
    default:
      return <Bell className="w-3.5 h-3.5 text-zinc-400" />;
  }
};

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 sm:pr-8 bg-black/40 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl p-4 z-10 flex flex-col max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-zinc-300" />
              <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="px-2 py-1 rounded-lg hover:bg-zinc-900 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-2 space-y-1.5 divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs">
                You&apos;re all caught up.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    onSelectNotification?.(notif);
                  }}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 select-none ${
                    !notif.read
                      ? 'bg-zinc-900/90 border border-white/10'
                      : 'hover:bg-zinc-900/40 text-zinc-400'
                  }`}
                >
                  {/* Icon badge or avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    {notif.profileImage ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={notif.profileImage}
                          alt={notif.profileName || 'Profile'}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                        {getNotificationIcon(notif.type)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-zinc-950">
                      {getNotificationIcon(notif.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-semibold truncate ${!notif.read ? 'text-white' : 'text-zinc-300'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-1">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {notif.description}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-2" />
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
