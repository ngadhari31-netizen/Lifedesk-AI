'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { Button } from '@/components/ui/Button';
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
  TrendingUp,
  Star,
  BarChart3,
  Lock,
} from 'lucide-react';

// Animated counter hook
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// Intersection Observer hook
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: '24/7 AI Resolution Engine',
    desc: 'Instant conversational responses grounded in your verified knowledge base. Handles orders, billing, and technical queries at any hour.',
  },
  {
    icon: <Ticket className="w-5 h-5" />,
    title: 'Intelligent Triage & Routing',
    desc: 'Automatic triage with structured classification, priority scoring, sentiment detection, and visual progression milestones.',
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: 'Human Escalation & Handoff',
    desc: 'One-click "Talk to a Human". AI summarizes complete customer context so specialists never ask customers to repeat details.',
  },
  {
    icon: <ShieldAlert className="w-5 h-5" />,
    title: 'Fraud & Risk Telemetry',
    desc: 'Continuous screening of charge anomalies, refund spikes, and credential anomalies with supervisor audit review trails.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Trilingual Enterprise Support',
    desc: 'Native comprehension and localized responses in English, Hindi (हिंदी), and Marathi (मराठी) with dialect adaptation.',
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: 'Agent Copilot & Diagnosis',
    desc: 'Empowers human support agents to generate empathetic reply drafts, summarize complex threads, and accelerate resolutions.',
  },
];

const stats = [
  { value: 98, suffix: '%', label: 'CSAT Score', icon: <Star className="w-5 h-5" /> },
  { value: 4, suffix: 'min', label: 'Avg Resolution Time', icon: <Clock className="w-5 h-5" /> },
  { value: 10000, suffix: '+', label: 'Tickets Resolved', icon: <CheckCircle2 className="w-5 h-5" /> },
  { value: 3, suffix: ' langs', label: 'Languages Supported', icon: <Globe className="w-5 h-5" /> },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Head of Customer Operations',
    company: 'ShopEase India',
    quote:
      'AI LifeDesk cut our response time by 85%. The multilingual support is transformative for our Hindi and Marathi-speaking customers.',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Chief Technology Officer',
    company: 'FinSecure Ltd.',
    quote:
      'The fraud screening caught 3 sophisticated refund anomalies in our first week. The audit trail is essential for our compliance team.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Support Engineering Manager',
    company: 'TechHelp Enterprise',
    quote:
      'The AI Copilot lets our team handle 3x more complex inquiries daily. Grounded summaries eliminate context-switching overhead completely.',
    rating: 5,
  },
];

