/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Sparkles, ChevronRight, ChevronLeft, Trash2, Heart } from 'lucide-react';

interface CanvasPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  angle: number;
  spin: number;
}

const PARTICLE_COLORS = [
  '#f3a3b2', // pastel rose
  '#b3c0f7', // pastel lavender
  '#e5c384', // gold soft
  '#ffe4e6', // light rose
  '#ffffff', // absolute white sparkle
  '#d1fae5', // pastel mint
];

export const CanvasPage: React.FC<CanvasPageProps> = ({ onNext, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const particlesRef = useRef<StardustParticle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Trigger custom stardust particles at coordinates
  const addParticles = (x: number, y: number, count = 2) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.2, // slight upward float
        size: Math.random() * 7 + 4,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01, // slow beautiful fade
        angle: Math.random() * Math.PI,
        spin: Math.random() * 0.04 - 0.02,
      });
    }
  };

  // Setup canvas size & handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial pre-seeded floating greeting drawing on the canvas: A heart and "HBD"
    const seedGreeting = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;
      const centerX = w / 2;
      const centerY = h / 2 - 10;

      // Draw a heart path with particles
      for (let t = 0; t < Math.PI * 2; t += 0.08) {
        // Heart parametric equations
        const r = 5.5; // Scale factor
        const x = centerX + 16 * Math.pow(Math.sin(t), 3) * r;
        const y = centerY - (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) * r;
        
        // Add particle with slight delay
        setTimeout(() => {
          addParticles(x, y, 1);
        }, t * 150);
      }
    };

    // Tiny timeout to ensure container is fully laid out
    const timeout = setTimeout(seedGreeting, 400);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // Frame update logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background glow matching the design
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.angle += p.spin;

        // Gravity/Air resistance physics simulation
        p.vy += 0.005; // very gentle downward drag
        p.vx *= 0.98;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Draw stardust star shape or round orb
        ctx.fillStyle = p.color;
        
        // Add gorgeous glow effects
        ctx.shadowBlur = p.size * 1.5;
        ctx.shadowColor = p.color;

        if (p.size > 7) {
          // 4-point star for premium sparkles
          ctx.beginPath();
          const r = p.size;
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.closePath();
          ctx.fill();
        } else {
          // Delicate circular sparklet
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    addParticles(e.clientX - rect.left, e.clientY - rect.top, 5);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    addParticles(e.clientX - rect.left, e.clientY - rect.top, 3);
  };

  const handleMouseUpOrLeave = () => {
    setIsDrawing(false);
  };

  // Touch support for gorgeous painting on mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || e.touches.length === 0) return;
    const touch = e.touches[0];
    addParticles(touch.clientX - rect.left, touch.clientY - rect.top, 5);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || e.touches.length === 0) return;
    const touch = e.touches[0];
    addParticles(touch.clientX - rect.left, touch.clientY - rect.top, 3);
  };

  const clearCanvas = () => {
    particlesRef.current = [];
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[58vh] sm:min-h-[72vh] text-center py-4 sm:py-6 px-2 sm:px-4 md:px-8 w-full max-w-xl mx-auto overflow-hidden relative select-none">
      
      {/* Top Header & Floating Emblem */}
      <div className="flex flex-col items-center">
        {/* Sparkle emblem with expanding pulse rings */}
        <div className="relative mb-3">
          <motion.div
            animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-pastel-rose/25 filter blur-md"
          />
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            className="relative p-2.5 rounded-full bg-pastel-gold-light/50 border border-pastel-gold/40 z-10 shadow-sm"
          >
            <Sparkles size={20} className="text-gold-accent" />
          </motion.div>
        </div>

        {/* Heading */}
        <h2 className="responsive-title text-pastel-rose-deep font-bold tracking-wide mb-1.5 text-glow">
          The Stardust Canvas
        </h2>

        <p className="font-sans text-[10px] md:text-xs text-pastel-rose-deep/60 tracking-[0.2em] uppercase font-bold mb-4 sm:mb-6">
          Chapter III • Paint with Infinite Starlight
        </p>
      </div>

      {/* Interactive Drawing Stage */}
      <div 
        ref={containerRef}
        className="w-full max-w-md h-48 sm:h-64 md:h-72 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-pastel-rose/30 flex flex-col items-center justify-center mb-5 bg-white/25 backdrop-blur-md relative overflow-hidden shadow-inner shadow-pastel-rose-deep/[0.02]"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Clear Button overlays nicely in the top right of the canvas */}
        <div className="absolute top-4 right-4 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearCanvas}
            className="p-2 rounded-full bg-white/60 hover:bg-white/80 border border-white/50 text-pastel-rose-deep transition-all shadow-xs cursor-pointer focus:outline-none"
            title="Clear Canvas"
            aria-label="Clear Canvas"
          >
            <Trash2 size={13} />
          </motion.button>
        </div>

        {/* Instructive overlay that fades out once drawing begins or after timeout */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-center bg-white/70 backdrop-blur-xs py-1.5 px-3.5 rounded-full border border-white/50 shadow-xs">
          <span className="text-[10px] font-sans text-pastel-rose-deep/75 font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Heart size={10} className="fill-pastel-rose text-pastel-rose animate-pulse" />
            <span>Trace to sketch stardust dreams</span>
          </span>
        </div>
      </div>

      {/* Route Control Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center z-10 w-full max-w-sm mt-3">
        <Button variant="outline" size="md" onClick={onBack} className="gap-1.5 w-full sm:flex-1">
          <ChevronLeft size={16} />
          <span>Back</span>
        </Button>
        <Button variant="primary" size="md" onClick={onNext} className="gap-1.5 w-full sm:flex-1">
          <span>Celebrate Elena</span>
          <ChevronRight size={16} />
        </Button>
      </div>

    </div>
  );
};

