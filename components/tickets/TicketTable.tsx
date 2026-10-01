'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldAlert, ChevronRight, User, Ticket } from 'lucide-react';

interface TicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  sentiment?: string;
  aiSummary?: string | null;
  createdAt: string;
  updatedAt?: string;
  customer?: { id?: string; name: string; email: string; avatarUrl?: string | null };
  assignedAgent?: { id?: string; name: string; email?: string } | null;
  category?: { name: string } | null;
  fraudEvents?: Array<{ riskLevel: string; riskScore: number }>;
}

interface TicketTableProps {
  tickets: TicketItem[];
  basePath?: string;
  onRefresh?: () => void;
  loading?: boolean;
  userRole?: string;
}

export function TicketTable({ tickets, basePath = '/tickets', loading }: TicketTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.customer?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    let matchesRisk = true;
    if (riskFilter === 'FLAGGED') {
      matchesRisk = (t.fraudEvents && t.fraudEvents.length > 0) || false;
    } else if (riskFilter === 'CLEAR') {
      matchesRisk = !t.fraudEvents || t.fraudEvents.length === 0;
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesRisk;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger" size="sm">URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="blue" size="sm">MEDIUM</Badge>;
      default:
        return <Badge variant="default" size="sm">LOW</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <Badge variant="success" size="sm">{status.replace(/_/g, ' ')}</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="blue" size="sm">IN PROGRESS</Badge>;
      case 'WAITING_FOR_CUSTOMER':
        return <Badge variant="warning" size="sm">WAITING</Badge>;
      case 'ESCALATED':
        return <Badge variant="danger" size="sm">ESCALATED</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="card-3d p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F72AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by ID, title, description, customer..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#DBE2EF] bg-white text-[#112D4E] placeholder-[#3F72AF]/40 focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 focus:border-[#3F72AF]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DBE2EF] bg-white text-[#112D4E] focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_CUSTOMER">Waiting Customer</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DBE2EF] bg-white text-[#112D4E] focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Risk Screening Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DBE2EF] bg-white text-[#112D4E] focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="FLAGGED">Flagged for Review</option>
            <option value="CLEAR">Clear Signals</option>
          </select>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="card-3d rounded-2xl overflow-hidden shadow-md">
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center">
            <Ticket className="w-10 h-10 text-[#3F72AF]/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#112D4E]">No tickets found</h3>
            <p className="text-xs font-medium text-[#112D4E]/60 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any records matching your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#DBE2EF]/40 border-b border-[#DBE2EF] text-[11px] font-black uppercase tracking-wider text-[#112D4E]/80">
                <tr>
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Issue &amp; AI Summary</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Risk Screening</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE2EF]/60 bg-white/70">
                {filteredTickets.map((t) => {
                  const hasFraud = t.fraudEvents && t.fraudEvents.length > 0;
                  const fraud = hasFraud ? t.fraudEvents![0] : null;

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#DBE2EF]/30 transition-colors group"
                    >
                      {/* Ticket Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3F72AF] whitespace-nowrap">
                        <Link href={`${basePath}/${t.id}`} className="hover:underline flex items-center gap-1">
                          <span>#{t.ticketNumber}</span>
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#DBE2EF] text-[#112D4E] flex items-center justify-center font-bold text-[10px]">
                            {t.customer?.name ? t.customer.name[0] : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-[#112D4E] leading-tight">
                              {t.customer?.name || 'Customer'}
                            </div>
                            <div className="text-[10px] text-[#112D4E]/60">{t.customer?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Summary */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link href={`${basePath}/${t.id}`} className="block group-hover:text-[#3F72AF]">
                          <div className="font-bold text-[#112D4E] truncate">
                            {t.subject}
                          </div>
                          <div className="text-[11px] font-medium text-[#112D4E]/70 truncate mt-0.5">
                            {t.aiSummary || t.description}
                          </div>
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="default" size="sm">
                          {t.category?.name || 'General'}
                        </Badge>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(t.priority)}
                      </td>

                      {/* Risk Screening */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {fraud ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            <span>{fraud.riskLevel} ({fraud.riskScore})</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#112D4E]/50 font-medium">Clear</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(t.status)}
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#112D4E]/70 font-medium">
                        {t.assignedAgent ? (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#3F72AF]" />
                            <span>{t.assignedAgent.name}</span>
                          </div>
                        ) : (
                          <span className="text-[#112D4E]/40 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`${basePath}/${t.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#DBE2EF] text-[#112D4E] font-bold hover:bg-[#3F72AF] hover:text-white transition-all shadow-xs"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
