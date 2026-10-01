'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { FraudAlert } from '@/components/fraud/FraudAlert';
import { RiskReviewDialog } from '@/components/fraud/RiskReviewDialog';
import { useRouter } from 'next/navigation';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, RefreshCw, Filter } from 'lucide-react';

interface FraudEvent {
  id: string;
  customerId: string;
  ticketId?: string;
  riskLevel: string;
  riskScore: number;
  eventType: string;
  status: string;
  explanation: string;
  recommendedAction?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  customer: { name: string; email: string };
  signals: Array<{ id: string; signal: string; severity: string }>;
}

export default function FraudPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<FraudEvent[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && user.role === 'CUSTOMER') router.push('/dashboard');
  }, [user, loading, router]);

  const fetchEvents = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/fraud/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'CUSTOMER') fetchEvents();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredEvents = events.filter((e) => {
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchRisk = riskFilter === 'ALL' || e.riskLevel === riskFilter;
    return matchStatus && matchRisk;
  });

  const stats = {
    total: events.length,
    pending: events.filter((e) => e.status === 'PENDING_REVIEW').length,
    critical: events.filter((e) => e.riskLevel === 'CRITICAL').length,
    reviewed: events.filter((e) => e.status === 'REVIEWED').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                Fraud Detection
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">AI-powered risk screening and review workflows</p>
            </div>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Alerts', value: stats.total, icon: <ShieldAlert className="w-5 h-5" />, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
              { label: 'Pending Review', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
              { label: 'Critical Risk', value: stats.critical, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-500 bg-red-50 dark:bg-red-950/40' },
              { label: 'Reviewed', value: stats.reviewed, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{fetching ? '—' : s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              {['ALL', 'PENDING_REVIEW', 'REVIEWED', 'ESCALATED', 'DISMISSED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold">Risk:</span>
              {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    riskFilter === r
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {r === 'ALL' ? 'All' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Customer info displayed above each alert */}
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No fraud events found</p>
              <p className="text-xs text-slate-400 mt-1">Risk alerts will appear here when detected by AI screening</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="space-y-2">
                  {/* Customer header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{event.customer.name}</span>
                      {' '}·{' '}{event.customer.email}
                      {' '}·{' '}{new Date(event.createdAt).toLocaleString()}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      event.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      event.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      event.status === 'ESCALATED' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {event.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <FraudAlert
                    fraudEvent={{
                      id: event.id,
                      riskLevel: event.riskLevel,
                      riskScore: event.riskScore,
                      explanation: event.explanation,
                      recommendedAction: event.recommendedAction,
                      status: event.status,
                      signals: event.signals,
                    }}
                    onReview={event.status === 'PENDING_REVIEW' ? () => setSelectedEventId(event.id) : undefined}
                    onEscalate={event.status === 'PENDING_REVIEW' ? () => setSelectedEventId(event.id) : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Review Dialog */}
      {selectedEventId && (
        <RiskReviewDialog
          isOpen={!!selectedEventId}
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onSuccess={() => { setSelectedEventId(null); fetchEvents(); }}
        />
      )}
    </div>
  );
}
