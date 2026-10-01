import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

interface AIInsightCardProps {
  insights?: string[];
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
      computedInsights.push(`Customer satisfaction at ${ov.satisfactionRate}% — above benchmark standards.`);
    }
    if ((ov.avgResolutionHours ?? 0) > 0) {
      computedInsights.push(`Average resolution time: ${ov.avgResolutionHours}h. AI-assisted tickets resolve ~40% faster.`);
    }
    if ((ov.resolvedTickets ?? 0) > 0) {
      computedInsights.push(`${ov.resolvedTickets} tickets resolved. Knowledge base articles reduce repeat queries.`);
    }
  }

  if (loading) {
    return (
      <div className="card-3d rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 border-2 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#112D4E]/70">Generating operational intelligence...</span>
        </div>
      </div>
    );
  }

  if (computedInsights.length === 0) return null;

  return (
    <div className="card-3d rounded-2xl p-5 shadow-md space-y-3.5 border border-[#DBE2EF]">
      <div className="flex items-center justify-between border-b border-[#DBE2EF] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl btn-3d-navy text-[#F9F7F7] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#DBE2EF]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#112D4E]">Operational Intelligence</h3>
            <p className="text-[11px] font-medium text-[#3F72AF]">Real-time telemetry analysis</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3F72AF]/15 text-[#3F72AF] border border-[#3F72AF]/30">
          Live
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {computedInsights.slice(0, 5).map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-white/90 border border-[#DBE2EF] text-xs text-[#112D4E] shadow-xs"
          >
            <div className="mt-0.5 p-1 rounded-lg bg-[#DBE2EF] text-[#3F72AF] shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <p className="leading-relaxed font-medium">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
