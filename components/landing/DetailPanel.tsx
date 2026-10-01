'use client';

import React from 'react';
import { X, Shield, AlertTriangle, CheckCircle, FileText, Ticket, Sparkles, ArrowUpRight, Clock, TrendingUp, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type CardType = 'refund' | 'fraud' | 'bill' | 'ticket' | 'ai-response' | 'document' | 'support' | null;

interface DetailPanelProps {
  card: CardType;
  onClose: () => void;
}

const panelContent: Record<string, {
  label: string;
  color: string;
  accent: string;
  badgeBg: string;
  icon: React.ReactNode;
  body: React.ReactNode;
}> = {
  refund: {
    label: 'Refund Request',
    color: 'text-[#3D5939]',
    accent: '#EAF2E8',
    badgeBg: '#C8DEC3',
    icon: <ArrowUpRight className="w-5 h-5 text-[#4E6D48]" />,
    body: (
      <div className="space-y-4">
        <p className="text-sm text-[#4D6151] leading-relaxed">
          Your refund for order <span className="font-mono font-bold text-[#1E2B20]">#ORD-9281</span> has been processed and is awaiting merchant release.
        </p>
        <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E3DAC9] space-y-2.5">
          <div className="flex justify-between text-xs"><span className="text-[#6B7D6D]">Amount</span><span className="font-bold text-[#1E2B20]">₹1,299</span></div>
          <div className="flex justify-between text-xs"><span className="text-[#6B7D6D]">Status</span><span className="font-semibold text-[#9A7318]">Merchant Pending</span></div>
          <div className="flex justify-between text-xs"><span className="text-[#6B7D6D]">Expected by</span><span className="text-[#1E2B20] font-medium">3-5 business days</span></div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">Track refund</button>
          <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#DDD5C7] text-[#2D4233] hover:bg-[#F3EDE2] transition-colors">Contact support</button>
        </div>
      </div>
    ),
  },
  fraud: {
    label: 'Fraud Analysis',
    color: 'text-[#B24539]',
    accent: '#FDF0EE',
    badgeBg: '#F6CECA',
    icon: <Shield className="w-5 h-5 text-[#B24539]" />,
    body: (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FDF0EE] border border-[#F6CECA]">
          <AlertTriangle className="w-4 h-4 text-[#B24539] shrink-0" />
          <span className="text-xs font-semibold text-[#B24539]">Potential phishing pattern detected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7D6D]">Risk level:</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-[#FBE8E5] text-[#B24539] border border-[#F6CECA]">HIGH</span>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#4D6151] uppercase tracking-wider">Why:</span>
          <ul className="space-y-2">
            {['Urgency manipulation tactics', 'Suspicious non-bank payment request link', 'Unrecognized sender domain', 'Header spoofing anomaly'].map((r) => (
              <li key={r} className="flex items-start gap-2 text-xs text-[#5C6E5E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B24539] mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#B24539] text-white hover:bg-[#993A30] shadow-xs transition-colors">Block sender</button>
          <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#DDD5C7] text-[#2D4233] hover:bg-[#F3EDE2] transition-colors">Audit trail</button>
        </div>
      </div>
    ),
  },
  bill: {
    label: 'Bill Breakdown',
    color: 'text-[#4E6D48]',
    accent: '#EAF2E8',
    badgeBg: '#C8DEC3',
    icon: <TrendingUp className="w-5 h-5 text-[#4E6D48]" />,
    body: (
      <div className="space-y-4">
        <p className="text-sm text-[#4D6151] leading-relaxed">Your electricity bill for October increased significantly compared to previous periods:</p>
        <div className="space-y-2">
          {[
            { item: 'Base connection fee', amount: '₹1,200', change: null },
            { item: 'Consumption (482 kWh)', amount: '₹2,890', change: '+41%' },
            { item: 'Regulatory surcharge & GST', amount: '₹730', change: '+12%' },
          ].map((row) => (
            <div key={row.item} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F5EFE6] border border-[#E3DAC9] text-xs">
              <span className="text-[#5C6E5E]">{row.item}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E2B20]">{row.amount}</span>
                {row.change && <span className="text-[#9A7318] font-bold">{row.change}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-3.5 py-2.5 rounded-xl border border-[#C8DEC3] bg-[#EAF2E8] text-sm">
          <span className="font-semibold text-[#3D5939]">Total Due</span>
          <span className="font-black text-[#1E2B20]">₹4,820</span>
        </div>
        <button className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">
          Compare with prior bills
        </button>
      </div>
    ),
  },
  ticket: {
    label: 'Ticket Status',
    color: 'text-[#4E6D48]',
    accent: '#EAF2E8',
    badgeBg: '#C8DEC3',
    icon: <Ticket className="w-5 h-5 text-[#4E6D48]" />,
    body: (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold text-[#2D4233]">#LD-2841</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FDF6E2] text-[#826116] border border-[#F2DE9C]">Awaiting Response</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#F5EFE6] border border-[#E3DAC9] space-y-2">
          <div className="flex justify-between text-xs"><span className="text-[#6B7D6D]">Created</span><span className="text-[#1E2B20] font-medium">Today, 2:14 PM</span></div>
          <div className="flex justify-between text-xs"><span className="text-[#6B7D6D]">Response SLA</span><span className="text-[#1E2B20] font-medium">~2 hours</span></div>
          <div className="flex justify-between text-xs"><span className="text-[#6B7D6D]">Assigned Tier</span><span className="font-semibold text-[#4E6D48]">Billing Specialist</span></div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#EAE3D6] overflow-hidden">
          <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#688661] to-[#8FA888]" />
        </div>
        <p className="text-[11px] text-[#6B7D6D] text-center">AI will immediately push an alert when an update is posted.</p>
        <button className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">View ticket timeline</button>
      </div>
    ),
  },
  'ai-response': {
    label: 'AI-Drafted Response',
    color: 'text-[#4E6D48]',
    accent: '#EAF2E8',
    badgeBg: '#C8DEC3',
    icon: <Sparkles className="w-5 h-5 text-[#4E6D48]" />,
    body: (
      <div className="space-y-4">
        <p className="text-xs text-[#6B7D6D] uppercase tracking-wider font-bold">Your raw notes:</p>
        <p className="text-xs text-[#5C6E5E] italic leading-relaxed p-3 rounded-xl bg-[#F5EFE6] border border-[#E3DAC9]">
          "I've been charged twice for the same subscription and need my money back ASAP."
        </p>
        <p className="text-xs text-[#4E6D48] uppercase tracking-wider font-bold">AI Polished Draft:</p>
        <p className="text-xs text-[#1E2B20] leading-relaxed p-3 rounded-xl bg-[#F4F8F2] border border-[#D5E5D1] font-medium">
          "I am writing to request a resolution regarding a duplicate transaction on my account. I was debited twice for the same subscription cycle. Kindly reverse the second charge at your earliest convenience. Thank you."
        </p>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">Copy draft</button>
          <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#DDD5C7] text-[#2D4233] hover:bg-[#F3EDE2] transition-colors">Send to agent</button>
        </div>
      </div>
    ),
  },
  document: {
    label: 'Document Telemetry',
    color: 'text-[#4E6D48]',
    accent: '#EAF2E8',
    badgeBg: '#C8DEC3',
    icon: <FileText className="w-5 h-5 text-[#4E6D48]" />,
    body: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5EFE6] border border-[#E3DAC9]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2E8] border border-[#C8DEC3] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#4E6D48]" />
          </div>
          <div><div className="text-xs font-bold text-[#1E2B20]">invoice_oct.pdf</div><div className="text-[10px] text-[#7A6E5D]">24 KB · Verified OCR</div></div>
        </div>
        <p className="text-xs text-[#4E6D48] uppercase tracking-wider font-bold">Key Observations:</p>
        <ul className="space-y-2">
          {['Late payment fee of ₹150 applied without grace period', 'Optional insurance pack auto-renewed', 'Arithmetic verification matched tax schedule'].map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-[#4D6151] p-2.5 rounded-xl bg-[#F5EFE6]">
              <CheckCircle className="w-3.5 h-3.5 text-[#5A8754] mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <button className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">Generate dispute ticket</button>
      </div>
    ),
  },
  support: {
    label: '24/7 AI Desk',
    color: 'text-[#4E6D48]',
    accent: '#EAF2E8',
    badgeBg: '#C8DEC3',
    icon: <Headphones className="w-5 h-5 text-[#4E6D48]" />,
    body: (
      <div className="space-y-4">
        <p className="text-sm text-[#4D6151] leading-relaxed">Continuous conversational assistance grounded in your institutional knowledge base.</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Avg Latency', value: '<450ms' },
            { label: 'Languages', value: 'EN · HI · MR' },
            { label: 'Uptime SLA', value: '99.98%' },
            { label: 'Human Handoff', value: 'Instant' },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-[#F5EFE6] border border-[#E3DAC9] text-center">
              <div className="text-sm font-bold text-[#1E2B20]">{s.value}</div>
              <div className="text-[10px] text-[#6B7D6D] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <button className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">Open live assistant</button>
      </div>
    ),
  },
};

export function DetailPanel({ card, onClose }: DetailPanelProps) {
  if (!card) return null;
  const content = panelContent[card];
  if (!content) return null;

  return (
    <AnimatePresence>
      {card && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-[#1E2B20]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div
              className="min-h-full p-6 space-y-5"
              style={{
                background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EFE6 100%)',
                borderLeft: '1px solid #E3DAC9',
                boxShadow: '-16px 0 60px rgba(45, 66, 51, 0.12)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#C8DEC3]"
                    style={{ background: content.accent }}
                  >
                    {content.icon}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${content.color}`}>{content.label}</div>
                    <div className="text-[10px] text-[#6B7D6D] mt-0.5">Real-time Telemetry</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] flex items-center justify-center text-[#5C6E5E] hover:text-[#1E2B20] hover:bg-[#F3EDE2] transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E3DAC9] to-transparent" />

              {/* Content */}
              {content.body}

              {/* Footer annotation */}
              <div className="pt-6 text-center">
                <p className="text-[10px] text-[#8C9B8E] italic">
                  "LifeDesk AI: Verified Support Telemetry"
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
