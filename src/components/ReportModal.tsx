'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle, X } from 'lucide-react';
import { Profile } from '../types/profile';

interface ReportModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (profileId: string, reason: string) => void;
}

const REPORT_REASONS = [
  'Spam',
  'Fake profile',
  'Harassment',
  'Inappropriate content',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  profile,
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    setSubmitted(true);
    setTimeout(() => {
      onReportSubmitted(profile.id, selectedReason);
      setSubmitted(false);
      setSelectedReason('');
      onClose();
    }, 1200);
  };

  const handleCancel = () => {
    setSelectedReason('');
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        {/* Click outside to cancel */}
        <div className="absolute inset-0" onClick={handleCancel} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 p-6 shadow-2xl z-10 text-zinc-100"
        >
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close report dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="py-6 flex flex-col items-center text-center animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Report submitted</h3>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Thanks for helping keep SwipeLab safe. This profile will no longer appear in your discovery deck.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2.5 mb-3 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Report {profile.name}</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Why are you reporting this profile? Your report is confidential.
              </p>

              <div className="space-y-2 mb-6">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-zinc-950/60 border-white/5 text-zinc-300 hover:bg-zinc-800/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-500 w-4 h-4"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedReason
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
