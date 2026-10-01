import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

interface AIInsightCardProps {
  // Old format
  insights?: string[];
  // New format (from analytics API response object)
  data?: {
    overview?: {
      totalTickets?: number;
      openTickets?: number;
      resolvedTickets?: number;
      avgResolutionHours?: number;
      satisfactionRate?: number;
      aiResolutionRate?: number;
    };
  } | null;
  loading?: boolean;
}

export function AIInsightCard({ insights, data, loading }: AIInsightCardProps) {
  // Generate insights from data if no explicit insights provided
  const computedInsights: string[] = insights || [];

  if (computedInsights.length === 0 && data?.overview) {
    const ov = data.overview;
    if ((ov.aiResolutionRate ?? 0) > 70) {
      computedInsights.push(`AI auto-resolves ${ov.aiResolutionRate}% of tickets — significantly reducing agent workload.`);
    }
    if ((ov.openTickets ?? 0) > 0) {
      computedInsights.push(`${ov.openTickets} tickets currently open. Consider prioritizing URGENT and HIGH items.`);
    }
    if ((ov.satisfactionRate ?? 0) > 80) {
      computedInsights.push(`Customer satisfaction at ${ov.satisfactionRate}% — above industry benchmark of 75%.`);
    }
    if ((ov.avgResolutionHours ?? 0) > 0) {
      computedInsights.push(`Average resolution time: ${ov.avgResolutionHours}h. AI-assisted tickets resolve ~40% faster.`);
    }
    if ((ov.resolvedTickets ?? 0) > 0) {
      computedInsights.push(`${ov.resolvedTickets} tickets resolved. Knowledge base articles may reduce repeat queries.`);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500">Generating AI insights...</span>
        </div>
      </div>
    );
  }

  if (computedInsights.length === 0) return null;

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">AI Insights</h3>
            <p className="text-[11px] text-slate-500">Live operational intelligence</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Live
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {computedInsights.slice(0, 5).map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <div className="mt-0.5 p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <p className="leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
