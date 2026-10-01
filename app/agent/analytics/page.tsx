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
  BarChart3,
  Clock,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  Target,
  ShieldCheck,
} from 'lucide-react';

export default function AgentAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CUSTOMER') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role !== 'CUSTOMER') {
      fetch('/api/analytics/overview')
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0f0d]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const m = data?.metrics;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-[#0a0f0d]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              Agent Performance Analytics
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Operational KPIs, resolution velocity, SLA benchmarks, and CSAT ratings
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="First Contact Resolution"
              value="88.4%"
              subtitle="Target: > 85%"
              icon={<Zap className="w-5 h-5" />}
              color="emerald"
            />
            <StatsCard
              title="Avg Resolution Time"
              value={fetching ? '—' : `${m?.avgResolutionHours ?? 2.1}h`}
              subtitle="Benchmark: < 4h"
              icon={<Clock className="w-5 h-5" />}
              color="indigo"
            />
            <StatsCard
              title="CSAT Satisfaction"
              value={fetching ? '—' : `${m?.csatScore ?? 94}%`}
              subtitle="4.8 / 5.0 Star Rating"
              icon={<Star className="w-5 h-5" />}
              color="amber"
            />
            <StatsCard
              title="SLA Compliance"
              value="99.2%"
              subtitle="Zero overdue escalations"
              icon={<ShieldCheck className="w-5 h-5" />}
              color="emerald"
            />
          </div>

          {/* Operational Charts & Insights */}
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

                {/* Agent Productivity Benchmark Card */}
                <div className="bg-white dark:bg-[#111815] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
                  <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    Support Velocity Targets
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                        <span>Tier-1 AI Auto-Resolution</span>
                        <span className="font-bold text-emerald-600">76%</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                        <span>Agent Copilot Adoption</span>
                        <span className="font-bold text-indigo-500">92%</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
