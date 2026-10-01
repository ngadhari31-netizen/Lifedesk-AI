'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

const MOCK_RESPONSES: Record<string, string> = {
  default: "I can help you with that. Let me analyze the situation and find the best path forward.\n\nCould you share any relevant documents — a bill, screenshot, or email? That will help me give you specific advice.",
  broadband: "I can help you investigate that.\n\nYour bill may have changed because of:\n• Higher usage than your plan allows\n• A promotional period ending\n• Additional services or equipment charges\n\nWould you like to upload the bill so I can identify the exact cause?",
  refund: "I'll look into your refund right away.\n\nHere's what I'll check:\n• Original transaction details\n• Merchant refund policy\n• Expected timeline\n\nCan you share the order number or receipt?",
  fraud: "I'll analyze that message for you.\n\nCommon signs of fraud include:\n• Urgency or threats\n• Requests for personal information\n• Unusual sender addresses\n• Suspicious links or attachments\n\nPaste the message and I'll run a full risk assessment.",
  charge: "I can review those charges.\n\nI'll compare your bill line-by-line with:\n• Your subscribed plan\n• Previous billing periods\n• Any promotional rates\n\nUpload the bill or share the details and I'll break it down.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('broadband') || lower.includes('internet') || lower.includes('wifi') || lower.includes('bill doubled'))
    return MOCK_RESPONSES.broadband;
  if (lower.includes('refund') || lower.includes('return') || lower.includes('money back'))
    return MOCK_RESPONSES.refund;
  if (lower.includes('fraud') || lower.includes('scam') || lower.includes('suspicious') || lower.includes('phishing'))
    return MOCK_RESPONSES.fraud;
  if (lower.includes('charge') || lower.includes('bill') || lower.includes('invoice') || lower.includes('payment'))
    return MOCK_RESPONSES.charge;
  return MOCK_RESPONSES.default;
}

export function LifeDeskCore() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isThinking) return;
    setIsThinking(true);
    setShowResponse(false);
    setResponse('');

    // Simulate AI thinking delay
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 600));

    const reply = getAIResponse(input);
    setResponse(reply);
    setIsThinking(false);
    setShowResponse(true);
  }, [input, isThinking]);

  const handleReset = useCallback(() => {
    setInput('');
    setResponse('');
    setShowResponse(false);
    setIsThinking(false);
    inputRef.current?.focus();
  }, []);

  const examplePrompt = "My internet provider charged me twice.";

  return (
    <div
      className="relative w-full max-w-[390px] mx-auto rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFFFFF 0%, #FAF8F5 55%, #F4EFE6 100%)',
        border: '1px solid rgba(215, 202, 186, 0.85)',
        boxShadow: '0 24px 60px -12px rgba(45, 66, 51, 0.12), 0 0 35px rgba(143, 168, 136, 0.14)',
      }}
    >
      {/* Ambient top glow in pastel sage */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(143, 168, 136, 0.22) 0%, transparent 70%)',
        }}
      />

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5A8754]" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#4E6D48]">
              LifeDesk AI
            </span>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF2E8] border border-[#C8DEC3] text-[#3D5939]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5A8754] animate-pulse" />
            Online
          </span>
        </div>

        {/* Main prompt */}
        <div>
          <h3
            className="text-xl font-semibold text-[#1E2B20] leading-tight"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: 'italic' }}
          >
            What happened?
          </h3>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Tell me what went wrong…"
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#FBF9F5] border border-[#DDD5C7] text-[#1E2B20] placeholder:text-[#8C9B8E] focus:outline-none focus:border-[#8FA888] focus:bg-white transition-all shadow-2xs"
            aria-label="Describe your problem"
          />
        </div>

        {/* Example prompt chip */}
        {!showResponse && !isThinking && (
          <button
            onClick={() => {
              setInput(examplePrompt);
              inputRef.current?.focus();
            }}
            className="text-[11px] text-[#6B7D6D] hover:text-[#3D5438] transition-colors text-left"
          >
            Try: <span className="text-[#3D5438] font-medium italic">"{examplePrompt}"</span>
          </button>
        )}

        {/* Submit button in rich sage */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isThinking}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:translate-y-0.5 text-white"
          style={{
            background: isThinking
              ? '#688661'
              : 'linear-gradient(135deg, #536E4D 0%, #3D5438 100%)',
          }}
        >
          {isThinking ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              AI is looking…
            </>
          ) : (
            <>
              Analyze
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* AI Response */}
        {showResponse && (
          <div className="space-y-3 animate-fade-in">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#DDD5C7] to-transparent" />
            <div className="space-y-2 p-3.5 rounded-xl bg-[#F4F8F2] border border-[#D5E5D1]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#4E6D48]">
                  AI Analysis
                </span>
                <button
                  onClick={handleReset}
                  className="text-[#6B7D6D] hover:text-[#1E2B20] transition-colors"
                  aria-label="Close response"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[13px] leading-relaxed text-[#1E2B20] whitespace-pre-line font-medium">
                {response}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#536E4D] text-white hover:bg-[#435B3E] shadow-xs transition-colors">
                Upload document
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#DDD5C7] text-[#2D4233] hover:bg-[#F3EDE2] transition-colors"
              >
                Ask another
              </button>
            </div>
          </div>
        )}

        {/* Footer tags */}
        {!showResponse && !isThinking && (
          <div className="text-[10px] text-[#7A6E5D] text-center">
            AI can help with:&nbsp;
            <span className="text-[#4E6D48] font-semibold">Refunds · Bills · Fraud · Tickets</span>
          </div>
        )}
      </div>
    </div>
  );
}
