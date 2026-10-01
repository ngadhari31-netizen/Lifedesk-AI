'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TicketTimeline } from '@/components/tickets/TicketTimeline';
import { AgentCopilot } from '@/components/dashboard/AgentCopilot';
import { FeedbackDialog } from '@/components/feedback/FeedbackDialog';
import {
  ArrowLeft,
  Ticket,
  Clock,
  AlertTriangle,
  User,
  Bot,
  Send,
  Loader2,
  CheckCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  RESOLVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  ESCALATED: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  CLOSED: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  ASSIGNED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: 'text-slate-500',
  MEDIUM: 'text-amber-600 dark:text-amber-400',
  HIGH: 'text-orange-600 dark:text-orange-400',
  URGENT: 'text-red-600 dark:text-red-400',
};

interface TicketData {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  sentiment: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  customer: { id: string; name: string; email: string };
  assignedAgent?: { id: string; name: string; email: string };
  category?: { name: string };
  messages: Array<{
    id: string;
    content: string;
    senderType: string;
    isInternal: boolean;
    createdAt: string;
    sender: { name: string; role: string };
  }>;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${params.id}`);
      if (!res.ok) { router.push('/tickets'); return; }
      const data = await res.json();
      setTicket(data.ticket);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && params.id) fetchTicket();
  }, [user, params.id]);

  const sendReply = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply, isInternal }),
      });
      if (res.ok) {
        setReply('');
        await fetchTicket();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await fetch(`/api/tickets/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchTicket();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) return null;

  const isAgent = user.role === 'AGENT' || user.role === 'ADMIN';
  const canResolve = isAgent && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED';
  const canFeedback = !isAgent && ticket.status === 'RESOLVED';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Back */}
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Tickets
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Ticket Header Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{ticket.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLOR[ticket.status] || ''}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs font-bold ${PRIORITY_COLOR[ticket.priority] || ''}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{ticket.subject}</h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Created {new Date(ticket.createdAt).toLocaleString()} •{' '}
                      {ticket.category?.name && <span className="text-indigo-500">{ticket.category.name}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAgent && (
                      <button
                        onClick={() => setShowCopilot(!showCopilot)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-800"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Copilot
                      </button>
                    )}
                    {canResolve && (
                      <button
                        onClick={() => updateStatus('RESOLVED')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                    {canFeedback && (
                      <button
                        onClick={() => setShowFeedback(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-800"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Rate & Give Feedback
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  {ticket.description}
                </p>

                {ticket.aiSummary && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex gap-2.5">
                    <Bot className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-0.5">AI Summary</p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">{ticket.aiSummary}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Copilot Panel */}
              {showCopilot && isAgent && (
                <AgentCopilot
                  ticketId={ticket.id}
                  ticketSubject={ticket.subject}
                  ticketDescription={ticket.description}
                  onApplyReply={(draft: string) => setReply(draft)}
                  onRefreshTicket={fetchTicket}
                />
              )}

              {/* Messages */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Conversation</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {ticket.messages.filter((m) => !m.isInternal || isAgent).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.senderType === 'CUSTOMER' && msg.sender.role === user.role ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${msg.senderType === 'CUSTOMER' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          msg.senderType === 'AI' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' :
                          msg.senderType === 'CUSTOMER' ? 'bg-slate-200 dark:bg-slate-700' :
                          'bg-emerald-500'
                        }`}>
                          {msg.senderType === 'AI' ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-semibold text-slate-500">{msg.sender.name}</span>
                            {msg.isInternal && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">INTERNAL</span>}
                            <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <div className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                            msg.senderType === 'CUSTOMER'
                              ? 'bg-indigo-600 text-white'
                              : msg.isInternal
                              ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {ticket.status !== 'CLOSED' && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {isAgent && (
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => setIsInternal(false)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${!isInternal ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                          Public Reply
                        </button>
                        <button
                          onClick={() => setIsInternal(true)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${isInternal ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                          Internal Note
                        </button>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder={isInternal ? 'Write an internal note (only visible to agents)...' : 'Write your reply...'}
                        rows={3}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim() || sending}
                        className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-5">
              {/* Customer Info */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Customer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ticket.customer.name}</p>
                    <p className="text-xs text-slate-500">{ticket.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Details</h3>
                <dl className="space-y-2.5">
                  {[
                    { label: 'Status', value: ticket.status.replace(/_/g, ' ') },
                    { label: 'Priority', value: ticket.priority },
                    { label: 'Sentiment', value: ticket.sentiment },
                    { label: 'Category', value: ticket.category?.name || 'Uncategorized' },
                    { label: 'Assigned To', value: ticket.assignedAgent?.name || 'Unassigned' },
                    { label: 'Created', value: new Date(ticket.createdAt).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[55%]">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Status Quick Change (Agent/Admin only) */}
                {isAgent && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Change Status</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'ESCALATED', 'RESOLVED'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(s)}
                          disabled={ticket.status === s}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                            ticket.status === s
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                              : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300'
                          }`}
                        >
                          {s.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <TicketTimeline
                status={ticket.status}
                createdAt={ticket.createdAt}
                updatedAt={ticket.updatedAt}
                resolvedAt={ticket.resolvedAt}
                agentName={ticket.assignedAgent?.name}
                categoryName={ticket.category?.name}
              />
            </div>
          </div>
        </main>
      </div>

      {showFeedback && (
        <FeedbackDialog
          isOpen={showFeedback}
          ticketId={ticket.id}
          ticketNumber={ticket.ticketNumber}
          onClose={() => setShowFeedback(false)}
          onSuccess={() => { setShowFeedback(false); fetchTicket(); }}
        />
      )}
    </div>
  );
}
