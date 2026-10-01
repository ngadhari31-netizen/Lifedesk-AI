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
    { href: '/admin/fraud', label: 'Fraud & Risk Screening', icon: ShieldAlert, badge: 'Risk' },
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
    <div className="flex flex-col h-full bg-[#112D4E] text-[#F9F7F7] border-r border-[#3F72AF]/20 w-64 p-4 shadow-xl">
      {/* Role Pill Header */}
      {user && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={clsx(
                'w-2.5 h-2.5 rounded-full ring-2 ring-white/20',
                user.role === 'ADMIN'
                  ? 'bg-rose-400'
                  : user.role === 'AGENT'
                  ? 'bg-[#3F72AF]'
                  : 'bg-emerald-400'
              )}
            />
            <span className="text-xs font-bold text-[#F9F7F7]">
              {user.role === 'ADMIN'
                ? 'Admin Portal'
                : user.role === 'AGENT'
                ? 'Agent Workspace'
                : 'Customer Portal'}
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/15 text-[#DBE2EF]">
            Live
          </span>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              item.href !== '/admin' &&
              item.href !== '/agent' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group',
                isActive
                  ? 'btn-3d text-white shadow-md'
                  : 'text-[#DBE2EF] hover:bg-white/10 hover:text-[#F9F7F7]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={clsx(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-white' : 'text-[#DBE2EF]/70 group-hover:text-[#F9F7F7]'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider',
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-[#3F72AF]/40 text-[#DBE2EF] border border-[#3F72AF]/40'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status Card */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#DBE2EF]">
            <Sparkles className="w-3.5 h-3.5 text-[#3F72AF]" />
            <span>AI LifeDesk Engine</span>
          </div>
          <p className="text-[11px] text-[#DBE2EF]/60 mt-1">
            Gemini Multimodal & Real-time Fraud Screening
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
            className="fixed inset-0 bg-[#112D4E]/70 backdrop-blur-sm transition-opacity"
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
