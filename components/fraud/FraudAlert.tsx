'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface FraudAlertProps {
  fraudEvent: {
    id: string;
    riskLevel: string;
    riskScore: number;
    explanation: string;
    recommendedAction?: string | null;
    status: string;
    signals?: Array<{ id: string; signal: string; severity: string }>;
  };
  onReview?: () => void;
  onEscalate?: () => void;
  onDismiss?: () => void;
}

export function FraudAlert({
  fraudEvent,
  onReview,
  onEscalate,
  onDismiss,
}: FraudAlertProps) {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="card-3d rounded-2xl border border-amber-300 bg-amber-50/70 p-5 shadow-md space-y-3.5">
      {/* Alert Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-300 shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#112D4E]">
              Potentially suspicious activity detected
            </h4>
            <p className="text-xs text-[#112D4E]/70 font-medium">
              Risk screening assistance system flagged anomalous transaction activity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={getBadgeVariant(fraudEvent.riskLevel)} size="md">
            {fraudEvent.riskLevel} RISK ({fraudEvent.riskScore}/100)
          </Badge>
          <Badge variant="default" size="sm">
            {fraudEvent.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-[#112D4E] leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200 shadow-xs font-medium">
        {fraudEvent.explanation}
      </p>

      {/* Signals Checklist */}
      {fraudEvent.signals && fraudEvent.signals.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#112D4E]/70">
            Flagged Telemetry Signals:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {fraudEvent.signals.map((sig, idx) => (
              <div
                key={sig.id || idx}
                className="flex items-center gap-1.5 text-xs text-[#112D4E] bg-white/70 px-2.5 py-1.5 rounded-lg border border-amber-200/80 shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate font-medium">{sig.signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action & Review CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-200">
        <div className="text-xs text-[#112D4E] font-medium">
          <span className="font-bold">Recommended: </span>
          <span>{fraudEvent.recommendedAction || 'Human review required prior to balance adjustment'}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onReview && (
            <Button size="sm" variant="primary" onClick={onReview}>
              Review Activity
            </Button>
          )}
          {onEscalate && (
            <Button size="sm" variant="outline" onClick={onEscalate}>
              Escalate
            </Button>
          )}
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
