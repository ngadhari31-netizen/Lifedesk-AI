'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import {
  Users, Search, Shield, Headphones, User, CheckCircle, Filter,
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
  language: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchUsers();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4" style={{ color: '#112D4E' }} />;
      case 'AGENT': return <Headphones className="w-4 h-4" style={{ color: '#3F72AF' }} />;
      default: return <User className="w-4 h-4" style={{ color: '#3F72AF' }} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#112D4E' }}>
                <Users className="w-6 h-6" style={{ color: '#3F72AF' }} />
                User Management
              </h1>
              <p className="text-xs mt-1" style={{ color: '#3F72AF' }}>
                Administer user credentials, access roles, and permissions
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-2xl border mb-6"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              borderColor: '#DBE2EF',
              boxShadow: '0 4px 16px rgba(63,114,175,0.08)',
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3F72AF' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name, email…"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2"
                style={{
                  background: '#F9F7F7',
                  borderColor: '#DBE2EF',
                  color: '#112D4E',
                }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 ml-1" style={{ color: '#3F72AF' }} />
              {['ALL', 'CUSTOMER', 'AGENT', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={
                    roleFilter === r
                      ? {
                          background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                          color: '#F9F7F7',
                          boxShadow: '0 2px 8px rgba(63,114,175,0.25)',
                        }
                      : {
                          background: '#F9F7F7',
                          border: '1px solid #DBE2EF',
                          color: '#3F72AF',
                        }
                  }
                >
                  {r === 'ALL' ? 'All Roles' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
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
                No users found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className="border-b text-[11px] font-bold uppercase tracking-wider"
                    style={{ background: '#DBE2EF', borderColor: '#DBE2EF', color: '#3F72AF' }}
                  >
                    <tr>
                      <th className="py-3.5 px-5">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Language</th>
                      <th className="py-3.5 px-4">Created Date</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, idx) => (
                      <tr
                        key={u.id}
                        className="border-b transition-colors hover:bg-[#DBE2EF]/30"
                        style={{ borderColor: '#DBE2EF' }}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                              style={{
                                background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                                color: '#F9F7F7',
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold" style={{ color: '#112D4E' }}>{u.name}</div>
                              <div className="text-[11px]" style={{ color: '#3F72AF' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-semibold" style={{ color: '#112D4E' }}>
                            {getRoleIcon(u.role)}
                            <span>{u.role}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 uppercase font-mono" style={{ color: '#3F72AF' }}>
                          {u.language}
                        </td>
                        <td className="py-3.5 px-4" style={{ color: '#3F72AF' }}>
                          {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{ background: '#DBE2EF', borderColor: '#3F72AF', color: '#112D4E' }}
                          >
                            <CheckCircle className="w-3 h-3" style={{ color: '#3F72AF' }} />
                            Active
                          </span>
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
