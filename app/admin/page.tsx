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
  Ticket, ShieldAlert, CheckCircle, Clock, Settings, BookOpen, Users,
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const m = data?.metrics;

  const adminLinks = [
    { href: '/tickets', icon: <Ticket className="w-5 h-5" />, label: 'All Tickets', desc: 'Manage and assign tickets' },
    { href: '/fraud', icon: <ShieldAlert className="w-5 h-5" />, label: 'Fraud Detection', desc: 'Review risk alerts' },
    { href: '/agent', icon: <Users className="w-5 h-5" />, label: 'Agent Dashboard', desc: 'View agent workspace' },
    { href: '/knowledge', icon: <BookOpen className="w-5 h-5" />, label: 'Knowledge Base', desc: 'Manage articles' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#112D4E' }}>
              <Settings className="w-6 h-6" style={{ color: '#3F72AF' }} />
              Admin Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: '#3F72AF' }}>Platform-wide overview and management controls</p>
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
                className="group p-5 rounded-2xl border flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  borderColor: '#DBE2EF',
                  boxShadow: '0 4px 16px rgba(63,114,175,0.10), 0 1.5px 0 #DBE2EF',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)', color: '#F9F7F7' }}
                >
                  {link.icon}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#112D4E' }}>{link.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#3F72AF' }}>{link.desc}</p>
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
          <div
            className="rounded-2xl border p-5"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              borderColor: '#DBE2EF',
              boxShadow: '0 4px 24px rgba(63,114,175,0.08), 0 1.5px 0 #DBE2EF',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: '#112D4E' }}>Recent Tickets (All Users)</h2>
              <Link href="/tickets" className="text-xs font-semibold hover:underline" style={{ color: '#3F72AF' }}>
                View all →
              </Link>
            </div>
            {fetching ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#DBE2EF' }}>
                {recentTickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tickets/${t.id}`}
                    className="flex items-center justify-between py-3 rounded-lg px-2 transition-all duration-200 hover:bg-[#DBE2EF]/40 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono shrink-0" style={{ color: '#3F72AF' }}>{t.ticketNumber}</span>
                      <div className="min-w-0">
                        <span className="text-sm font-medium truncate block group-hover:text-[#3F72AF] transition-colors" style={{ color: '#112D4E' }}>
                          {t.subject}
                        </span>
                        {t.customer && <span className="text-xs" style={{ color: '#3F72AF' }}>{t.customer.name}</span>}
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ml-3"
                      style={{ background: '#DBE2EF', color: '#112D4E' }}
                    >
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
