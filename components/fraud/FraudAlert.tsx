'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
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
    <div className="rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/20 p-5 shadow-sm space-y-3.5">
      {/* Alert Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Potentially suspicious activity detected
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Risk screening assistance system flagged anomalous transaction activity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={getBadgeVariant(fraudEvent.riskLevel)} size="md">
            {fraudEvent.riskLevel} RISK ({fraudEvent.riskScore}/100)
          </Badge>
          <Badge variant="neutral" size="sm">
            {fraudEvent.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
        {fraudEvent.explanation}
      </p>

      {/* Signals Checklist */}
      {fraudEvent.signals && fraudEvent.signals.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Flagged Telemetry Signals:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {fraudEvent.signals.map((sig, idx) => (
              <div
                key={sig.id || idx}
                className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{sig.signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action & Review CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-200 dark:border-amber-900/60">
        <div className="text-xs text-amber-900 dark:text-amber-300 font-medium">
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
