'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  ShieldCheck,
  Headphones,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const { user, logout, quickLogin, language, setLanguage, theme, toggleTheme } = useAuth();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3F72AF]/20 bg-[#112D4E]/95 backdrop-blur-xl shadow-lg transition-all duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-[#DBE2EF] hover:bg-white/10 active:scale-95 transition-all focus:outline-none"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3F72AF] to-[#2E5E9B] text-white shadow-md border-t border-white/30 group-hover:scale-105 active:scale-95 transition-all">
              <Sparkles className="h-5 w-5 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#F9F7F7]">
                  AI LifeDesk
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3F72AF]/30 text-[#DBE2EF] border border-[#3F72AF]/40">
                  Enterprise
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-[#DBE2EF]/70 leading-none">
                One AI. Every Customer-Service Problem.
              </p>
            </div>
          </Link>
        </div>

        {/* Right actions: Demo Switcher, Language, Theme, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Roles Menu */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#3F72AF]/25 text-[#F9F7F7] border border-[#3F72AF]/40 hover:bg-[#3F72AF]/40 shadow-sm active:translate-y-0.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DBE2EF]" />
              <span>Demo Roles</span>
              <ChevronDown className="w-3 h-3 text-[#DBE2EF]" />
            </button>

            {demoMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DBE2EF] shadow-2xl py-1.5 z-50 card-3d animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setDemoMenuOpen(false)}
              >
                <div className="px-3.5 py-1.5 border-b border-[#DBE2EF] text-[11px] font-bold uppercase tracking-wider text-[#112D4E]/60">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => quickLogin('CUSTOMER')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#112D4E] hover:bg-[#DBE2EF]/40 text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Customer (Rahul)</div>
                    <div className="text-[10px] text-[#112D4E]/60">Create & track issues</div>
                  </div>
                </button>
                <button
                  onClick={() => quickLogin('AGENT')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#112D4E] hover:bg-[#DBE2EF]/40 text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF]">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Support Agent (Alex)</div>
                    <div className="text-[10px] text-[#112D4E]/60">Copilot & resolutions</div>
                  </div>
                </button>
                <button
                  onClick={() => quickLogin('ADMIN')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#112D4E] hover:bg-[#DBE2EF]/40 text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#112D4E] flex items-center justify-center text-[#F9F7F7]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Admin (Sarah)</div>
                    <div className="text-[10px] text-[#112D4E]/60">Fraud screening & analytics</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 rounded-xl text-[#DBE2EF] hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Select Language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline uppercase font-bold">{language}</span>
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DBE2EF] shadow-2xl py-1.5 z-50 card-3d animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setLangMenuOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      language === l.code
                        ? 'bg-[#DBE2EF] text-[#3F72AF] font-bold'
                        : 'text-[#112D4E] hover:bg-[#DBE2EF]/40'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <span className="text-[#3F72AF]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (kept subtle) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#DBE2EF] hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#DBE2EF]" />}
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile or Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#3F72AF]/30">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-[#F9F7F7] leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] font-semibold text-[#DBE2EF] uppercase tracking-wider">
                  {user.role}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-[#DBE2EF] hover:text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-[#F9F7F7] hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-3d px-3.5 py-1.5 text-xs font-bold rounded-xl text-white shadow-md active:translate-y-0.5"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
