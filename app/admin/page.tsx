'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { useRouter } from 'next/navigation';
import {
  Ticket, ShieldAlert, CheckCircle, Clock, TrendingUp, Settings, BookOpen, Users,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  metrics: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionHours: number;
    csatScore: number;
    totalFraudEvents: number;
    pendingFraudReviews: number;
  };
  charts: {
    ticketsByCategory: Array<{ name: string; count: number }>;
    ticketsByPriority: Array<{ priority: string; count: number }>;
    ticketsByStatus: Array<{ status: string; count: number }>;
    resolutionTrends: Array<{ day: string; created: number; resolved: number }>;
  };
  aiInsights: string[];
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [recentTickets, setRecentTickets] = useState<Array<{ id: string; ticketNumber: string; subject: string; status: string; customer?: { name: string } }>>([]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      Promise.all([
        fetch('/api/analytics/overview').then((r) => r.json()),
        fetch('/api/tickets').then((r) => r.json()),
      ])
        .then(([analyticsData, ticketsData]) => {
          setData(analyticsData);
          setRecentTickets((ticketsData.tickets || []).slice(0, 8));
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const m = data?.metrics;

  const adminLinks = [
    { href: '/tickets', icon: <Ticket className="w-5 h-5" />, label: 'All Tickets', desc: 'Manage and assign tickets', color: 'indigo' },
    { href: '/fraud', icon: <ShieldAlert className="w-5 h-5" />, label: 'Fraud Detection', desc: 'Review risk alerts', color: 'red' },
    { href: '/agent', icon: <Users className="w-5 h-5" />, label: 'Agent Dashboard', desc: 'View agent workspace', color: 'emerald' },
    { href: '/knowledge', icon: <BookOpen className="w-5 h-5" />, label: 'Knowledge Base', desc: 'Manage articles', color: 'sky' },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    red: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    sky: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-500" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Platform-wide overview and management controls</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Tickets" value={fetching ? '—' : String(m?.totalTickets ?? 0)} icon={<Ticket className="w-5 h-5" />} color="indigo" />
            <StatsCard title="Open Issues" value={fetching ? '—' : String(m?.openTickets ?? 0)} icon={<Clock className="w-5 h-5" />} color="amber" />
            <StatsCard title="Resolved" value={fetching ? '—' : String(m?.resolvedTickets ?? 0)} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
            <StatsCard title="Fraud Events" value={fetching ? '—' : String(m?.totalFraudEvents ?? 0)} icon={<ShieldAlert className="w-5 h-5" />} color="rose" />
          </div>

          {/* Quick Access Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`p-4 rounded-2xl border flex flex-col gap-3 hover:shadow-md transition-all ${colorMap[link.color]}`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center">
                  {link.icon}
                </div>
                <div>
                  <p className="text-sm font-bold">{link.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Charts & Insights */}
          {data && (
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
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Tickets (All Users)</h2>
              <Link href="/tickets" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View all →
              </Link>
            </div>
            {fetching ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tickets/${t.id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-slate-400 font-mono shrink-0">{t.ticketNumber}</span>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {t.subject}
                        </span>
                        {t.customer && <span className="text-xs text-slate-400">{t.customer.name}</span>}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 ml-3">
                      {t.status.replace(/_/g, ' ')}
                    </span>
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
