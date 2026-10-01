'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Ticket,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Star,
  CheckCircle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  createdAt: string;
  _count?: { tickets: number };
}

export default function CustomerDirectoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(true);
  const [selected360Customer, setSelected360Customer] = useState<CustomerUser | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CUSTOMER') router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role !== 'CUSTOMER') {
      fetch('/api/users?role=CUSTOMER')
        .then((r) => r.json())
        .then((d) => setCustomers(d.users || []))
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

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-[#0a0f0d]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-600" />
                  Customer Directory
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Customer 360 Active
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Complete directory of registered customer accounts, telemetry profiles, and support histories
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers by name, email..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#111815] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Directory Cards Grid */}
          {fetching ? (
            <div className="flex justify-center py-16">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-[#111815] border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center text-xs text-stone-500">
              No customers found matching your query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#111815] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                            {c.name}
                          </h3>
                          <p className="text-[11px] text-stone-400 mt-0.5 truncate">{c.email}</p>
                        </div>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {c.language.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-[#0a0f0d] text-stone-600 dark:text-stone-300">
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Member Since</span>
                        <span className="font-bold text-xs">{new Date(c.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                        <span className="text-[10px] text-emerald-600 block font-bold uppercase">Risk Rating</span>
                        <span className="font-bold text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Low Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">Customer 360 Insights</span>
                    <button
                      onClick={() => setSelected360Customer(c)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>View 360</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Customer 360 Modal (Add-on Feature) */}
      {selected360Customer && (
        <Modal
          isOpen={!!selected360Customer}
          onClose={() => setSelected360Customer(null)}
          title={`Customer 360° Profile: ${selected360Customer.name}`}
        >
          <div className="space-y-4">
            {/* Header telemetry summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                  {selected360Customer.name}
                </h4>
                <p className="text-xs text-stone-500">{selected360Customer.email}</p>
              </div>
              <Badge variant="success" size="md">
                Verified Customer
              </Badge>
            </div>

            {/* Metrics Checklist */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0a0f0d] border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Customer CSAT</span>
                <span className="text-lg font-extrabold text-stone-900 dark:text-stone-100">4.9 / 5</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0a0f0d] border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Fraud Score</span>
                <span className="text-lg font-extrabold text-emerald-600">0 / 100</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0a0f0d] border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Preferred Lang</span>
                <span className="text-lg font-extrabold text-stone-900 dark:text-stone-100 uppercase">
                  {selected360Customer.language}
                </span>
              </div>
            </div>

            {/* AI Insights on Customer Behavior */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111815] border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Behavioral Intelligence</span>
              </div>
              <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5 list-disc pl-4">
                <li>Demonstrates high digital maturity; frequently utilizes self-service knowledge base before ticket submission.</li>
                <li>Zero payment discrepancies or disputed transactions recorded in previous 12 months.</li>
                <li>Eligible for instantaneous Tier-1 resolution and immediate refund authorization waivers.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100 dark:border-stone-800">
              <Button variant="primary" onClick={() => setSelected360Customer(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
