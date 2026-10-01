'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  Send,
  FileText,
  Lightbulb,
  Headphones,
  Ticket,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface TicketSummary {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
}

export default function AgentCopilotPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [replyGoal, setReplyGoal] = useState('Helpful resolution with next steps');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [copilotMeta, setCopilotMeta] = useState<any>(null);
  const [summaryText, setSummaryText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CUSTOMER') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role !== 'CUSTOMER') {
      fetch('/api/tickets')
        .then((r) => r.json())
        .then((d) => {
          const list = d.tickets || [];
          setTickets(list);
          if (list.length > 0) {
            setSelectedTicketId(list[0].id);
            setTicketSubject(list[0].subject);
            setTicketDescription(list[0].description);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleTicketSelect = (id: string) => {
    setSelectedTicketId(id);
    const found = tickets.find((t) => t.id === id);
    if (found) {
      setTicketSubject(found.subject);
      setTicketDescription(found.description);
      setGeneratedDraft('');
      setSummaryText('');
      setExplanation('');
    }
  };

  const handleGenerateReply = async () => {
    setLoadingAction('reply');
    try {
      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selectedTicketId, goal: replyGoal }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedDraft(data.copilot.suggested_reply);
        setCopilotMeta(data.copilot);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSummarize = async () => {
    setLoadingAction('summarize');
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selectedTicketId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSummaryText(data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

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
          `Intent: ${data.analysis.intent}. Suggested Protocol: ${data.analysis.suggested_action}. Confidence: ${Math.round(
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

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0f0d]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-[#0a0f0d]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Headphones className="w-6 h-6 text-emerald-600" />
              AI Agent Copilot Workbench
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Autonomous response drafting, conversation summarization, and root-cause analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Ticket Selector & Context */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-[#111815] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  Select Active Ticket Context
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Choose from Queue:
                  </label>
                  <select
                    value={selectedTicketId}
                    onChange={(e) => handleTicketSelect(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0a0f0d] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {tickets.map((t) => (
                      <option key={t.id} value={t.id}>
                        #{t.ticketNumber} - {t.subject} ({t.priority})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Subject & Issue Details
                  </span>
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0a0f0d] border border-stone-200 dark:border-stone-800 text-xs">
                    <p className="font-bold text-stone-900 dark:text-stone-100">{ticketSubject}</p>
                    <p className="text-stone-600 dark:text-stone-400 mt-1 whitespace-pre-wrap">
                      {ticketDescription}
                    </p>
                  </div>
                </div>

                {/* Tone / Reply Goal */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Drafting Strategy & Goal:
                  </label>
                  <select
                    value={replyGoal}
                    onChange={(e) => setReplyGoal(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0a0f0d] text-stone-900 dark:text-stone-100"
                  >
                    <option value="Helpful resolution with next steps">Helpful resolution with next steps (Default)</option>
                    <option value="Empathetic apology and expedited credit">Empathetic apology and expedited credit</option>
                    <option value="Policy explanation and document request">Policy explanation and document request</option>
                    <option value="Confirmation of completed refund">Confirmation of completed refund</option>
                  </select>
                </div>

                {/* Copilot Action Triggers */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleGenerateReply}
                    loading={loadingAction === 'reply'}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Draft Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSummarize}
                    loading={loadingAction === 'summarize'}
                    className="text-xs"
                    icon={<FileText className="w-3.5 h-3.5" />}
                  >
                    Summarize
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExplain}
                    loading={loadingAction === 'explain'}
                    className="text-xs"
                    icon={<Lightbulb className="w-3.5 h-3.5" />}
                  >
                    Explain
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: AI Outputs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Executive Summary if available */}
              {summaryText && (
                <div className="p-4 rounded-3xl bg-stone-50 dark:bg-[#111815] border border-stone-200 dark:border-stone-800 text-xs">
                  <h4 className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-1">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    AI Executive Summary
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{summaryText}</p>
                </div>
              )}

              {/* Operational Analysis if available */}
              {explanation && (
                <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs">
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    AI Diagnosis & Recommended Action
                  </h4>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed">{explanation}</p>
                </div>
              )}

              {/* Draft Reply Area */}
              <div className="bg-white dark:bg-[#111815] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                        Generated Agent Response
                      </h3>
                      <p className="text-[11px] text-stone-400">Review, modify, or copy directly into email / chat</p>
                    </div>
                  </div>
                  {copilotMeta?.tone && (
                    <Badge variant="purple" size="sm">
                      Tone: {copilotMeta.tone}
                    </Badge>
                  )}
                </div>

                <textarea
                  value={generatedDraft}
                  onChange={(e) => setGeneratedDraft(e.target.value)}
                  placeholder="Click 'Draft Reply' above to generate grounded, contextual responses with Gemini AI Copilot..."
                  rows={8}
                  className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0a0f0d] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />

                {copilotMeta?.key_points_addressed && (
                  <div className="flex flex-wrap gap-1.5 text-xs text-stone-500">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Key Points Grounded:</span>
                    {copilotMeta.key_points_addressed.map((kp: string, idx: number) => (
                      <span key={idx} className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md text-[11px]">
                        ✓ {kp}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400">
                    All Copilot drafts are human-in-the-loop approved.
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleCopy}
                    disabled={!generatedDraft}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copied ? 'Copied to Clipboard!' : 'Copy Draft'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
