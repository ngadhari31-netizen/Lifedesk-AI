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
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F7]">
        <div className="w-8 h-8 border-3 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen flex flex-col bg-[#F9F7F7] text-[#112D4E]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#112D4E] flex items-center gap-2.5">
                <ShieldAlert className="w-7 h-7 text-rose-600" />
                Fraud &amp; Risk Screening
              </h1>
              <p className="text-sm font-medium text-[#112D4E]/70 mt-1">
                Real-time transaction anomaly screening and supervisor review trails
              </p>
            </div>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DBE2EF] bg-white text-xs font-bold text-[#112D4E] hover:bg-[#DBE2EF]/30 transition-all shadow-xs active:translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4 text-[#3F72AF]" />
              Refresh Events
            </button>
          </div>

          {/* Stats Grid with 3D cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Total Screened',
                value: stats.total,
                icon: <ShieldAlert className="w-5 h-5 text-[#3F72AF]" />,
              },
              {
                label: 'Pending Review',
                value: stats.pending,
                icon: <Clock className="w-5 h-5 text-amber-600" />,
              },
              {
                label: 'Critical Risk',
                value: stats.critical,
                icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
              },
              {
                label: 'Audit Reviewed',
                value: stats.reviewed,
                icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
              },
            ].map((s) => (
              <div key={s.label} className="card-3d rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#DBE2EF] flex items-center justify-center mb-3 shadow-xs">
                  {s.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#112D4E]">
                  {fetching ? '—' : s.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#112D4E]/60 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card-3d p-4 rounded-2xl mb-6 flex flex-wrap gap-4 items-center justify-between shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-4 h-4 text-[#3F72AF]" />
              <span className="text-xs text-[#112D4E] font-bold mr-1">Status:</span>
              {['ALL', 'PENDING_REVIEW', 'REVIEWED', 'ESCALATED', 'DISMISSED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === s
                      ? 'btn-3d text-white shadow-xs'
                      : 'bg-white border border-[#DBE2EF] text-[#112D4E]/70 hover:bg-[#DBE2EF]/30'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-[#112D4E] font-bold mr-1">Risk:</span>
              {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    riskFilter === r
                      ? 'btn-3d-navy text-[#F9F7F7] shadow-xs'
                      : 'bg-white border border-[#DBE2EF] text-[#112D4E]/70 hover:bg-[#DBE2EF]/30'
                  }`}
                >
                  {r === 'ALL' ? 'All' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards */}
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="card-3d text-center py-20 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-[#3F72AF]/40 mx-auto mb-4" />
              <p className="text-[#112D4E] font-bold text-base">No fraud anomalies detected</p>
              <p className="text-xs text-[#112D4E]/60 font-medium mt-1">
                Risk alerts will appear here when telemetry flags anomalous transaction velocity.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="text-xs text-[#112D4E]/70 font-semibold">
                      <span className="font-black text-[#112D4E]">
                        {event.customer.name}
                      </span>{' '}
                      · {event.customer.email} · {new Date(event.createdAt).toLocaleString()}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        event.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : event.status === 'REVIEWED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-[#DBE2EF] text-[#112D4E] border border-[#DBE2EF]'
                      }`}
                    >
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
                    onReview={
                      event.status === 'PENDING_REVIEW'
                        ? () => setSelectedEventId(event.id)
                        : undefined
                    }
                    onEscalate={
                      event.status === 'PENDING_REVIEW'
                        ? () => setSelectedEventId(event.id)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedEventId && (
        <RiskReviewDialog
          isOpen={!!selectedEventId}
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onSuccess={() => {
            setSelectedEventId(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
