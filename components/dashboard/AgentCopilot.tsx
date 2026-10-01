'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Edit3,
  CheckCircle,
  FileText,
  Lightbulb,
  Globe,
  RefreshCw,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AgentCopilotProps {
  ticketId: string;
  ticketSubject: string;
  ticketDescription: string;
  onApplyReply: (text: string) => void;
  onRefreshTicket?: () => void;
}

export function AgentCopilot({
  ticketId,
  ticketSubject,
  ticketDescription,
  onApplyReply,
  onRefreshTicket,
}: AgentCopilotProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [draftReply, setDraftReply] = useState('');
  const [copilotMeta, setCopilotMeta] = useState<any>(null);
  const [summaryText, setSummaryText] = useState('');
  const [explanation, setExplanation] = useState('');

  // 1. Generate Reply
  const handleGenerateReply = async (goal = 'Helpful resolution with next steps') => {
    setLoadingAction('reply');
    try {
      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, goal }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDraftReply(data.copilot.suggested_reply);
        setCopilotMeta(data.copilot);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Summarize Conversation
  const handleSummarize = async () => {
    setLoadingAction('summarize');
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSummaryText(data.summary);
        if (onRefreshTicket) onRefreshTicket();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Explain Ticket / Analyze
  const handleExplain = async () => {
    setLoadingAction('explain');
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${ticketSubject}\n${ticketDescription}` }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setExplanation(
          `Root Cause: ${data.analysis.intent}. Recommended Action: ${data.analysis.suggested_action}. Priority Confidence: ${Math.round(
            data.analysis.confidence * 100
          )}%.`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              AI Agent Copilot
            </h3>
            <p className="text-[11px] text-slate-400">
              Drafts require human agent review before sending
            </p>
          </div>
        </div>
        <Badge variant="purple" size="sm">
          Assist Mode
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => handleGenerateReply('Helpful resolution with next steps')}
          disabled={!!loadingAction}
          className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Generate Reply</span>
        </button>

        <button
          onClick={handleSummarize}
          disabled={!!loadingAction}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>Summarize</span>
        </button>

        <button
          onClick={handleExplain}
          disabled={!!loadingAction}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Explain Ticket</span>
        </button>

        <button
          onClick={() => handleGenerateReply('Follow up check-in on customer satisfaction')}
          disabled={!!loadingAction}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-4 h-4 text-emerald-600" />
          <span>Draft Follow-up</span>
        </button>
      </div>

      {/* Summary Box if generated */}
      {summaryText && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Executive Summary</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{summaryText}</p>
        </div>
      )}

      {/* Explanation Box if generated */}
      {explanation && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
          <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Operational Diagnosis</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 mt-1">{explanation}</p>
        </div>
      )}

      {/* Generated Draft Reply Box with Editor */}
      {draftReply ? (
        <div className="space-y-3 p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Suggested Response (Editable by Agent)</span>
            </div>
            {copilotMeta?.tone && (
              <Badge variant="neutral" size="sm">
                Tone: {copilotMeta.tone}
              </Badge>
            )}
          </div>

          <textarea
            value={draftReply}
            onChange={(e) => setDraftReply(e.target.value)}
            rows={4}
            className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {copilotMeta?.key_points_addressed && (
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
              <span className="font-semibold">Key Points:</span>
              {copilotMeta.key_points_addressed.map((kp: string, idx: number) => (
                <span key={idx} className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  ✓ {kp}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
              Click apply to copy this drafted reply into the reply message composer below.
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onApplyReply(draftReply);
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Apply to Message Box
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Click "Generate Reply" or any copilot button above to draft AI responses grounded in ticket context.
        </div>
      )}
    </div>
  );
}
