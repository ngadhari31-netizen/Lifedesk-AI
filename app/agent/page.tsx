'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TicketTable } from '@/components/tickets/TicketTable';
import { AgentCopilot } from '@/components/dashboard/AgentCopilot';
import { useRouter } from 'next/navigation';
import {
  Headphones, Clock, CheckCircle, Zap, Ticket, Users, RefreshCw, Filter,
} from 'lucide-react';
import Link from 'next/link';

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
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredTickets = statusFilter === 'ALL' ? tickets : tickets.filter((t) => t.status === statusFilter);

  const stats = {
    assigned: tickets.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
    escalated: tickets.filter((t) => t.status === 'ESCALATED').length,
  };

  const statuses = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED'];

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
                <Headphones className="w-6 h-6 text-emerald-500" />
                Agent Workspace
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage all customer tickets with AI assistance</p>
            </div>
            <button
              onClick={fetchTickets}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'My Assigned', value: stats.assigned, icon: <Ticket className="w-5 h-5" />, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
              { label: 'New Open', value: stats.open, icon: <Clock className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
              { label: 'Resolved Today', value: stats.resolved, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
              { label: 'Escalated', value: stats.escalated, icon: <Zap className="w-5 h-5" />, color: 'text-red-500 bg-red-50 dark:bg-red-950/40' },
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

          {/* Status Filter */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {statuses.map((s) => (
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
