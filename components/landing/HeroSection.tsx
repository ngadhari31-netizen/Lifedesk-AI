'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DraggableCard } from './DraggableCard';
import {
  RefundCard, FraudCard, BillCard, TicketCardLanding,
  AIResponseCard, DocumentCard, SupportCard,
} from './CardContents';
import { LifeDeskCore } from './LifeDeskCore';
import { DetailPanel, type CardType } from './DetailPanel';
import { RotateCcw } from 'lucide-react';

interface CardDef {
  id: CardType & string;
  component: React.ReactNode;
  x: number;        // % from left
  y: number;        // % from top
  rotation: number;
  width: number;
  floatDuration?: number;
  floatDelay?: number;
  floatDistance?: number;
}

const CARDS: CardDef[] = [
  { id: 'refund',      component: <RefundCard />,          x: 18,  y: 3,   rotation: -4,  width: 250, floatDuration: 4.8, floatDelay: 0,   floatDistance: 6 },
  { id: 'fraud',       component: <FraudCard />,           x: 68,  y: 3,   rotation: 5,   width: 255, floatDuration: 5.6, floatDelay: 0.8, floatDistance: 7 },
  { id: 'bill',        component: <BillCard />,            x: 4,   y: 40,  rotation: -5,  width: 245, floatDuration: 5.2, floatDelay: 1.5, floatDistance: 5 },
  { id: 'ticket',      component: <TicketCardLanding />,   x: 72,  y: 38,  rotation: 5,   width: 250, floatDuration: 6.0, floatDelay: 0.4, floatDistance: 8 },
  { id: 'ai-response', component: <AIResponseCard />,      x: 8,   y: 74,  rotation: 3,   width: 255, floatDuration: 4.5, floatDelay: 1.8, floatDistance: 6 },
  { id: 'document',    component: <DocumentCard />,        x: 68,  y: 72,  rotation: -4,  width: 245, floatDuration: 5.8, floatDelay: 1.0, floatDistance: 7 },
  { id: 'support',     component: <SupportCard />,         x: 38,  y: 84,  rotation: 2,   width: 235, floatDuration: 6.4, floatDelay: 2.2, floatDistance: 5 },
];

// Mobile positions (tighter layout)
const MOBILE_CARDS: Omit<CardDef, 'component'>[] = [
  { id: 'refund',      x: 4,   y: 4,   rotation: -3,  width: 260 },
  { id: 'fraud',       x: 12,  y: 18,  rotation: 4,   width: 260 },
  { id: 'bill',        x: 6,   y: 34,  rotation: -4,  width: 250 },
  { id: 'ticket',      x: 14,  y: 50,  rotation: 5,   width: 255 },
  { id: 'ai-response', x: 6,   y: 66,  rotation: 3,   width: 255 },
  { id: 'document',    x: 10,  y: 80,  rotation: -3,  width: 250 },
  { id: 'support',     x: 16,  y: 94,  rotation: 3,   width: 240 },
];

