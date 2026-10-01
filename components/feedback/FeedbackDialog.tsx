'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Star, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketNumber: string;
  onSuccess?: () => void;
}

export function FeedbackDialog({
  isOpen,
  onClose,
  ticketId,
  ticketNumber,
  onSuccess,
}: FeedbackDialogProps) {
  const [isResolved, setIsResolved] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          rating,
          isResolved,
          comment,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 1500);
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Support Experience: #${ticketNumber}`}>
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Thank you for your feedback!
          </h3>
          <p className="text-xs text-slate-500">
            Your rating helps us continuously improve AI LifeDesk support services.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question 1: Was your issue resolved? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Was your issue resolved?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsResolved(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                  isResolved
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Yes, Resolved</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResolved(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                  !isResolved
                    ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ThumbsDown className="w-4 h-4 text-rose-600" />
                <span>No, Still Open</span>
              </button>
            </div>
          </div>

          {/* Question 2: How was your support experience? (1-5 stars) */}
          <div className="space-y-2 text-center">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 text-left">
              How was your support experience?
            </label>
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {rating === 5
                ? 'Exceptional (5/5)'
                : rating === 4
                ? 'Good (4/5)'
                : rating === 3
                ? 'Average (3/5)'
                : rating === 2
                ? 'Below Expectations (2/5)'
                : 'Poor (1/5)'}
            </span>
          </div>

          {/* Question 3: Optional comments */}
          <Textarea
            label="Additional Comments (Optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or what we can do better..."
            rows={3}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Submit Feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
