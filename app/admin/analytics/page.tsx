'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { useRouter } from 'next/navigation';
import { BarChart3, Ticket, ShieldAlert, Clock, Star } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetch('/api/analytics/overview')
        .then((r) => r.json())
        .then((d) => setData(d))
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#112D4E' }}>
              <BarChart3 className="w-6 h-6" style={{ color: '#3F72AF' }} />
              Platform Analytics &amp; System Insights
            </h1>
            <p className="text-xs mt-1" style={{ color: '#3F72AF' }}>
              Cross-departmental telemetry, AI resolution efficacy, and risk event frequency
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Ticket Volume"
              value={fetching ? '—' : String(m?.totalTickets ?? 0)}
              icon={<Ticket className="w-5 h-5" />}
              color="indigo"
            />
            <StatsCard
              title="Avg Resolution Time"
              value={fetching ? '—' : `${m?.avgResolutionHours ?? 2.4}h`}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
            />
            <StatsCard
              title="Customer CSAT"
              value={fetching ? '—' : `${m?.csatScore ?? 94}%`}
              icon={<Star className="w-5 h-5" />}
              color="emerald"
            />
            <StatsCard
              title="Fraud Risk Alerts"
              value={fetching ? '—' : String(m?.totalFraudEvents ?? 0)}
              icon={<ShieldAlert className="w-5 h-5" />}
              color="rose"
            />
          </div>

          {/* Charts & AI Insights */}
          {data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalyticsCharts
                  ticketsByCategory={data.charts.ticketsByCategory}
                  ticketsByPriority={data.charts.ticketsByPriority}
                  ticketsByStatus={data.charts.ticketsByStatus}
                  resolutionTrends={data.charts.resolutionTrends}
                />
              </div>
              <div className="space-y-4">
                <AIInsightCard insights={data.aiInsights} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
