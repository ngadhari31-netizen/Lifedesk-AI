'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { useRouter } from 'next/navigation';
import { Ticket, CheckCircle, Clock, Sparkles, Plus, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  metrics: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionHours: number;
    csatScore: number;
    aiAssistedResolutions: number;
  };
  charts: {
    ticketsByCategory: Array<{ name: string; count: number }>;
    ticketsByPriority: Array<{ priority: string; count: number }>;
    ticketsByStatus: Array<{ status: string; count: number }>;
    resolutionTrends: Array<{ day: string; created: number; resolved: number }>;
  };
  aiInsights: string[];
  recentTickets?: Array<{
    id: string;
    ticketNumber: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [customerTickets, setCustomerTickets] = useState<DashboardData['recentTickets']>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const isStaff = user.role === 'ADMIN' || user.role === 'AGENT';
      if (isStaff) {
        fetch('/api/analytics/overview')
          .then((r) => r.json())
          .then((d) => setData(d))
          .catch(console.error)
          .finally(() => setFetching(false));
      } else {
        fetch('/api/tickets')
          .then((r) => r.json())
          .then((d) => {
            setCustomerTickets((d.tickets || []).slice(0, 5));
          })
          .catch(console.error)
          .finally(() => setFetching(false));
      }
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F7]">
        <div className="w-8 h-8 border-3 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isStaff = user.role === 'ADMIN' || user.role === 'AGENT';
  const m = data?.metrics;

  const statusBadge: Record<string, string> = {
    OPEN: 'bg-[#3F72AF]/15 text-[#3F72AF] border border-[#3F72AF]/30',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 border border-amber-300',
    ESCALATED: 'bg-rose-100 text-rose-800 border border-rose-300',
    CLOSED: 'bg-[#DBE2EF] text-[#112D4E] border border-[#112D4E]/20',
    ASSIGNED: 'bg-[#112D4E]/10 text-[#112D4E] border border-[#112D4E]/20',
  };

  const priorityColor: Record<string, string> = {
    LOW: 'text-[#112D4E]/60',
    MEDIUM: 'text-[#3F72AF] font-semibold',
    HIGH: 'text-amber-600 font-bold',
    URGENT: 'text-rose-600 font-extrabold',
  };

  const tickets = isStaff ? data?.recentTickets || [] : customerTickets || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F7] text-[#112D4E]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#112D4E] tracking-tight">
                Welcome back, {user.name.split(' ')[0]} 👋
              </h1>
              <p className="text-sm font-medium text-[#112D4E]/70 mt-1">
                Here is your operational support overview.
              </p>
            </div>
            <Link
              href="/chat"
              className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md active:translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-white" />
              Start AI Assistant
            </Link>
          </div>

          {/* Stats Grid - Staff only */}
          {isStaff && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Total Tickets"
                value={fetching ? '—' : String(m?.totalTickets ?? 0)}
                icon={<Ticket className="w-5 h-5" />}
              />
              <StatsCard
                title="Open Issues"
                value={fetching ? '—' : String(m?.openTickets ?? 0)}
                icon={<Clock className="w-5 h-5" />}
              />
              <StatsCard
                title="Resolved"
                value={fetching ? '—' : String(m?.resolvedTickets ?? 0)}
                icon={<CheckCircle className="w-5 h-5" />}
              />
              <StatsCard
                title="AI Assisted"
                value={fetching ? '—' : String(m?.aiAssistedResolutions ?? 0)}
                icon={<Sparkles className="w-5 h-5" />}
              />
            </div>
          )}

          {/* Customer Quick Links */}
          {!isStaff && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  href: '/chat',
                  label: '💬 Start AI Chat',
                  desc: 'Get grounded answers 24/7 in 3 languages',
                  badge: '24/7 Live',
                },
                {
                  href: '/tickets',
                  label: '🎫 My Tickets',
                  desc: 'Track and manage all your requests',
                  badge: 'Direct Track',
                },
                {
                  href: '/knowledge',
                  label: '📚 Knowledge Base',
                  desc: 'Explore enterprise self-service guides',
                  badge: 'Grounded Docs',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card-3d p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-base text-[#112D4E]">{item.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3F72AF]/15 text-[#3F72AF]">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#112D4E]/70">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#DBE2EF] flex items-center text-xs font-bold text-[#3F72AF]">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Charts & AI Insight - Staff only */}
          {isStaff && data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <AnalyticsCharts
                  ticketsByCategory={data.charts.ticketsByCategory}
                  ticketsByPriority={data.charts.ticketsByPriority}
                  ticketsByStatus={data.charts.ticketsByStatus}
                  resolutionTrends={data.charts.resolutionTrends}
                />
              </div>
              <div>
                <AIInsightCard insights={data.aiInsights} />
              </div>
            </div>
          )}

          {/* Recent Tickets Section */}
          <div className="card-3d rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-extrabold text-[#112D4E] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3F72AF]" />
                {isStaff ? 'Recent Operational Tickets' : 'My Recent Tickets'}
              </h2>
              <Link
                href="/tickets"
                className="text-xs font-bold text-[#3F72AF] hover:text-[#112D4E] hover:underline"
              >
                View all tickets →
              </Link>
            </div>

            {fetching ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center">
                <Ticket className="w-10 h-10 text-[#3F72AF]/40 mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#112D4E]/70">No tickets found.</p>
                <Link
                  href="/chat"
                  className="mt-3 inline-flex items-center gap-1 text-[#3F72AF] text-xs font-bold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Start a new support inquiry
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#DBE2EF]/70">
                {tickets.slice(0, 8).map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="flex items-center justify-between py-3.5 hover:bg-[#DBE2EF]/30 rounded-xl px-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-[#3F72AF] font-mono shrink-0">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-sm font-semibold text-[#112D4E] truncate group-hover:text-[#3F72AF] transition-colors">
                        {ticket.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
                      <span className={`text-xs ${priorityColor[ticket.priority] || ''}`}>
                        {ticket.priority}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          statusBadge[ticket.status] || ''
                        }`}
                      >
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
