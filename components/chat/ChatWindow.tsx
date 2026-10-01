'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  User,
  Ticket,
  Headphones,
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'customer';
  content: string;
  timestamp: string;
  analysis?: any;
  riskAssessment?: any;
  suggestedActions?: string[];
  matchedArticles?: Array<{ id: string; title: string; category: string }>;
  createdTicket?: { id: string; ticketNumber: string };
  feedbackGiven?: 'helpful' | 'unhelpful';
}

export function ChatWindow() {
  const { user, language } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Welcome Message
  useEffect(() => {
    const welcomeText =
      language === 'hi'
        ? 'नमस्ते! मैं AI LifeDesk हूँ 👋\nमैं आपके सवालों और सहायता अनुरोधों में मदद करने के लिए 24/7 उपलब्ध हूँ।'
        : language === 'mr'
        ? 'नमस्कार! मी AI LifeDesk आहे 👋\nमी आपल्या समस्या आणि ग्राहक सेवेसाठी 24/7 उपलब्ध आहे.'
        : "Hi! I'm AI LifeDesk 👋\n\nI'm available 24/7 to help with your questions, track orders, or connect you with support specialists.";

    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'My payment was deducted but my order was cancelled.',
          'I was charged three times for the same order.',
          'Track my order',
          'I forgot my password',
          'Talk to a human',
          'माझ्या ऑर्डरचे पैसे कट झाले पण ऑर्डर मिळाली नाही.',
        ],
      },
    ]);
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'ai' ? 'assistant' : 'user',
          content: m.content,
        }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: data.response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          analysis: data.analysis,
          riskAssessment: data.riskAssessment,
          suggestedActions: data.response.suggested_actions,
          matchedArticles: data.matchedArticles,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content:
              'I am having trouble connecting to AI services right now. Would you like me to open a support ticket for an agent to assist you?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: ['Create Support Ticket', 'Talk to a human'],
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: 'Network connection issue. Please check your internet connection or create a support ticket directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: ['Create Support Ticket'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createTicketFromConversation = async (aiMsg: ChatMessage) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Find the last customer message for subject
      const lastCust = [...messages].reverse().find((m) => m.sender === 'customer');
      const subject = lastCust ? lastCust.content.slice(0, 80) : 'Customer Support Request';
      const description = `Customer Inquiry:\n${lastCust?.content || ''}\n\nAI Assessment:\n${aiMsg.content}`;

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          description,
          priority: aiMsg.analysis?.priority ? aiMsg.analysis.priority.toUpperCase() : 'HIGH',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  createdTicket: {
                    id: data.ticket.id,
                    ticketNumber: data.ticket.ticketNumber,
                  },
                }
              : m
          )
        );
      }
    } catch (e) {
      console.error('Failed to create ticket from chat:', e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles className="h-5 w-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base">AI LifeDesk 24/7 Support</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
            <p className="text-xs text-indigo-100">
              Instant responses, smart triage & seamless human escalation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="purple" size="sm" className="bg-white/15 text-white border-white/20">
            Gemini Flash Core
          </Badge>
          <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
            Risk Screening ON
          </Badge>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'customer' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-sm ${
                msg.sender === 'ai'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {msg.sender === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%]">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.sender === 'customer'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.content}

                {/* AI Structured Triage & Fraud Risk Badges */}
                {msg.analysis && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-400">AI Triage:</span>
                    <Badge variant="default" size="sm">
                      {msg.analysis.category}
                    </Badge>
                    <Badge
                      variant={
                        msg.analysis.priority === 'urgent'
                          ? 'danger'
                          : msg.analysis.priority === 'high'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {msg.analysis.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {msg.analysis.sentiment}
                    </Badge>
                  </div>
                )}

                {/* Potentially Suspicious Activity Screening Alert */}
                {msg.riskAssessment && msg.riskAssessment.risk_level !== 'low' && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Potentially suspicious transaction pattern detected</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 mt-1">
                      {msg.riskAssessment.explanation}
                    </p>
                    <div className="text-[11px] font-medium text-amber-700 dark:text-amber-400 mt-1.5">
                      Recommended: {msg.riskAssessment.recommended_action}
                    </div>
                  </div>
                )}

                {/* Ticket Created Success Box */}
                {msg.createdTicket && (
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Ticket #{msg.createdTicket.ticketNumber} Created</span>
                      </div>
                      <Badge variant="success" size="sm">
                        Assigned
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      Your request has been routed to our support team with all conversation context and AI analysis.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2.5 bg-white dark:bg-slate-900 text-xs"
                      onClick={() => router.push(`/tickets/${msg.createdTicket!.id}`)}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Ticket Timeline
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons for AI message */}
              {msg.sender === 'ai' && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                  <span className="text-[11px]">{msg.timestamp}</span>

                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="p-1 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[11px]"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setMessages((prev) =>
                        prev.map((m) => (m.id === msg.id ? { ...m, feedbackGiven: 'helpful' } : m))
                      )
                    }
                    className={`p-1 flex items-center gap-1 text-[11px] ${
                      msg.feedbackGiven === 'helpful' ? 'text-emerald-600 font-bold' : 'hover:text-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful</span>
                  </button>

                  <button
                    onClick={() =>
                      setMessages((prev) =>
                        prev.map((m) => (m.id === msg.id ? { ...m, feedbackGiven: 'unhelpful' } : m))
                      )
                    }
                    className={`p-1 flex items-center gap-1 text-[11px] ${
                      msg.feedbackGiven === 'unhelpful' ? 'text-rose-600 font-bold' : 'hover:text-slate-600'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>

                  {/* Create Ticket or Escalation CTAs */}
                  {!msg.createdTicket && msg.id !== 'welcome' && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => createTicketFromConversation(msg)}
                        icon={<Ticket className="w-3.5 h-3.5 text-indigo-600" />}
                      >
                        Create Support Ticket
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => createTicketFromConversation(msg)}
                        icon={<Headphones className="w-3.5 h-3.5 text-purple-600" />}
                      >
                        Talk to Human
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested prompt chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading typing indicator */}
        {loading && (
          <div className="flex gap-3 max-w-3xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm shadow-sm flex items-center gap-2 text-slate-500">
              <span className="font-medium text-xs">AI LifeDesk is thinking...</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Voice & Submit */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Speak (Voice Input)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to speech...'
                : language === 'hi'
                ? 'अपनी समस्या बताएं (उदा. पैसे कट गए)...'
                : language === 'mr'
                ? 'आपली समस्या लिहा (उदा. पैसे कापले गेले)...'
                : 'Describe your problem (e.g., My payment was deducted but order was cancelled)...'
            }
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={loading}
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            size="md"
            icon={<Send className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Supported: English, Hindi (हिंदी), Marathi (मराठी)</span>
          <span>Voice speech input with fallback</span>
        </div>
      </div>
    </div>
  );
}