function StatItem({
  value,
  suffix,
  label,
  icon,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  start: boolean;
}) {
  const count = useCounter(value, 2000, start);
  return (
    <div className="card-3d flex flex-col items-center p-6 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] mb-3 shadow-xs">
        {icon}
      </div>
      <div className="text-3xl sm:text-4xl font-black text-[#112D4E] tracking-tight">
        {count}
        {suffix}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-[#112D4E]/70 mt-1 text-center">
        {label}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user, quickLogin } = useAuth();
  const { ref: statsRef, inView: statsInView } = useInView();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F7] text-[#112D4E] selection:bg-[#3F72AF] selection:text-white">
      <Navbar />

      {/* ─── Hero Section with Draggable LifeDesk Universe ─── */}
      <HeroSection />

      {/* ─── Hackathon Role Sandbox Bridge ─── */}
      <section className="relative z-30 -mt-10 mb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto p-5 rounded-2xl glass-card border border-[#DBE2EF] shadow-2xl bg-white/95 backdrop-blur-md">
          <div className="text-xs font-black uppercase tracking-wider text-[#112D4E] mb-3.5 flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-[#3F72AF]" />
            Hackathon 1-Click Role Sandbox (Instant Role Switching)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => quickLogin('CUSTOMER')}
              className="p-3.5 rounded-xl border border-[#DBE2EF] bg-white hover:bg-[#DBE2EF]/30 text-[#112D4E] text-xs font-bold shadow-sm hover:shadow active:translate-y-0.5 transition-all text-center flex flex-col items-center justify-center"
            >
              <Users className="w-5 h-5 mb-1.5 text-emerald-600" />
              <span>Customer Portal</span>
              <span className="text-[10px] text-gray-500 font-normal mt-0.5">Submit & track tickets</span>
            </button>
            <button
              onClick={() => quickLogin('AGENT')}
              className="p-3.5 rounded-xl border border-[#3F72AF]/40 bg-[#DBE2EF]/40 hover:bg-[#DBE2EF] text-[#112D4E] text-xs font-bold shadow-sm hover:shadow active:translate-y-0.5 transition-all text-center flex flex-col items-center justify-center"
            >
              <Headphones className="w-5 h-5 mb-1.5 text-[#3F72AF]" />
              <span>Agent Workspace</span>
              <span className="text-[10px] text-[#3F72AF] font-normal mt-0.5">Copilot AI drafts & triage</span>
            </button>
            <button
              onClick={() => quickLogin('ADMIN')}
              className="p-3.5 rounded-xl border border-[#112D4E]/30 bg-[#112D4E] text-[#F9F7F7] text-xs font-bold shadow-md hover:bg-[#1A3A64] active:translate-y-0.5 transition-all text-center flex flex-col items-center justify-center"
            >
              <ShieldCheck className="w-5 h-5 mb-1.5 text-[#DBE2EF]" />
              <span>Admin &amp; Risk Ops</span>
              <span className="text-[10px] text-[#DBE2EF]/80 font-normal mt-0.5">Fraud radar & analytics</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Animated Stats Section ─── */}
      <section className="py-12 bg-white/70 border-y border-[#DBE2EF]">
        <div ref={statsRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} start={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Feature Cards with 3D Depth ─── */}
      <section className="py-20 grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DBE2EF] text-[#112D4E] text-xs font-extrabold mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-[#3F72AF]" />
              Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#112D4E] tracking-tight">
              Enterprise Customer Support Intelligence
            </h2>
            <p className="mt-3 text-sm text-[#112D4E]/70 font-medium">
              A single platform unifying conversational AI, automated triage pipelines, and fraud protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-3d p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3F72AF] to-[#2E5E9B] text-white flex items-center justify-center mb-4 shadow-sm border-t border-white/30">
                    {f.icon}
                  </div>
                  <h3 className="font-black text-base text-[#112D4E]">{f.title}</h3>
                  <p className="mt-2 text-xs font-medium text-[#112D4E]/75 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DBE2EF]/60 flex items-center text-[11px] font-bold text-[#3F72AF]">
                  <span>Operational Standard</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 bg-white/80 border-y border-[#DBE2EF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DBE2EF] text-[#112D4E] text-xs font-extrabold mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#3F72AF]" />
              Streamlined Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#112D4E] tracking-tight">
              How AI LifeDesk Works
            </h2>
            <p className="mt-3 text-sm text-[#112D4E]/70 font-medium">
              From customer query to verified human resolution in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Customer Submits Inquiry',
                desc: 'Describe any issue naturally in English, Hindi, or Marathi. Dialect nuances and intent are parsed automatically.',
                icon: <MessageSquare className="w-5 h-5" />,
              },
              {
                step: '02',
                title: 'AI Verification & Risk Triage',
                desc: 'Real-time telemetry runs anomaly risk scoring, matches grounded knowledge articles, and formulates verified guidance.',
                icon: <Bot className="w-5 h-5" />,
              },
              {
                step: '03',
                title: 'Seamless Resolution or Handoff',
                desc: 'Tickets route directly to specialized agents equipped with pre-drafted responses and automated thread summaries.',
                icon: <CheckCircle2 className="w-5 h-5" />,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="card-3d p-6 rounded-2xl relative"
              >
                <span className="text-5xl font-black text-[#DBE2EF] block mb-2 leading-none">
                  {s.step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#112D4E] text-[#F9F7F7] flex items-center justify-center mb-3 shadow-xs">
                  {s.icon}
                </div>
                <h3 className="font-extrabold text-sm text-[#112D4E]">{s.title}</h3>
                <p className="text-xs font-medium text-[#112D4E]/75 mt-1.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 dot-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DBE2EF] text-[#112D4E] text-xs font-extrabold mb-3">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Verified Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#112D4E] tracking-tight">
              Trusted by Operational Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="card-3d p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm font-medium text-[#112D4E]/85 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="mt-5 pt-4 border-t border-[#DBE2EF]">
                  <div className="font-black text-sm text-[#112D4E]">{t.name}</div>
                  <div className="text-xs font-semibold text-[#3F72AF]">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Navy CTA Banner with 3D Button ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#112D4E] via-[#1E4A7A] to-[#112D4E] text-[#F9F7F7] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#DBE2EF] border border-white/20 shadow-md">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F9F7F7] tracking-tight">
            Ready to upgrade your customer operations?
          </h2>
          <p className="mt-4 text-[#DBE2EF] text-sm sm:text-base max-w-xl mx-auto font-medium">
            Join enterprises using AI LifeDesk for sub-second intelligence, fraud defense, and effortless team collaboration.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register">
              <button className="btn-3d px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-xl active:translate-y-0.5">
                Get Started Free
                <ArrowRight className="inline-block w-4 h-4 ml-2" />
              </button>
            </Link>
            <Link href="/chat">
              <button className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/25 text-[#F9F7F7] font-bold text-sm hover:bg-white/20 transition-all active:translate-y-0.5">
                Launch Live Assistant
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-10 bg-white border-t border-[#DBE2EF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#112D4E] text-[#F9F7F7]">
                <Sparkles className="h-4 w-4 text-[#DBE2EF]" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#112D4E]">AI LifeDesk</div>
                <div className="text-[10px] text-[#3F72AF] font-bold leading-none">
                  One AI. Every Customer-Service Problem.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#112D4E]/80">
              <Link href="/chat" className="hover:text-[#3F72AF] transition-colors">
                AI Assistant
              </Link>
              <Link href="/tickets" className="hover:text-[#3F72AF] transition-colors">
                Tickets
              </Link>
              <Link href="/knowledge" className="hover:text-[#3F72AF] transition-colors">
                Knowledge Base
              </Link>
              <Link href="/login" className="hover:text-[#3F72AF] transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-[#3F72AF] transition-colors">
                Register
              </Link>
            </div>
            <div className="text-xs font-medium text-[#112D4E]/60 text-center">
              Brand Palette: Cream · Mist · Blue · Navy
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
