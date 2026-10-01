'use client';

import React from 'react';
import {
  Shield, FileText, Ticket, Clock, AlertTriangle,
  ArrowUpRight, CheckCircle, TrendingUp, Headphones, Sparkles,
} from 'lucide-react';

/* ─── Shared Pastel Glass Surface (Cream & Warm Beige) ─── */
const glass = {
  background: 'linear-gradient(145deg, rgba(255, 253, 249, 0.96) 0%, rgba(247, 243, 235, 0.96) 100%)',
  border: '1px solid rgba(215, 202, 186, 0.75)',
  boxShadow: '0 12px 32px rgba(45, 66, 51, 0.08), 0 2px 6px rgba(45, 66, 51, 0.03)',
};

/* ─── Card 1: REFUND ─── */
export function RefundCard() {
  return (
    <div className="p-5 space-y-3" style={glass}>
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4E6D48]">
          Refund
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF2E8] border border-[#C8DEC3] text-[#3D5939]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5A8754] animate-pulse" />
          Action available
        </span>
      </div>

      {/* Body */}
      <p className="text-[14px] leading-snug text-[#1E2B20] font-semibold">
        Your refund request is ready.
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <div className="text-xl font-black text-[#1E2B20] tabular-nums tracking-tight">₹1,299</div>
          <div className="text-[10px] text-[#6B7D6D] font-medium mt-0.5">Refund pending confirmation</div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-[#EAF2E8] border border-[#C8DEC3] flex items-center justify-center text-[#4E6D48] shadow-xs">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

/* ─── Card 2: FRAUD CHECK ─── */
export function FraudCard() {
  return (
    <div className="p-5 space-y-3" style={{
      ...glass,
      borderColor: 'rgba(235, 180, 172, 0.75)',
      background: 'linear-gradient(145deg, rgba(255, 250, 248, 0.96) 0%, rgba(253, 242, 239, 0.96) 100%)',
    }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B24539]">
          Fraud Check
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF0EE] border border-[#F6CECA] text-[#B24539]">
          <AlertTriangle className="w-3 h-3 text-[#B24539]" />
          Risk detected
        </span>
      </div>

      <p className="text-[14px] leading-snug text-[#1E2B20] font-semibold">
        This message contains suspicious payment language.
      </p>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A635F]">Risk Level</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-[#FBE8E5] text-[#B24539] border border-[#F6CECA]">
            HIGH
          </span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-[#FDF0EE] border border-[#F6CECA] flex items-center justify-center text-[#B24539] shadow-xs">
          <Shield className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

/* ─── Card 3: BILL ANALYSIS ─── */
export function BillCard() {
  return (
    <div className="p-5 space-y-3" style={glass}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#536E4D]">
          Bill Analysis
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF2E8] border border-[#C8DEC3] text-[#3D5939]">
          <CheckCircle className="w-3 h-3 text-[#5A8754]" />
          Analyzed
        </span>
      </div>

      <p className="text-[14px] leading-snug text-[#1E2B20] font-semibold">
        Your electricity bill increased 38% compared with last month.
      </p>

      <div className="flex items-end justify-between pt-1">
        <div>
          <div className="text-xl font-black text-[#1E2B20] tabular-nums tracking-tight">₹4,820</div>
          <div className="text-[10px] text-[#6B7D6D] font-medium mt-0.5">Previous: ₹3,490</div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FAF1D6] border border-[#F2DE9C]">
          <TrendingUp className="w-3.5 h-3.5 text-[#9A7318]" />
          <span className="text-xs font-bold text-[#9A7318]">↑ 38%</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Card 4: SUPPORT TICKET ─── */
export function TicketCardLanding() {
  return (
    <div className="p-5 space-y-3" style={glass}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#536E4D]">
          Support Ticket
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDF6E2] border border-[#F2DE9C] text-[#826116]">
          <Clock className="w-3 h-3 text-[#9A7318]" />
          Waiting for reply
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#5A8754]" />
          <span className="text-sm font-mono font-bold text-[#2D4233]">#LD-2841</span>
        </div>
        <p className="text-[13px] text-[#5C6E5E] leading-relaxed">
          Company response expected within <span className="text-[#1E2B20] font-semibold">2 hours</span>.
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-[#EAE3D6] overflow-hidden">
        <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#688661] to-[#8FA888]" />
      </div>
    </div>
  );
}

/* ─── Card 5: AI RESPONSE ─── */
export function AIResponseCard() {
  return (
    <div className="p-5 space-y-3" style={{
      ...glass,
      background: 'linear-gradient(145deg, rgba(248, 252, 246, 0.96) 0%, rgba(242, 248, 240, 0.96) 100%)',
      borderColor: 'rgba(181, 206, 177, 0.75)',
    }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4E6D48]">
          AI Response
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E2F0E0] border border-[#C8DEC3] text-[#3D5939]">
          <Sparkles className="w-3 h-3 text-[#5A8754]" />
          Ready
        </span>
      </div>

      <p className="text-[14px] leading-snug text-[#1E2B20] font-semibold">
        Your complaint has been rewritten into a clear, professional message.
      </p>

      <button className="w-full mt-1 px-4 py-2 rounded-xl text-xs font-semibold bg-[#536E4D] hover:bg-[#435B3E] text-white shadow-xs transition-all active:translate-y-0.5">
        Review response
      </button>
    </div>
  );
}

/* ─── Card 6: DOCUMENT ─── */
export function DocumentCard() {
  return (
    <div className="p-5 space-y-3" style={glass}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#536E4D]">
          Document
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF2E8] border border-[#C8DEC3] text-[#3D5939]">
          <CheckCircle className="w-3 h-3 text-[#5A8754]" />
          Analyzed
        </span>
      </div>

      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#F5EFE6] border border-[#E3DAC9]">
        <div className="w-8 h-8 rounded-lg bg-[#EAF2E8] border border-[#C8DEC3] flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#4E6D48]" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#1E2B20] truncate">invoice_oct.pdf</div>
          <div className="text-[10px] text-[#7A6E5D] mt-0.5">24 KB · PDF</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#6B7D6D] font-medium">AI found:</span>
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF2E8] text-[#3D5939] border border-[#C8DEC3]">
          3 important charges
        </span>
      </div>
    </div>
  );
}

/* ─── Card 7: 24/7 SUPPORT ─── */
export function SupportCard() {
  return (
    <div className="p-5 space-y-3" style={{
      ...glass,
      background: 'linear-gradient(145deg, rgba(250, 253, 249, 0.96) 0%, rgba(244, 250, 242, 0.96) 100%)',
      borderColor: 'rgba(181, 206, 177, 0.75)',
    }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4E6D48]">
          24/7 Support
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF2E8] border border-[#C8DEC3] text-[#3D5939]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5A8754] animate-pulse" />
          AI Online
        </span>
      </div>

      <p className="text-[14px] leading-snug text-[#1E2B20] font-semibold">
        Someone is always here to help.
      </p>

      <div className="flex items-end justify-between pt-1">
        <div className="text-3xl font-black text-[#1E2B20] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          24<span className="text-[#8FA888]">/</span>7
        </div>
        <div className="w-8 h-8 rounded-xl bg-[#EAF2E8] border border-[#C8DEC3] flex items-center justify-center text-[#4E6D48] shadow-xs">
          <Headphones className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
