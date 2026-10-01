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
    <div className="card-3d rounded-2xl p-5 space-y-4 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DBE2EF]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl btn-3d text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#112D4E]">
              AI Agent Copilot
            </h3>
            <p className="text-[11px] font-medium text-[#112D4E]/60">
              Drafts require human agent review before sending
            </p>
          </div>
        </div>
        <Badge variant="blue" size="sm">
          Assist Mode
        </Badge>
      </div>

      {/* Action Buttons with 3D effects */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => handleGenerateReply('Helpful resolution with next steps')}
          disabled={!!loadingAction}
          className="p-3 rounded-xl border border-[#DBE2EF] bg-white hover:bg-[#DBE2EF]/30 text-[#112D4E] text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm hover:shadow active:translate-y-0.5 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#3F72AF]" />
          <span>Generate Reply</span>
        </button>

        <button
          onClick={handleSummarize}
          disabled={!!loadingAction}
          className="p-3 rounded-xl border border-[#DBE2EF] bg-white hover:bg-[#DBE2EF]/30 text-[#112D4E] text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm hover:shadow active:translate-y-0.5 transition-all"
        >
          <FileText className="w-4 h-4 text-[#112D4E]" />
          <span>Summarize</span>
        </button>

        <button
          onClick={handleExplain}
          disabled={!!loadingAction}
          className="p-3 rounded-xl border border-[#DBE2EF] bg-white hover:bg-[#DBE2EF]/30 text-[#112D4E] text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm hover:shadow active:translate-y-0.5 transition-all"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Explain Ticket</span>
        </button>

        <button
          onClick={() => handleGenerateReply('Follow up check-in on customer satisfaction')}
          disabled={!!loadingAction}
          className="p-3 rounded-xl border border-[#DBE2EF] bg-white hover:bg-[#DBE2EF]/30 text-[#112D4E] text-xs font-bold flex flex-col items-center gap-1.5 shadow-sm hover:shadow active:translate-y-0.5 transition-all"
        >
          <Edit3 className="w-4 h-4 text-emerald-600" />
          <span>Draft Follow-up</span>
        </button>
      </div>

      {/* Summary Box */}
      {summaryText && (
        <div className="p-3.5 rounded-xl bg-white/90 border border-[#DBE2EF] text-xs">
          <div className="font-bold text-[#112D4E] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#3F72AF]" />
            <span>AI Executive Summary</span>
          </div>
          <p className="text-[#112D4E]/80 mt-1 leading-relaxed">{summaryText}</p>
        </div>
      )}

      {/* Explanation Box */}
      {explanation && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Operational Diagnosis</span>
          </div>
          <p className="text-amber-800 mt-1 leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Generated Draft Reply Box with Editor */}
      {draftReply ? (
        <div className="space-y-3 p-4 rounded-xl bg-[#DBE2EF]/25 border border-[#DBE2EF]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#112D4E]">
              <Sparkles className="w-3.5 h-3.5 text-[#3F72AF]" />
              <span>AI Suggested Response (Editable by Agent)</span>
            </div>
            {copilotMeta?.tone && (
              <Badge variant="default" size="sm">
                Tone: {copilotMeta.tone}
              </Badge>
            )}
          </div>

          <textarea
            value={draftReply}
            onChange={(e) => setDraftReply(e.target.value)}
            rows={4}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#DBE2EF] bg-white text-[#112D4E] focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/30 focus:border-[#3F72AF]"
          />

          {copilotMeta?.key_points_addressed && (
            <div className="flex flex-wrap gap-1 text-[11px] text-[#112D4E]/70">
              <span className="font-bold">Key Points:</span>
              {copilotMeta.key_points_addressed.map((kp: string, idx: number) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-[#DBE2EF] font-medium">
                  ✓ {kp}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-[#112D4E]/60">
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
        <div className="py-5 text-center text-xs text-[#112D4E]/50 border border-dashed border-[#DBE2EF] rounded-xl bg-white/50">
          Click "Generate Reply" or any copilot button above to draft AI responses grounded in ticket context.
        </div>
      )}
    </div>
  );
}
