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
  User,
  Bot,
  Send,
  Loader2,
  CheckCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-[#3F72AF]/15 text-[#3F72AF] border border-[#3F72AF]/30',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border border-amber-300',
  ESCALATED: 'bg-rose-100 text-rose-800 border border-rose-300',
  CLOSED: 'bg-[#DBE2EF] text-[#112D4E] border border-[#112D4E]/20',
  ASSIGNED: 'bg-[#112D4E]/10 text-[#112D4E] border border-[#112D4E]/20',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-800 border border-orange-300',
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: 'text-[#112D4E]/60',
  MEDIUM: 'text-[#3F72AF] font-bold',
  HIGH: 'text-amber-600 font-extrabold',
  URGENT: 'text-rose-600 font-black',
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
      if (!res.ok) {
        router.push('/tickets');
        return;
      }
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
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F7]">
        <div className="w-8 h-8 border-3 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) return null;

  const isAgent = user.role === 'AGENT' || user.role === 'ADMIN';
  const canResolve = isAgent && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED';
  const canFeedback = !isAgent && ticket.status === 'RESOLVED';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F7] text-[#112D4E]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-7xl mx-auto w-full">
          {/* Back Button */}
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3F72AF] hover:text-[#112D4E] mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Ticket Header Card */}
              <div className="card-3d rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#3F72AF]">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          STATUS_BADGE[ticket.status] || ''
                        }`}
                      >
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs ${PRIORITY_COLOR[ticket.priority] || ''}`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <h1 className="text-xl font-black text-[#112D4E] tracking-tight">
                      {ticket.subject}
                    </h1>
                    <p className="text-xs font-medium text-[#112D4E]/60 mt-1">
                      Created {new Date(ticket.createdAt).toLocaleString()} •{' '}
                      {ticket.category?.name && (
                        <span className="text-[#3F72AF] font-bold">{ticket.category.name}</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAgent && (
                      <button
                        onClick={() => setShowCopilot(!showCopilot)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DBE2EF] text-[#112D4E] text-xs font-bold hover:bg-[#3F72AF] hover:text-white transition-all shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#3F72AF]" />
                        AI Copilot
                      </button>
                    )}
                    {canResolve && (
                      <button
                        onClick={() => updateStatus('RESOLVED')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm active:translate-y-0.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                    {canFeedback && (
                      <button
                        onClick={() => setShowFeedback(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-200 transition-colors shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-600" />
                        Rate &amp; Feedback
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-[#112D4E] font-medium leading-relaxed whitespace-pre-wrap bg-white/80 rounded-xl p-4 border border-[#DBE2EF] shadow-xs">
                  {ticket.description}
                </p>

                {ticket.aiSummary && (
                  <div className="mt-4 p-3.5 rounded-xl bg-[#DBE2EF]/30 border border-[#DBE2EF] flex gap-2.5">
                    <Bot className="w-4 h-4 text-[#3F72AF] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-[#112D4E] mb-0.5">AI Summary</p>
                      <p className="text-xs font-medium text-[#112D4E]/80 leading-relaxed">
                        {ticket.aiSummary}
                      </p>
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

              {/* Messages Container */}
              <div className="card-3d rounded-2xl p-6 shadow-md">
                <h2 className="text-sm font-black text-[#112D4E] mb-4">Conversation History</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {ticket.messages
                    .filter((m) => !m.isInternal || isAgent)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.senderType === 'CUSTOMER' && msg.sender.role === user.role
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex gap-2.5 max-w-[80%] ${
                            msg.senderType === 'CUSTOMER' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white shadow-xs ${
                              msg.senderType === 'AI'
                                ? 'bg-gradient-to-br from-[#3F72AF] to-[#112D4E]'
                                : msg.senderType === 'CUSTOMER'
                                ? 'bg-[#112D4E]'
                                : 'bg-[#3F72AF]'
                            }`}
                          >
                            {msg.senderType === 'AI' ? (
                              <Bot className="w-3.5 h-3.5" />
                            ) : (
                              <User className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-[#112D4E]">
                                {msg.sender.name}
                              </span>
                              {msg.isInternal && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                                  INTERNAL
                                </span>
                              )}
                              <span className="text-[10px] font-medium text-[#112D4E]/50">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <div
                              className={`rounded-xl px-3.5 py-2.5 text-xs font-medium leading-relaxed whitespace-pre-wrap shadow-xs ${
                                msg.senderType === 'CUSTOMER'
                                  ? 'btn-3d text-white'
                                  : msg.isInternal
                                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                                  : 'bg-white border border-[#DBE2EF] text-[#112D4E]'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Reply Form */}
                {ticket.status !== 'CLOSED' && (
                  <div className="mt-5 pt-4 border-t border-[#DBE2EF]">
                    {isAgent && (
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => setIsInternal(false)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            !isInternal
                              ? 'btn-3d text-white shadow-xs'
                              : 'bg-white border border-[#DBE2EF] text-[#112D4E]'
                          }`}
                        >
                          Public Reply
                        </button>
                        <button
                          onClick={() => setIsInternal(true)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isInternal
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-white border border-[#DBE2EF] text-[#112D4E]'
                          }`}
                        >
                          Internal Note
                        </button>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder={
                          isInternal
                            ? 'Write an internal note (only visible to team)...'
                            : 'Write your reply...'
                        }
                        rows={3}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#DBE2EF] bg-white text-xs text-[#112D4E] placeholder:text-[#3F72AF]/40 focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 focus:border-[#3F72AF] resize-none"
                      />
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim() || sending}
                        className="btn-3d px-4 py-2 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-md active:translate-y-0.5"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-5">
              {/* Customer Info */}
              <div className="card-3d rounded-2xl p-5 shadow-md">
                <h3 className="text-xs font-black text-[#112D4E]/60 uppercase tracking-wider mb-3">
                  Customer
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#112D4E]">{ticket.customer.name}</p>
                    <p className="text-xs text-[#112D4E]/60">{ticket.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Details Info */}
              <div className="card-3d rounded-2xl p-5 shadow-md">
                <h3 className="text-xs font-black text-[#112D4E]/60 uppercase tracking-wider mb-3">
                  Details
                </h3>
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
                      <dt className="text-[#112D4E]/60 font-medium">{label}</dt>
                      <dd className="font-bold text-[#112D4E] text-right max-w-[55%] truncate">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Status Quick Change */}
                {isAgent && (
                  <div className="mt-4 pt-4 border-t border-[#DBE2EF]">
                    <p className="text-xs font-bold text-[#112D4E]/70 mb-2">Change Status</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'ESCALATED', 'RESOLVED'].map(
                        (s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(s)}
                            disabled={ticket.status === s}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              ticket.status === s
                                ? 'bg-[#DBE2EF] text-[#112D4E]/40 cursor-default'
                                : 'bg-white border border-[#DBE2EF] text-[#112D4E] hover:bg-[#3F72AF] hover:text-white shadow-xs'
                            }`}
                          >
                            {s.replace(/_/g, ' ')}
                          </button>
                        )
                      )}
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
          onSuccess={() => {
            setShowFeedback(false);
            fetchTicket();
          }}
        />
      )}
    </div>
  );
}
