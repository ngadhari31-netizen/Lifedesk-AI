'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TicketTable } from '@/components/tickets/TicketTable';
import { useRouter } from 'next/navigation';
import {
  Headphones, Clock, CheckCircle, Zap, Ticket, RefreshCw, Filter,
} from 'lucide-react';

interface TicketData {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  sentiment: string;
  createdAt: string;
  updatedAt: string;
  category?: { name: string };
  customer?: { name: string; email: string };
  assignedAgent?: { name: string };
  _count?: { messages: number };
  aiSummary?: string;
  messages?: unknown[];
}

export default function AgentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState('OPEN');

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CUSTOMER') router.push('/dashboard');
    }
  }, [user, loading, router]);

  const fetchTickets = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'CUSTOMER') fetchTickets();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const filteredTickets = statusFilter === 'ALL' ? tickets : tickets.filter((t) => t.status === statusFilter);

  const stats = [
    { label: 'My Assigned', value: tickets.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length, icon: <Ticket className="w-5 h-5" /> },
    { label: 'New Open', value: tickets.filter((t) => t.status === 'OPEN').length, icon: <Clock className="w-5 h-5" /> },
    { label: 'Resolved Today', value: tickets.filter((t) => t.status === 'RESOLVED').length, icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Escalated', value: tickets.filter((t) => t.status === 'ESCALATED').length, icon: <Zap className="w-5 h-5" /> },
  ];

  const statuses = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#112D4E' }}>
                <Headphones className="w-6 h-6" style={{ color: '#3F72AF' }} />
                Agent Workspace
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#3F72AF' }}>Manage all customer tickets with AI assistance</p>
            </div>
            <button
              onClick={fetchTickets}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                borderColor: '#DBE2EF',
                color: '#3F72AF',
                boxShadow: '0 2px 8px rgba(63,114,175,0.08)',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(12px)',
                  borderColor: '#DBE2EF',
                  boxShadow: '0 4px 16px rgba(63,114,175,0.08), 0 1.5px 0 #DBE2EF',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: i === 3 ? 'rgba(239,68,68,0.1)' : 'rgba(63,114,175,0.12)',
                    color: i === 3 ? '#ef4444' : '#3F72AF',
                  }}
                >
                  {s.icon}
                </div>
                <div className="text-2xl font-extrabold" style={{ color: '#112D4E' }}>{fetching ? '—' : s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#3F72AF' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <Filter className="w-4 h-4" style={{ color: '#3F72AF' }} />
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={
                  statusFilter === s
                    ? {
                        background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                        color: '#F9F7F7',
                        boxShadow: '0 2px 8px rgba(63,114,175,0.25)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid #DBE2EF',
                        color: '#3F72AF',
                      }
                }
              >
                {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Ticket Table */}
          <TicketTable
            tickets={filteredTickets}
            loading={fetching}
            onRefresh={fetchTickets}
            userRole={user.role}
          />
        </main>
      </div>
    </div>
  );
}
