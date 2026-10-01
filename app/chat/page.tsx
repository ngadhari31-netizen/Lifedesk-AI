'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertTriangle,
  Ticket,
  CheckCircle,
  Globe,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  ticketId?: string;
  ticketNumber?: string;
  fraudAlert?: boolean;
}

const SAMPLE_STARTERS = [
  'My payment was deducted but order was cancelled. Help!',
  'I want to track my order status.',
  'I need a refund for a damaged product.',
  'My account was charged twice this month.',
  'How do I reset my password?',
  'मेरा ऑर्डर कब आएगा? (When will my order arrive?)',
];

export default function ChatPage() {
  const { user, loading, language, setLanguage } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      const langGreetings: Record<string, string> = {
        en: `Hello ${user.name.split(' ')[0]}! I'm your AI support assistant. How can I help you today?`,
        hi: `नमस्ते ${user.name.split(' ')[0]}! मैं आपका AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
        mr: `नमस्कार ${user.name.split(' ')[0]}! मी तुमचा AI सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?`,
      };
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: langGreetings[language] || langGreetings.en,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user, language, messages.length]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || sending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          language,
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: Date.now().toString() + '_ai',
        role: 'assistant',
        content:
          data.response?.message ||
          data.response ||
          'I apologize, I encountered an issue. Please try again.',
        timestamp: new Date(),
        ticketId: data.ticketId,
        ticketNumber: data.ticketNumber,
        fraudAlert:
          data.riskAssessment?.riskLevel === 'HIGH' ||
          data.riskAssessment?.riskLevel === 'CRITICAL',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          content: 'I encountered a connection error. Please try again in a moment.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F7]">
        <div className="w-8 h-8 border-3 border-[#3F72AF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F7] text-[#112D4E]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden max-w-6xl mx-auto w-full">
          {/* Chat Header */}
          <div className="border-b border-[#DBE2EF] bg-white/90 backdrop-blur-md px-6 py-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F72AF] to-[#112D4E] flex items-center justify-center shadow-md border-t border-white/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-black text-[#112D4E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#3F72AF]" />
                    AI Support Assistant
                  </h1>
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-ping" />
                    Online • Gemini Engine Grounded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#DBE2EF]/50 rounded-xl border border-[#DBE2EF]">
                <Globe className="w-3.5 h-3.5 text-[#3F72AF] ml-1.5" />
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'mr', label: 'मराठी' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      const langGreetings: Record<string, string> = {
                        en: `Switched language to English. How can I help you today?`,
                        hi: `भाषा हिंदी में बदली गई। मैं आज आपकी क्या सहायता कर सकता हूँ?`,
                        mr: `भाषा मराठीत बदलली आहे. आज मी तुम्हाला कशी मदत करू शकतो?`,
                      };
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          role: 'assistant',
                          content: langGreetings[l.code] || langGreetings.en,
                          timestamp: new Date(),
                        },
                      ]);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      language === l.code
                        ? 'btn-3d text-white shadow-xs'
                        : 'text-[#112D4E]/80 hover:text-[#112D4E] hover:bg-white/60'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 dot-pattern">
            {/* Quick Starters */}
            {messages.length <= 1 && (
              <div className="pb-3">
                <p className="text-xs font-bold text-[#112D4E]/70 mb-2.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#3F72AF]" />
                  Quick prompts:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="px-3.5 py-2 rounded-xl bg-white/90 border border-[#DBE2EF] text-xs font-semibold text-[#112D4E] hover:border-[#3F72AF] hover:text-[#3F72AF] shadow-xs active:translate-y-0.5 transition-all text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3F72AF] to-[#112D4E] flex items-center justify-center shrink-0 mt-0.5 text-white shadow-xs">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } flex flex-col gap-1.5`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'btn-3d text-white font-medium rounded-tr-xs'
                        : 'glass-card text-[#112D4E] rounded-tl-xs font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Ticket created indicator */}
                  {msg.ticketNumber && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium shadow-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Ticket <strong className="font-mono">{msg.ticketNumber}</strong> registered
                      </span>
                      <Link
                        href={`/tickets/${msg.ticketId}`}
                        className="underline font-bold text-emerald-900 hover:text-emerald-700 ml-1"
                      >
                        Track Ticket →
                      </Link>
                    </div>
                  )}

                  {/* Fraud alert indicator */}
                  {msg.fraudAlert && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium shadow-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Telemetry Alert: Flagged for supervisor risk assessment</span>
                    </div>
                  )}

                  <span className="text-[10px] font-medium text-[#112D4E]/50 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#DBE2EF] border border-[#3F72AF]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#112D4E] shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3F72AF] to-[#112D4E] flex items-center justify-center shrink-0 text-white">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass-card rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-[#3F72AF] text-sm font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-[#3F72AF]" />
                    <span>AI reasoning and grounding answers...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[#DBE2EF] bg-white/95 backdrop-blur-md p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-3 items-end"
            >
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Describe your issue... (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl border border-[#DBE2EF] bg-[#F9F7F7] text-sm text-[#112D4E] placeholder:text-[#3F72AF]/50 focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 focus:border-[#3F72AF] focus:bg-white resize-none max-h-32 overflow-y-auto transition-all"
                  style={{ height: 'auto' }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="btn-3d p-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-md active:translate-y-0.5"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
            <p className="text-[11px] font-medium text-[#112D4E]/60 mt-2 text-center">
              AI answers are grounded in enterprise documentation. Complex queries are escalated seamlessly.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
