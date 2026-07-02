/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { Sparkles, Heart } from 'lucide-react';

interface WelcomePageProps {
  onNext: () => void;
}

interface AmbientParticle {
  id: string;
  x: number;
  y: number;
  scale: number;
  delay: number;
  duration: number;
  type: 'heart' | 'star' | 'orb';
}

interface BalloonConfig {
  id: string;
  x: number; // left offset percentage
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface CloudConfig {
  id: string;
  y: number; // top offset percentage
  scale: number;
  duration: number;
  delay: number;
  direction: 1 | -1;
}

interface ConfettiConfig {
  id: string;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const BALLOON_COLORS = [
  'rgba(243, 163, 178, 0.75)', // pastel rose
  'rgba(179, 192, 247, 0.7)',  // pastel lavender
  'rgba(209, 250, 229, 0.75)', // pastel mint
  'rgba(254, 243, 199, 0.8)',  // pastel yellow
  'rgba(255, 228, 230, 0.75)'  // pastel rose light
];

const CONFETTI_COLORS = [
  '#f3a3b2', // rose
  '#b3c0f7', // lavender
  '#d1fae5', // mint
  '#e5c384', // gold
  '#fca5b3', // light pink
  '#FFF'     // classic white sparkle
];

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNext }) => {
  const [particles, setParticles] = useState<AmbientParticle[]>([]);
  const [balloons, setBalloons] = useState<BalloonConfig[]>([]);
  const [clouds, setClouds] = useState<CloudConfig[]>([]);
  const [confetti, setConfetti] = useState<ConfettiConfig[]>([]);
  const catControls = useAnimation();

  // Initialize atmospheric particles, slow-moving clouds, and background balloons
  useEffect(() => {
    // 1. Generate delicate ambient background particles (reduced by 50% on mobile for performance)
    const isMobile = window.innerWidth < 768;
    const generatedParticles: AmbientParticle[] = [];
    
    // Twinkling stars & hearts & orbs
    const heartCount = isMobile ? 5 : 10;
    const starCount = isMobile ? 6 : 12;
    const orbCount = isMobile ? 3 : 6;
    
    for (let i = 0; i < heartCount; i++) {
      generatedParticles.push({
        id: `ambient-heart-${i}`,
        x: Math.random() * 85 + 7,
        y: Math.random() * 70 + 15,
        scale: Math.random() * 0.4 + 0.6,
        delay: Math.random() * 2,
        duration: Math.random() * 5 + 4,
        type: 'heart',
      });
    }

    for (let i = 0; i < starCount; i++) {
      generatedParticles.push({
        id: `ambient-star-${i}`,
        x: Math.random() * 92 + 4,
        y: Math.random() * 80 + 10,
        scale: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 2,
        type: 'star',
      });
    }

    for (let i = 0; i < orbCount; i++) {
      generatedParticles.push({
        id: `ambient-orb-${i}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        scale: Math.random() * 0.8 + 0.6,
        delay: Math.random() * 4,
        duration: Math.random() * 7 + 5,
        type: 'orb',
      });
    }
    setParticles(generatedParticles);

    // 2. Generate premium floating balloons rising continuously (fewer on mobile)
    const balloonCount = isMobile ? 2 : 5;
    const initialBalloons: BalloonConfig[] = Array.from({ length: balloonCount }).map((_, i) => ({
      id: `balloon-init-${i}-${Date.now()}`,
      x: 10 + i * (isMobile ? 40 : 20) + (Math.random() * 10 - 5), // distribute across horizontal axis
      size: Math.random() * 15 + 24, // optimized size
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      duration: Math.random() * 14 + 18, // slow rise
      delay: Math.random() * 4,
    }));
    setBalloons(initialBalloons);

    // 3. Generate background clouds (fewer on mobile)
    const initialClouds: CloudConfig[] = isMobile 
      ? [{ id: 'cloud-1', y: 15, scale: 0.8, duration: 90, delay: 0, direction: 1 }]
      : [
          { id: 'cloud-1', y: 12, scale: 0.9, duration: 80, delay: 0, direction: 1 },
          { id: 'cloud-2', y: 35, scale: 0.7, duration: 110, delay: -40, direction: -1 },
          { id: 'cloud-3', y: 22, scale: 1.1, duration: 95, delay: -20, direction: 1 },
        ];
    setClouds(initialClouds);
  }, []);

  // Periodic Confetti Trigger Engine - triggers a delicate shower every 6 seconds
  useEffect(() => {
    const triggerConfettiShower = () => {
      const burstId = Date.now();
      const newConfetti: ConfettiConfig[] = Array.from({ length: 18 }).map((_, i) => ({
        id: `confetti-${burstId}-${i}`,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 6 + 6,
        delay: Math.random() * 1.5,
        duration: Math.random() * 3.5 + 4,
        drift: Math.random() * 80 - 40,
      }));

      setConfetti((prev) => [...prev, ...newConfetti]);

      // Auto-clean up confetti to maintain high 60 FPS performance
      setTimeout(() => {
        setConfetti((prev) => prev.filter((c) => !c.id.startsWith(`confetti-${burstId}-`)));
      }, 7000);
    };

    // Trigger instantly once and then periodically
    const initialTimeout = setTimeout(() => {
      triggerConfettiShower();
    }, 500);

    const interval = setInterval(() => {
      triggerConfettiShower();
    }, 6000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Continuous Balloon Replenishment cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const active = prev.filter((b) => b.delay + b.duration > 30); // keep only non-expired or active ones
        if (active.length < 5) {
          const newBalloon: BalloonConfig = {
            id: `balloon-spawn-${Date.now()}-${Math.random()}`,
            x: Math.random() * 80 + 10,
            size: Math.random() * 15 + 28,
            color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
            duration: Math.random() * 14 + 18,
            delay: 0,
          };
          return [...active, newBalloon];
        }
        return active;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[58vh] sm:min-h-[72vh] flex flex-col items-center justify-between text-center py-4 sm:py-6 px-2 sm:px-4 md:px-8 overflow-hidden select-none">
      
      {/* ================= BACKGROUND EFFECTS & GRADIENT LAYERS ================= */}
      
      {/* 1. Animated Radial Shifting Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 bg-gradient-to-tr from-pastel-rose-light/25 via-white/10 to-pastel-lavender/25 opacity-90"
        />
        
        {/* Subtle Floating Backdrop Blur Blobs */}
        <motion.div
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-[15%] left-[10%] w-[160px] h-[160px] md:w-[260px] md:h-[260px] rounded-full bg-pastel-rose/15 filter blur-[60px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 25, 0],
            y: [0, 15, -25, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          className="absolute bottom-[20%] right-[10%] w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full bg-pastel-lavender-deep/12 filter blur-[70px]"
        />
      </div>

      {/* 2. Slow Moving Fluffy Clouds Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            initial={{ 
              x: cloud.direction === 1 ? '-20%' : '120%', 
              y: `${cloud.y}%`, 
              opacity: 0 
            }}
            animate={{ 
              x: cloud.direction === 1 ? '120%' : '-20%',
              opacity: [0, 0.35, 0.35, 0]
            }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              delay: cloud.delay,
              ease: 'linear',
              times: [0, 0.15, 0.85, 1]
            }}
            className="absolute"
            style={{ transform: `scale(${cloud.scale})` }}
          >
            {/* Elegant Vector Cloud SVG */}
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M30 45 C15 45 5 35 5 22 C5 10 18 5 32 8 C38 2 52 0 65 5 C80 2 95 12 95 28 C105 28 115 35 115 45 C115 55 102 58 90 58 L30 58 Z" 
                fill="url(#cloudGrad)" 
                fillOpacity="0.75" 
              />
              <defs>
                <linearGradient id="cloudGrad" x1="60" y1="0" x2="60" y2="58" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF" />
                  <stop offset="100%" stopColor="#F9F5FF" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 3. Floating Pastel Balloons Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.div
              key={b.id}
              initial={{ 
                x: `${b.x}%`, 
                y: '110%', 
                opacity: 0, 
                rotate: Math.random() * 15 - 7.5 
              }}
              animate={{ 
                y: '-20%', 
                opacity: [0, 0.85, 0.85, 0],
                x: [`${b.x}%`, `${b.x + (Math.random() * 12 - 6)}%`, `${b.x}%`],
                rotate: [Math.random() * 15 - 7.5, Math.random() * -15 + 7.5, Math.random() * 15 - 7.5]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: b.duration, 
                delay: b.delay,
                ease: 'easeInOut' 
              }}
              className="absolute flex flex-col items-center"
              style={{ width: b.size }}
            >
              {/* Balloon Body */}
              <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <defs>
                  <radialGradient id={`balloon-glow-${b.id}`} cx="35%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#FFF" stopOpacity="0.95" />
                    <stop offset="50%" stopColor={b.color} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={b.color} />
                  </radialGradient>
                  <filter id="balloon-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#f3a3b2" floodOpacity="0.15" />
                  </filter>
                </defs>
                {/* Balloon shape */}
                <path 
                  d="M20 2 C9 2 2 10 2 21 C2 33 11 44 20 44 C29 44 38 33 38 21 C38 10 31 2 20 2 Z" 
                  fill={`url(#balloon-glow-${b.id})`}
                  filter="url(#balloon-shadow)"
                />
                {/* Tie knot */}
                <path d="M17 44 L23 44 L20 48 Z" fill={b.color} />
              </svg>
              {/* String */}
              <svg width="2" height="35" viewBox="0 0 2 35" fill="none" className="opacity-40">
                <path d="M1 0 C-1 10, 3 20, 1 35" stroke="#C3B3D3" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. Twinkling Ambient Particles (Hearts & Stars) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => {
          if (p.type === 'heart') {
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0, y: `${p.y + 10}%`, x: `${p.x}%` }}
                animate={{
                  opacity: [0, 0.65, 0.65, 0],
                  scale: [0, p.scale, p.scale, 0],
                  y: [`${p.y + 10}%`, `${p.y - 10}%`],
                  x: [`${p.x}%`, `${p.x + (Math.random() * 8 - 4)}%`],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute text-pastel-rose-deep/20"
              >
                <Heart size={16 * p.scale} className="fill-pastel-rose/15" />
              </motion.div>
            );
          } else if (p.type === 'star') {
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0, x: `${p.x}%`, y: `${p.y}%` }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0, p.scale, 0],
                  rotate: [0, 120],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute text-gold-accent/35"
              >
                <Sparkles size={14 * p.scale} />
              </motion.div>
            );
          } else {
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.5, x: `${p.x}%`, y: `${p.y}%` }}
                animate={{
                  opacity: [0, 0.35, 0.35, 0],
                  scale: [0.5, p.scale * 1.2, p.scale * 0.7, 0.5],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'linear',
                }}
                className="absolute w-3.5 h-3.5 rounded-full bg-pastel-lavender/30 filter blur-[1px]"
              />
            );
          }
        })}
      </div>

      {/* 5. Falling Confetti Shower Layer */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ 
              x: `${c.x}%`, 
              y: '-5%', 
              opacity: 0, 
              rotate: 0,
              scale: 0.5
            }}
            animate={{ 
              y: '105%', 
              opacity: [0, 1, 1, 0],
              x: `${c.x + c.drift / 5}%`,
              rotate: [0, 360 + Math.random() * 360],
              scale: [0.5, 1, 1, 0.4]
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: 'easeOut',
              times: [0, 0.1, 0.9, 1]
            }}
            className="absolute rounded-xs"
            style={{ 
              width: c.size, 
              height: c.size * 0.8, 
              backgroundColor: c.color,
              borderRadius: c.size % 2 === 0 ? '50%' : '2px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          />
        ))}
      </div>

      {/* ================= MAIN CONTENT CONTAINER ================= */}

      {/* 6. Centered Elegant Title Wrapped in Premium Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 mt-1 px-4 py-3.5 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl glass-panel shadow-md border border-white/60 w-full max-w-sm sm:max-w-md mx-auto"
      >
        <span className="font-sans text-[10px] sm:text-xs text-pastel-rose-deep/60 tracking-[0.3em] uppercase font-bold mb-1.5 block">
          Joyous Celebration
        </span>
        <h1 className="responsive-title text-pastel-rose-deep font-bold tracking-wide text-glow flex items-center justify-center gap-1.5 sm:gap-2">
          <span>🎉</span>
          <span className="bg-gradient-to-r from-pastel-rose-deep via-[#D86F86] to-gold-deep bg-clip-text text-transparent">
            Happy Birthday
          </span>
          <span>🎉</span>
        </h1>
      </motion.div>

      {/* 7. Cute Vector Animated Cat Illustration */}
      <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 my-4 md:my-6 z-10 flex items-center justify-center">
        <motion.div
          animate={catControls}
          whileHover={{ scale: 1.05 }}
          className="w-full h-full"
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_8px_20px_rgba(243,163,178,0.18)]"
          >
            {/* Shadows */}
            <ellipse cx="100" cy="180" rx="60" ry="10" fill="#f3a3b2" fillOpacity="0.25" />

            {/* Cat Tail */}
            <motion.path
              d="M135 150 C155 140, 165 110, 155 90 C150 80, 140 85, 143 95 C148 105, 142 125, 128 135 Z"
              fill="#EFE9F5"
              stroke="#D4C9E3"
              strokeWidth="2"
              animate={{ rotate: [-5, 15, -5] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ transformOrigin: '130px 145px' }}
            />

            {/* Cat Body */}
            <path
              d="M60 170 C60 120, 140 120, 140 170 C140 180, 60 180, 60 170 Z"
              fill="#F9F6FC"
              stroke="#E8DFE2"
              strokeWidth="3"
            />
            
            {/* Cute Cat Feet */}
            <circle cx="75" cy="175" r="10" fill="#FFF" stroke="#E8DFE2" strokeWidth="2" />
            <circle cx="125" cy="175" r="10" fill="#FFF" stroke="#E8DFE2" strokeWidth="2" />

            {/* Left Ear */}
            <path
              d="M50 75 L35 30 C33 25, 45 32, 58 42 Z"
              fill="#F9F6FC"
              stroke="#E2D4E0"
              strokeWidth="2"
            />
            <path d="M47 70 L38 38 C37 35, 44 40, 52 47 Z" fill="#FCA5B3" fillOpacity="0.6" />

            {/* Right Ear */}
            <path
              d="M150 75 L165 30 C167 25, 155 32, 142 42 Z"
              fill="#F9F6FC"
              stroke="#E2D4E0"
              strokeWidth="2"
            />
            <path d="M153 70 L162 38 C163 35, 156 40, 148 47 Z" fill="#FCA5B3" fillOpacity="0.6" />

            {/* Head */}
            <circle cx="100" cy="85" r="50" fill="#FFF" stroke="#E2D2E4" strokeWidth="3" />

            {/* Occasional Blinking Eyes */}
            <g>
              {/* Left Eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0, 1, 1, 0, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.48, 0.5, 0.52, 0.85, 0.88, 0.9, 1] }}
                style={{ transformOrigin: '75px 82px' }}
              >
                <circle cx="75" cy="82" r="7" fill="#423E4C" />
                <circle cx="73" cy="79" r="2.5" fill="#FFF" />
                <circle cx="77" cy="84" r="1" fill="#FFF" />
              </motion.g>

              {/* Right Eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0, 1, 1, 0, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.48, 0.5, 0.52, 0.85, 0.88, 0.9, 1] }}
                style={{ transformOrigin: '125px 82px' }}
              >
                <circle cx="125" cy="82" r="7" fill="#423E4C" />
                <circle cx="123" cy="79" r="2.5" fill="#FFF" />
                <circle cx="127" cy="84" r="1" fill="#FFF" />
              </motion.g>
            </g>

            {/* Cute Rosy Cheeks */}
            <circle cx="62" cy="94" r="7" fill="#FFAEC9" fillOpacity="0.5" />
            <circle cx="138" cy="94" r="7" fill="#FFAEC9" fillOpacity="0.5" />

            {/* Cute Nose and Mouth */}
            <path d="M97 90 L103 90 L100 93 Z" fill="#FCA5B3" />
            <path
              d="M94 98 Q97 101, 100 98 Q103 101, 106 98"
              stroke="#423E4C"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Soft Whiskers */}
            <line x1="45" y1="92" x2="25" y2="90" stroke="#C5BCC8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="43" y1="98" x2="22" y2="99" stroke="#C5BCC8" strokeWidth="1.5" strokeLinecap="round" />
            
            <line x1="155" y1="92" x2="175" y2="90" stroke="#C5BCC8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="157" y1="98" x2="178" y2="99" stroke="#C5BCC8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Cute collar and gold bell */}
            <path d="M72 124 Q100 135, 128 124" stroke="#D47A8F" strokeWidth="5" strokeLinecap="round" />
            <motion.circle
              cx="100"
              cy="133"
              r="7"
              fill="#E5C384"
              stroke="#D4AF37"
              strokeWidth="1.5"
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '100px 126px' }}
            />

            {/* Adorable animated waving paw */}
            <motion.g
              animate={{ rotate: [0, -25, 5, -25, 5, 0, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: 'easeInOut',
                times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
              }}
              style={{ transformOrigin: '128px 145px' }}
            >
              {/* Arm/Paw */}
              <path
                d="M125 140 C132 120, 150 115, 150 130 C150 140, 134 152, 125 152 Z"
                fill="#FFF"
                stroke="#E2D2E4"
                strokeWidth="2"
              />
              {/* Paw pad detail */}
              <circle cx="142" cy="130" r="4" fill="#FFAEC9" fillOpacity="0.75" />
              <circle cx="136" cy="125" r="2.5" fill="#FFAEC9" fillOpacity="0.6" />
              <circle cx="145" cy="123" r="2.5" fill="#FFAEC9" fillOpacity="0.6" />
              <circle cx="147" cy="135" r="2.5" fill="#FFAEC9" fillOpacity="0.6" />
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* 8. Glowing Button with Hover Scale & Ripple Transition */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="z-10 w-full flex justify-center mb-1"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className="gap-2.5 px-9 py-4 font-serif text-base tracking-wider rounded-full shadow-[0_0_22px_rgba(243,163,178,0.45)] hover:shadow-[0_0_32px_rgba(243,163,178,0.7)] transition-all duration-300 border-2 border-white/40"
        >
          <span>🎁</span>
          <span>Open Your Surprise</span>
          <Sparkles size={16} className="animate-pulse text-yellow-200" />
        </Button>
      </motion.div>
    </div>
  );
};
