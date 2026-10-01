'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, type PanInfo } from 'framer-motion';

interface DraggableCardProps {
  children: React.ReactNode;
  initialX: number;
  initialY: number;
  initialRotation: number;
  width?: number;
  className?: string;
  onClick?: () => void;
  onBringToFront?: () => void;
  zIndex?: number;
  id: string;
  floatDuration?: number;
  floatDelay?: number;
  floatDistance?: number;
}

export function DraggableCard({
  children,
  initialX,
  initialY,
  initialRotation,
  width = 320,
  className = '',
  onClick,
  onBringToFront,
  zIndex = 1,
  id,
  floatDuration = 5.2,
  floatDelay = 0,
  floatDistance = 6,
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const wasDragged = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring-based rotation that tilts slightly based on drag velocity
  const rotateZ = useMotionValue(initialRotation);
  const springRotate = useSpring(rotateZ, { stiffness: 200, damping: 30 });

  // Scale up slightly while dragging
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 300, damping: 25 });

  const handleDragStart = useCallback(
    (_: any, info: PanInfo) => {
      setIsDragging(true);
      wasDragged.current = false;
      dragStartPos.current = { x: info.point.x, y: info.point.y };
      scale.set(1.05);
      onBringToFront?.();
    },
    [onBringToFront, scale]
  );

  const handleDrag = useCallback(
    (_: any, info: PanInfo) => {
      const dist = Math.sqrt(
        Math.pow(info.point.x - dragStartPos.current.x, 2) +
          Math.pow(info.point.y - dragStartPos.current.y, 2)
      );
      if (dist > 5) wasDragged.current = true;

      // Tilt rotation based on horizontal velocity
      const velocityTilt = info.velocity.x * 0.02;
      rotateZ.set(initialRotation + Math.max(-8, Math.min(8, velocityTilt)));
    },
    [initialRotation, rotateZ]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    scale.set(1);
    rotateZ.set(initialRotation);
  }, [initialRotation, rotateZ, scale]);

  const handleClick = useCallback(() => {
    if (!wasDragged.current) {
      onBringToFront?.();
      onClick?.();
    }
  }, [onClick, onBringToFront]);

  return (
    <motion.div
      data-card-id={id}
      className={`absolute touch-none select-none ${className}`}
      style={{
        left: initialX,
        top: initialY,
        width,
        x,
        y,
        rotateZ: springRotate,
        scale: springScale,
        zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileTap={{ cursor: 'grabbing' }}
      role="button"
      tabIndex={0}
      aria-label="Draggable card"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Glow behind card when dragging or hovering */}
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, transparent 70%)',
          opacity: isDragging ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Floating Card body with organic bobbing and hover elevation */}
      <motion.div
        animate={
          isDragging
            ? { y: 0, rotate: 0 }
            : {
                y: [-floatDistance, floatDistance, -floatDistance],
                rotate: [-1.4, 1.4, -1.4],
              }
        }
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatDelay,
        }}
        whileHover={
          isDragging
            ? undefined
            : {
                y: -10,
                scale: 1.025,
                transition: { duration: 0.25, ease: 'easeOut' },
              }
        }
        className="relative rounded-2xl overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: isDragging
            ? '0 36px 90px -12px rgba(0,0,0,0.7), 0 10px 28px -4px rgba(0,0,0,0.5), 0 0 45px rgba(99,102,241,0.22)'
            : '0 16px 44px -8px rgba(0,0,0,0.48), 0 6px 16px -2px rgba(0,0,0,0.32), 0 0 28px rgba(99,102,241,0.07)',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
