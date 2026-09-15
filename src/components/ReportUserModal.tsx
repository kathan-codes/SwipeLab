'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { Profile } from '../types/profile';

interface ReportUserModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (profileId: string, reason: string) => void;
}

const REPORT_REASONS = [
  'Spam or commercial advertising',
  'Fake profile or impersonation',
  'Harassment or inappropriate conduct',
  'Inappropriate content or imagery',
  'Other safety concerns',
];

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    onSubmitReport(profile.id, selectedReason);
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen || !profile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-white/10 p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Report {profile.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Why are you reporting this fictional profile?
                  </p>
                </div>
              </div>

              {/* Radio options */}
              <div className="space-y-2 pt-1">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors text-xs ${
                      selectedReason === reason
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        : 'bg-zinc-950/40 border-white/5 hover:bg-zinc-800/40 text-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/50 border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                This is a local prototype report. Submitting will immediately hide {profile.name} from your discovery deck and active matches.
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-lg active:scale-95"
                >
                  Submit Report
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Report submitted
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Thanks for helping keep SwipeLab safe. This profile has been removed from your discovery deck.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-all shadow-md active:scale-95"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
