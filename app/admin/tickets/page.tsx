'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TicketTable } from '@/components/tickets/TicketTable';
import { useRouter } from 'next/navigation';
import { Ticket, RefreshCw, Shield, Sparkles } from 'lucide-react';

export default function AdminTicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
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
    if (user?.role === 'ADMIN') {
      fetchTickets();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0f0d]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-[#0a0f0d]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-emerald-600" />
                All Platform Tickets (Admin Supervision)
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Full platform ticket oversight, risk indicators, customer sentiment, and departmental queues
              </p>
            </div>
            <button
              onClick={fetchTickets}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111815] text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} />
              Refresh All
            </button>
          </div>

          <TicketTable tickets={tickets} basePath="/tickets" loading={fetching} userRole="ADMIN" />
        </main>
      </div>
    </div>
  );
}
