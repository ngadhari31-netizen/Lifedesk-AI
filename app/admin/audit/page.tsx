'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { ScrollText, RefreshCw, Search } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  metadata?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: { name: string; email: string; role: string } | null;
}

export default function AdminAuditPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
    }
  }, [user, loading, router]);

  const fetchLogs = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/audit');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchLogs();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      (l.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

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
                <ScrollText className="w-6 h-6" style={{ color: '#3F72AF' }} />
                Security &amp; Operational Audit Logs
              </h1>
              <p className="text-xs mt-1" style={{ color: '#3F72AF' }}>
                Immutable chronological ledger of risk reviews, ticket escalations, and administrative modifications
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                borderColor: '#DBE2EF',
                color: '#3F72AF',
                boxShadow: '0 2px 8px rgba(63,114,175,0.08)',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-6 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3F72AF' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit actions, resources, users…"
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2"
              style={{
                background: 'rgba(255,255,255,0.8)',
                borderColor: '#DBE2EF',
                color: '#112D4E',
              }}
            />
          </div>

          {/* Audit Logs Table */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              borderColor: '#DBE2EF',
              boxShadow: '0 8px 32px rgba(63,114,175,0.10)',
            }}
          >
            {fetching ? (
              <div className="flex justify-center py-16">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-xs" style={{ color: '#3F72AF' }}>
                No audit log events recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className="border-b text-[11px] font-bold uppercase tracking-wider"
                    style={{ background: '#DBE2EF', borderColor: '#DBE2EF', color: '#3F72AF' }}
                  >
                    <tr>
                      <th className="py-3.5 px-5">Timestamp</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-4">Resource</th>
                      <th className="py-3.5 px-4">Actor</th>
                      <th className="py-3.5 px-4">Details / Metadata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b transition-colors hover:bg-[#DBE2EF]/30"
                        style={{ borderColor: '#DBE2EF' }}
                      >
                        <td className="py-3.5 px-5 font-mono text-[11px] whitespace-nowrap" style={{ color: '#3F72AF' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-xs" style={{ color: '#112D4E' }}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-medium" style={{ color: '#3F72AF' }}>
                          {log.resource}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {log.user ? (
                            <div>
                              <span className="font-semibold" style={{ color: '#112D4E' }}>{log.user.name}</span>
                              <span className="text-[10px] block" style={{ color: '#3F72AF' }}>{log.user.role}</span>
                            </div>
                          ) : (
                            <span className="italic" style={{ color: '#3F72AF' }}>System AI</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate" style={{ color: '#3F72AF' }}>
                          {log.metadata || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
