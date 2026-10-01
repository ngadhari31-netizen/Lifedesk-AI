'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  Ticket,
  BookOpen,
  User,
  ShieldAlert,
  BarChart3,
  Users,
  Settings,
  Headphones,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const customerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/chat', label: '24/7 AI Assistant', icon: Sparkles, badge: 'AI' },
    { href: '/tickets', label: 'My Tickets', icon: Ticket },
    { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const agentLinks = [
    { href: '/agent', label: 'Agent Dashboard', icon: LayoutDashboard },
    { href: '/agent/tickets', label: 'Support Tickets', icon: Ticket },
    { href: '/agent/customers', label: 'Customer Directory', icon: Users },
    { href: '/agent/copilot', label: 'AI Agent Copilot', icon: Headphones, badge: 'AI' },
    { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { href: '/agent/analytics', label: 'Performance Analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { href: '/admin', label: 'System Overview', icon: LayoutDashboard },
    { href: '/admin/tickets', label: 'All Tickets', icon: Ticket },
    { href: '/admin/fraud', label: 'Fraud & Risk Screening', icon: ShieldAlert, badge: 'Shield' },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { href: '/admin/analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { href: '/admin/audit', label: 'Audit Logs', icon: ScrollText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  let links = customerLinks;
  if (user?.role === 'ADMIN') links = adminLinks;
  else if (user?.role === 'AGENT') links = agentLinks;

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 w-64 p-4">
      {/* Role Pill Header */}
      {user && (
        <div className="mb-4 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                user.role === 'ADMIN'
                  ? 'bg-purple-500'
                  : user.role === 'AGENT'
                  ? 'bg-indigo-500'
                  : 'bg-emerald-500'
              )}
            />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {user.role === 'ADMIN'
                ? 'Admin Portal'
                : user.role === 'AGENT'
                ? 'Agent Workspace'
                : 'Customer Portal'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">24/7 Live</span>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && item.href !== '/agent' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={clsx(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Card */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI LifeDesk Core</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Gemini JSON Mode + Fraud Screening Active
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0">{content}</aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
