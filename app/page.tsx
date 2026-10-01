'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Ticket,
  Headphones,
  ShieldAlert,
  Globe,
  Bot,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  MessageSquare,
} from 'lucide-react';

export default function LandingPage() {
  const { user, quickLogin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI LifeDesk • 24/7 AI Customer Support Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            24/7 AI Customer Support{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              That Actually Helps.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get instant answers, create and track support requests, detect potentially suspicious activity, and connect with human specialists when you need them.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/chat">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-indigo-500/25" icon={<Sparkles className="w-4 h-4" />}>
                Start AI Support
              </Button>
            </Link>
            <Link href="/tickets">
              <Button size="lg" variant="outline" className="w-full sm:w-auto" icon={<Ticket className="w-4 h-4" />}>
                Track My Ticket
              </Button>
            </Link>
          </div>

          {/* Fast Demo Access Card for Judges */}
          <div className="mt-12 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg max-w-xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              ⚡ Hackathon 1-Click Role Access (No Typing Needed)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('CUSTOMER')}
                className="py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:scale-[1.02] transition-transform text-center"
              >
                Customer Portal
              </button>
              <button
                onClick={() => quickLogin('AGENT')}
                className="py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 text-xs font-bold hover:scale-[1.02] transition-transform text-center"
              >
                Agent Workspace
              </button>
              <button
                onClick={() => quickLogin('ADMIN')}
                className="py-2.5 px-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 text-xs font-bold hover:scale-[1.02] transition-transform text-center"
              >
                Admin & Fraud Ops
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Section 38) */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Complete Customer-Service Intelligence
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              One unified platform combining 24/7 AI conversation, enterprise ticketing, and fraud defense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">24/7 AI Support</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant conversational responses grounded in your verified knowledge base. Handles orders, billing, and technical queries at any hour.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-emerald-500/20">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Smart Ticketing</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatic triage with structured JSON categorization, priority scoring, sentiment detection, and visual progress tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-purple-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Human Escalation</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                One-click "Talk to a Human". AI summarizes complete message history so human specialists never ask customers to repeat themselves.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-amber-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Fraud Detection</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Screens anomalous charge patterns, multiple refund spikes, and credential compromises with full audit trails and human review workflows.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-sky-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Multilingual Support</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Native support for English, Hindi (हिंदी), and Marathi (मराठी) with automatic dialect comprehension and localized responses.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center mb-4 shadow-sm shadow-indigo-600/20">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Agent Copilot</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Empowers human support agents to generate empathetic reply drafts, summarize complex message threads, and accelerate resolutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Section 38) */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How AI LifeDesk Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              From first user complaint to verified resolution in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <span className="text-3xl font-black text-indigo-600/20 dark:text-indigo-400/20 mb-2 block">01</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tell us your problem</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Describe your issue naturally via text or voice. "My payment was deducted but my order was cancelled."
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <span className="text-3xl font-black text-indigo-600/20 dark:text-indigo-400/20 mb-2 block">02</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI checks verified solutions</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                AI classifies intent, runs risk screening, matches grounded knowledge base articles, and provides instant guidance.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <span className="text-3xl font-black text-indigo-600/20 dark:text-indigo-400/20 mb-2 block">03</span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Track resolution with human care</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                If needed, an instant ticket is created and routed to a human specialist equipped with AI copilot draft assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">AI LifeDesk</span>
            <span>— "One AI. Every Customer-Service Problem."</span>
          </div>
          <div>
            Built with Next.js, Prisma, Tailwind CSS & Google Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