export function HeroSection() {
  const [zIndices, setZIndices] = useState<Record<string, number>>(
    Object.fromEntries(CARDS.map((c, i) => [c.id, i + 1]))
  );
  const [maxZ, setMaxZ] = useState(15);
  const [activePanel, setActivePanel] = useState<CardType>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [containerBounds, setContainerBounds] = useState({ width: 680, height: 620 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({
          width: Math.max(rect.width || 0, 340),
          height: Math.max(rect.height || 0, 600),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setMaxZ((prev) => {
      const next = Math.max(prev, 15) + 1;
      setZIndices((z) => ({ ...z, [id]: next }));
      return next;
    });
  }, []);

  const handleCardClick = useCallback((id: string) => {
    setActivePanel(id as CardType);
  }, []);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setZIndices(Object.fromEntries(CARDS.map((c, i) => [c.id, i + 1])));
    setMaxZ(15);
  }, []);

  const positions = isMobile ? MOBILE_CARDS : CARDS;

  return (
    <>
      <section className="relative min-h-screen overflow-hidden" style={{ background: '#060812' }}>
        {/* ─── Background layers ─── */}
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)',
          }}
        />

        {/* Ambient lights */}
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[50%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(163,230,53,0.02) 0%, transparent 70%)' }} />

        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-20">
          <div className="grid lg:grid-cols-[1fr_1.45fr] gap-8 lg:gap-12 items-center min-h-[calc(100vh-160px)]">

            {/* ─── Left: Editorial headline ─── */}
            <div className="space-y-7 pt-4 lg:pt-8 max-w-lg lg:pr-6 relative z-20">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-indigo-400/70">
                  Your personal customer-service desk
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-white">
                Customer service,
                <br />
                without the{' '}
                <span
                  className="italic font-normal"
                  style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                >
                  waiting.
                </span>
              </h1>

              {/* Sub */}
              <p className="text-base sm:text-lg text-white/45 leading-relaxed max-w-md">
                Bills, refunds, suspicious messages, support tickets — bring the problem to LifeDesk and get a clear next step.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  Try LifeDesk
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white/70 transition-colors bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                >
                  Explore how it works ↓
                </a>
              </div>

              {/* Annotation */}
              <div className="flex items-center gap-2 pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[11px] text-white/25">Available 24/7</span>
              </div>

              {/* Human annotation */}
              <p
                className="text-[13px] text-white/15 italic mt-4 select-none"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
              >
                "you don't need to figure this out alone"
              </p>
            </div>

            {/* ─── Right: Card universe ─── */}
            <div className={`relative ${isMobile ? 'min-h-[940px]' : 'min-h-[700px]'}`} ref={containerRef}>
              {/* Central AI panel — floating prominently */}
              <div className="hidden md:flex justify-center items-center min-h-[660px]">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-full max-w-[390px] drop-shadow-2xl"
                >
                  <LifeDeskCore />
                  {/* Floating ambient drop shadow */}
                  <motion.div
                    animate={{ scale: [1, 0.93, 1], opacity: [0.35, 0.2, 0.35] }}
                    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-[#3F72AF]/25 blur-xl rounded-full pointer-events-none"
                  />
                </motion.div>
              </div>

              {/* Mobile: show LifeDeskCore inline */}
              <div className="md:hidden mb-8">
                <LifeDeskCore />
              </div>

              {/* Draggable cards scattered around */}
              <div
                key={resetKey}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="relative w-full h-full pointer-events-auto">
                  {CARDS.map((card, i) => {
                    const pos = positions.find((p) => p.id === card.id) || card;
                    const cardW = isMobile ? Math.min(pos.width, containerBounds.width - 24) : pos.width;
                    const initX = isMobile
                      ? Math.max(12, Math.min(containerBounds.width - cardW - 12, (pos.x / 100) * (containerBounds.width - cardW)))
                      : Math.max(24, Math.min(containerBounds.width - cardW - 12, (pos.x / 100) * (containerBounds.width - cardW)));
                    const initY = isMobile
                      ? 360 + (pos.y / 100) * 520
                      : (pos.y / 100) * Math.max(containerBounds.height - 180, 460);

                    return (
                      <DraggableCard
                        key={`${card.id}-${resetKey}`}
                        id={card.id}
                        initialX={initX}
                        initialY={initY}
                        initialRotation={pos.rotation}
                        width={cardW}
                        zIndex={zIndices[card.id] || i + 1}
                        floatDuration={card.floatDuration}
                        floatDelay={card.floatDelay}
                        floatDistance={card.floatDistance}
                        onBringToFront={() => bringToFront(card.id)}
                        onClick={() => handleCardClick(card.id)}
                      >
                        {card.component}
                      </DraggableCard>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="absolute bottom-8 right-8 z-50">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-white/25 hover:text-white/50 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
              aria-label="Reset card positions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset cards
            </button>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060812] to-transparent pointer-events-none z-20" />
      </section>

      {/* Detail panel */}
      <DetailPanel card={activePanel} onClose={() => setActivePanel(null)} />
    </>
  );
}
