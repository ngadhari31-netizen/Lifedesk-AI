'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { useRouter } from 'next/navigation';
import { Ticket, CheckCircle, Clock, Sparkles, Plus, MessageSquare } from 'lucide-react';
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
        // Customer: just load their tickets
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isStaff = user.role === 'ADMIN' || user.role === 'AGENT';
  const m = data?.metrics;

  const statusColor: Record<string, string> = {
    OPEN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    RESOLVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    ESCALATED: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    CLOSED: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    ASSIGNED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  };

  const priorityColor: Record<string, string> = {
    LOW: 'text-slate-500',
    MEDIUM: 'text-amber-600 dark:text-amber-400',
    HIGH: 'text-orange-600 dark:text-orange-400',
    URGENT: 'text-red-600 dark:text-red-400 font-bold',
  };

  const tickets = isStaff ? (data?.recentTickets || []) : (customerTickets || []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Welcome back, {user.name.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">Here&apos;s your support overview.</p>
            </div>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Start AI Support
            </Link>
          </div>

          {/* Stats Grid - Staff only */}
          {isStaff && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Tickets" value={fetching ? '—' : String(m?.totalTickets ?? 0)} icon={<Ticket className="w-5 h-5" />} color="indigo" />
              <StatsCard title="Open Issues" value={fetching ? '—' : String(m?.openTickets ?? 0)} icon={<Clock className="w-5 h-5" />} color="amber" />
              <StatsCard title="Resolved" value={fetching ? '—' : String(m?.resolvedTickets ?? 0)} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
              <StatsCard title="AI Assisted" value={fetching ? '—' : String(m?.aiAssistedResolutions ?? 0)} icon={<Sparkles className="w-5 h-5" />} color="purple" />
            </div>
          )}

          {/* Customer Quick Links */}
          {!isStaff && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { href: '/chat', label: '💬 Start AI Chat', desc: 'Get instant answers 24/7', color: 'from-indigo-500 to-purple-600' },
                { href: '/tickets', label: '🎫 My Tickets', desc: 'Track all your requests', color: 'from-emerald-500 to-teal-600' },
                { href: '/knowledge', label: '📚 Knowledge Base', desc: 'Find self-service answers', color: 'from-sky-500 to-blue-600' },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg hover:scale-[1.02] transition-transform`}>
                  <p className="font-extrabold text-base">{item.label}</p>
                  <p className="text-xs opacity-80 mt-1">{item.desc}</p>
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

          {/* Recent Tickets */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                {isStaff ? 'Recent Tickets' : 'My Recent Tickets'}
              </h2>
              <Link href="/tickets" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View all →
              </Link>
            </div>

            {fetching ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center">
                <Ticket className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No tickets yet.</p>
                <Link href="/chat" className="mt-3 inline-flex items-center gap-1 text-indigo-600 text-xs font-semibold hover:underline">
                  <Plus className="w-3 h-3" /> Start a new support chat
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.slice(0, 8).map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-slate-400 font-mono shrink-0">{ticket.ticketNumber}</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {ticket.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`text-xs font-semibold ${priorityColor[ticket.priority] || ''}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[ticket.status] || ''}`}>
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
