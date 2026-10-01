'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TicketTable } from '@/components/tickets/TicketTable';
import { useRouter } from 'next/navigation';
import { Ticket, Plus, Search, Filter } from 'lucide-react';
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
  assignedAgent?: { name: string };
  customer?: { name: string; email: string };
  _count?: { messages: number };
}

export default function TicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F7]">
        <div className="w-8 h-8 border-3 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED'];

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
                <Ticket className="w-7 h-7 text-[#3F72AF]" />
                Support Tickets
              </h1>
              <p className="text-sm font-medium text-[#112D4E]/70 mt-1">
                {fetching
                  ? 'Loading tickets...'
                  : `${filteredTickets.length} ticket${
                      filteredTickets.length !== 1 ? 's' : ''
                    } in record`}
              </p>
            </div>
            <Link
              href="/chat"
              className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md active:translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-white" />
              New Inquiry
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F72AF]" />
              <input
                type="text"
                placeholder="Search by subject or ticket number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DBE2EF] bg-white text-sm text-[#112D4E] placeholder:text-[#3F72AF]/40 focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 focus:border-[#3F72AF] shadow-xs"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-4 h-4 text-[#3F72AF] shrink-0 mr-1" />
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === s
                      ? 'btn-3d text-white shadow-xs'
                      : 'bg-white border border-[#DBE2EF] text-[#112D4E]/80 hover:bg-[#DBE2EF]/30 hover:text-[#112D4E]'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
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
