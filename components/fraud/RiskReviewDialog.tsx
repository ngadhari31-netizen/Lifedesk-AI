'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { CheckCircle2 } from 'lucide-react';

interface RiskReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess?: () => void;
}

export function RiskReviewDialog({
  isOpen,
  onClose,
  eventId,
  onSuccess,
}: RiskReviewDialogProps) {
  const [status, setStatus] = useState('REVIEWED');
  const [recommendedAction, setRecommendedAction] = useState('Verified payment records with gateway. No unauthorized activity found.');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/fraud/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          status,
          recommendedAction,
          notes,
        }),
      });

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert('Failed to submit fraud review.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating review status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Authorized Risk Review Assessment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-[#112D4E]/70 font-medium leading-relaxed">
          Record your supervisor review determination for this screened risk event. An audit log entry will be saved with your user ID and timestamp.
        </p>

        <Select
          label="Review Decision Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'REVIEWED', label: 'Mark Reviewed & Verified (Safe)' },
            { value: 'ESCALATED', label: 'Escalate to Senior Fraud Ops' },
            { value: 'DISMISSED', label: 'Dismiss (False Positive Anomaly)' },
          ]}
        />

        <Textarea
          label="Action Taken / Resolution Protocol"
          value={recommendedAction}
          onChange={(e) => setRecommendedAction(e.target.value)}
          rows={3}
          required
        />

        <Textarea
          label="Internal Supervisor Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Details of bank reference reconciliation or identity confirmation..."
          rows={2}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DBE2EF]">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Submit Audit Decision
          </Button>
        </div>
      </form>
    </Modal>
  );
}
