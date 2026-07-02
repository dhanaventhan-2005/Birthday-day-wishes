/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { ChevronRight, ChevronLeft, Heart, Sparkles, Gift, X, Camera } from 'lucide-react';

interface JourneyPageProps {
  onNext: () => void;
  onBack: () => void;
}

// ==========================================
// EASY TO EDIT BIRTHDAY DETAILS (Sister ❤️)
// ==========================================
const BIRTHDAY_GIRL_NAME = "Elena Rose";
const BIRTHDAY_DATE = "July 12, 2026";

// ==========================================
// PHOTO GALLERY IMAGES (Add or change easily!)
// ==========================================
const GALLERY_IMAGES = [
  {
    id: "img-1",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    caption: "Magical Celebrations ✨",
    description: "Every single memory we share is brighter and warmer with you around."
  },
  {
    id: "img-2",
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800",
    caption: "Beautiful Blossoms 🌸",
    description: "Wishing you a year as colorful, radiant, and fragrant as spring flowers."
  },
  {
    id: "img-3",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    caption: "Endless Laughter & Giggles 🎉",
    description: "Cherishing all the late night talks, silly face-offs, and unconditional love."
  },
  {
    id: "img-4",
    url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&q=80&w=800",
    caption: "Sparkles of Happiness 💖",
    description: "May your path ahead always be paved with sparkling gold and high dreams."
  }
];

const PARAGRAPHS = [
  "To my wonderful sister, who fills every day with laughter and magic. You are my constant source of strength, my favorite confidant, and the brightest star in my sky.",
  "May this year bring you as much happiness, wonder, and stardust as you give to everyone around you. I am so incredibly blessed to have you in my life.",
  "Never forget how truly loved and cherished you are. Happy Birthday! ❤️"
];

// Particle types for local animation
interface LocalParticle {
  id: string;
  x: number;
  y: number;
  scale: number;
  delay: number;
  duration: number;
  drift: number;
  type: 'flower' | 'heart' | 'star' | 'balloon';
  color: string;
}

interface ParagraphSparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

// Celebration interfaces
interface CelebrationConfetti {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  drift: number;
  angle: number;
}

interface CelebrationBalloon {
  id: string;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

interface CelebrationHeart {
  id: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
}

interface CelebrationStar {
  id: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
}

interface FireworkParticle {
  angle: number;
  distance: number;
  color: string;
}

interface CelebrationFirework {
  id: string;
  x: number;
  y: number;
  delay: number;
  particles: FireworkParticle[];
}

const FIREWORK_COLORS = ['#f3a3b2', '#b3c0f7', '#d1fae5', '#e5c384', '#ff8da1', '#fcd34d'];

const BALLOON_COLORS = [
  'rgba(243, 163, 178, 0.7)',
  'rgba(179, 192, 247, 0.65)',
  'rgba(254, 243, 199, 0.75)'
];

export const JourneyPage: React.FC<JourneyPageProps> = ({ onNext, onBack }) => {
  const [localParticles, setLocalParticles] = useState<LocalParticle[]>([]);
  
  // Photo Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const handleNextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev !== null && prev < GALLERY_IMAGES.length - 1) ? prev + 1 : 0);
  };

  const handlePrevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev !== null && prev > 0) ? prev - 1 : GALLERY_IMAGES.length - 1);
  };

  // Typewriter state variables
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>(["", "", ""]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [paragraphSparkles, setParagraphSparkles] = useState<{ [key: number]: ParagraphSparkle[] }>({
    0: [],
    1: [],
    2: []
  });

  // Celebration States
  const [celebrationConfetti, setCelebrationConfetti] = useState<CelebrationConfetti[]>([]);
  const [celebrationBalloons, setCelebrationBalloons] = useState<CelebrationBalloon[]>([]);
  const [celebrationHearts, setCelebrationHearts] = useState<CelebrationHeart[]>([]);
  const [celebrationStars, setCelebrationStars] = useState<CelebrationStar[]>([]);
  const [celebrationFireworks, setCelebrationFireworks] = useState<CelebrationFirework[]>([]);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);

  const triggerGrandCelebration = () => {
    setIsCelebrating(true);

    // 1. CONFETTI BURST (Launched from corners and bottom center)
    const confettiColors = ['#f3a3b2', '#b3c0f7', '#d1fae5', '#e5c384', '#fca5b3', '#FFF'];
    const generatedConfetti: CelebrationConfetti[] = [];
    for (let i = 0; i < 60; i++) {
      const isLeft = i % 3 === 0;
      const isRight = i % 3 === 1;
      generatedConfetti.push({
        id: `cel-confetti-${i}-${Date.now()}`,
        x: isLeft ? 10 : (isRight ? 90 : 50),
        y: isLeft || isRight ? 80 : 95,
        color: confettiColors[i % confettiColors.length],
        size: Math.random() * 8 + 6,
        duration: Math.random() * 3 + 2.5,
        drift: Math.random() * 100 - 50,
        angle: isLeft ? -45 + Math.random() * 30 : (isRight ? -135 + Math.random() * 30 : -90 + Math.random() * 40),
      });
    }
    setCelebrationConfetti(generatedConfetti);

    // 2. BALLOONS RISING (12 balloons with staggered delays up to 4.5 seconds)
    const balloonColors = ['rgba(243, 163, 178, 0.85)', 'rgba(179, 192, 247, 0.8)', 'rgba(254, 243, 199, 0.9)', 'rgba(209, 250, 229, 0.85)', 'rgba(252, 165, 179, 0.85)'];
    const generatedBalloons: CelebrationBalloon[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `cel-balloon-${i}-${Date.now()}`,
      x: 10 + Math.random() * 80,
      color: balloonColors[i % balloonColors.length],
      size: Math.random() * 16 + 26,
      duration: Math.random() * 5 + 6,
      delay: Math.random() * 4.5,
    }));
    setCelebrationBalloons(generatedBalloons);

    // 3. FLOATING HEARTS (16 hearts)
    const generatedHearts: CelebrationHeart[] = Array.from({ length: 16 }).map((_, i) => ({
      id: `cel-heart-${i}-${Date.now()}`,
      x: 10 + Math.random() * 80,
      y: 90,
      scale: Math.random() * 0.5 + 0.6,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 5,
    }));
    setCelebrationHearts(generatedHearts);

    // 4. GLOWING STARS (15 stars)
    const generatedStars: CelebrationStar[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `cel-star-${i}-${Date.now()}`,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 55,
      scale: Math.random() * 0.6 + 0.6,
      duration: Math.random() * 2 + 1.5,
    }));
    setCelebrationStars(generatedStars);

    // 5. FIREWORKS (5 staggered positions)
    const generatedFireworks: CelebrationFirework[] = [];
    const positions = [
      { x: 25, y: 35 },
      { x: 75, y: 30 },
      { x: 50, y: 20 },
      { x: 30, y: 55 },
      { x: 70, y: 50 }
    ];

    positions.forEach((pos, idx) => {
      const fireworkColor = FIREWORK_COLORS[idx % FIREWORK_COLORS.length];
      const particles: FireworkParticle[] = Array.from({ length: 12 }).map((_, pIdx) => {
        const angle = (pIdx * 360) / 12;
        return {
          angle: angle,
          distance: Math.random() * 45 + 35,
          color: fireworkColor,
        };
      });

      generatedFireworks.push({
        id: `cel-firework-${idx}-${Date.now()}`,
        x: pos.x,
        y: pos.y,
        delay: idx * 1.2,
        particles,
      });
    });
    setCelebrationFireworks(generatedFireworks);

    // Reset celebration state after 8.5 seconds
    setTimeout(() => {
      setIsCelebrating(false);
      setCelebrationConfetti([]);
      setCelebrationBalloons([]);
      setCelebrationHearts([]);
      setCelebrationStars([]);
      setCelebrationFireworks([]);
    }, 8500);
  };

  // Typewriter engine character by character
  useEffect(() => {
    if (currentParagraphIndex >= PARAGRAPHS.length) {
      setIsFinished(true);
      triggerGrandCelebration();
      return;
    }

    const currentFullText = PARAGRAPHS[currentParagraphIndex];
    let charIndex = 0;

    const timer = setInterval(() => {
      if (charIndex < currentFullText.length) {
        setTypedParagraphs((prev) => {
          const updated = [...prev];
          updated[currentParagraphIndex] = currentFullText.substring(0, charIndex + 1);
          return updated;
        });
        charIndex++;
      } else {
        clearInterval(timer);

        // Trigger gorgeous sparkle burst around this completed paragraph
        triggerSparklesForParagraph(currentParagraphIndex);

        // Wait a short pause for reflection before typing the next paragraph
        setTimeout(() => {
          setCurrentParagraphIndex((prev) => prev + 1);
        }, 1100);
      }
    }, 38); // ~38ms per letter for smooth emotional reading rhythm

    return () => clearInterval(timer);
  }, [currentParagraphIndex]);

  const triggerSparklesForParagraph = (index: number) => {
    const burst: ParagraphSparkle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `sparkle-${index}-${i}-${Math.random()}`,
      x: Math.random() * 80 + 10, // random offset across paragraph container width
      y: Math.random() * 60 + 20, // random offset height
      size: Math.random() * 10 + 6,
      color: i % 2 === 0 ? '#e5c384' : '#f3a3b2',
    }));

    setParagraphSparkles((prev) => ({
      ...prev,
      [index]: burst
    }));

    // Auto-fade sparkles out
    setTimeout(() => {
      setParagraphSparkles((prev) => ({
        ...prev,
        [index]: []
      }));
    }, 2800);
  };

  // Seed ambient floating items (reduced by 50% on mobile for performance)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const list: LocalParticle[] = [];
    
    // Floating Flowers
    const flowerCount = isMobile ? 4 : 8;
    for (let i = 0; i < flowerCount; i++) {
      list.push({
        id: `flower-${i}-${Math.random()}`,
        x: Math.random() * 85 + 5,
        y: Math.random() * 50 + 40,
        scale: Math.random() * 0.4 + 0.6,
        delay: Math.random() * 3,
        duration: Math.random() * 6 + 6,
        drift: Math.random() * 40 - 20,
        type: 'flower',
        color: '#f3a3b2',
      });
    }

    // Floating Hearts
    const heartCount = isMobile ? 4 : 8;
    for (let i = 0; i < heartCount; i++) {
      list.push({
        id: `heart-${i}-${Math.random()}`,
        x: Math.random() * 85 + 5,
        y: Math.random() * 60 + 30,
        scale: Math.random() * 0.4 + 0.5,
        delay: Math.random() * 2,
        duration: Math.random() * 5 + 5,
        drift: Math.random() * 30 - 15,
        type: 'heart',
        color: '#fca5b3',
      });
    }

    // Floating balloons
    const balloonCount = isMobile ? 1 : 3;
    for (let i = 0; i < balloonCount; i++) {
      list.push({
        id: `balloon-local-${i}-${Math.random()}`,
        x: 15 + i * 30 + (Math.random() * 10 - 5),
        y: 80,
        scale: Math.random() * 0.3 + 0.7,
        delay: Math.random() * 4,
        duration: Math.random() * 10 + 10,
        drift: Math.random() * 40 - 20,
        type: 'balloon',
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      });
    }

    setLocalParticles(list);
  }, []);

  return (
    <div className="relative w-full min-h-[72vh] flex flex-col items-center justify-between text-center py-4 px-4 md:px-8 overflow-hidden select-none">
      
      {/* Celebration Layers */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Confetti */}
        {celebrationConfetti.map((c) => {
          const radian = (c.angle * Math.PI) / 180;
          const targetX = Math.cos(radian) * 150 + c.drift;
          const targetY = Math.sin(radian) * 220 - 150;

          return (
            <motion.div
              key={c.id}
              initial={{ x: `${c.x}%`, y: `${c.y}%`, opacity: 0, scale: 0.5 }}
              animate={{
                x: [`${c.x}%`, `calc(${c.x}% + ${targetX}px)`],
                y: [`${c.y}%`, `calc(${c.y}% + ${targetY}px)`],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.1, 1, 0.4],
                rotate: [0, 360 + Math.random() * 540]
              }}
              transition={{ duration: c.duration, ease: "easeOut" }}
              className="absolute pointer-events-none"
              style={{
                width: c.size,
                height: c.size * 0.7,
                backgroundColor: c.color,
                borderRadius: c.size % 2 === 0 ? '50%' : '2px',
              }}
            />
          );
        })}

        {/* Balloons */}
        {celebrationBalloons.map((b) => (
          <motion.div
            key={b.id}
            initial={{ x: `${b.x}%`, y: '110%', opacity: 0, rotate: Math.random() * 20 - 10 }}
            animate={{
              y: '-20%',
              opacity: [0, 0.9, 0.9, 0],
              x: [`${b.x}%`, `${b.x + (Math.random() * 16 - 8)}%`, `${b.x}%`],
              rotate: [Math.random() * 15 - 7.5, Math.random() * -15 + 7.5, Math.random() * 15 - 7.5]
            }}
            transition={{ duration: b.duration, delay: b.delay, ease: "easeInOut" }}
            className="absolute flex flex-col items-center"
            style={{ width: b.size }}
          >
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <defs>
                <radialGradient id={`cel-b-glow-${b.id}`} cx="35%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="0.95" />
                  <stop offset="50%" stopColor={b.color} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={b.color} />
                </radialGradient>
              </defs>
              <path
                d="M20 2 C9 2 2 10 2 21 C2 33 11 44 20 44 C29 44 38 33 38 21 C38 10 31 2 20 2 Z"
                fill={`url(#cel-b-glow-${b.id})`}
              />
              <path d="M17 44 L23 44 L20 48 Z" fill={b.color} />
            </svg>
            <div className="w-[1px] h-10 bg-pastel-rose/30" />
          </motion.div>
        ))}

        {/* Hearts */}
        {celebrationHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ x: `${h.x}%`, y: '105%', opacity: 0, scale: 0 }}
            animate={{
              y: '-10%',
              opacity: [0, 0.85, 0.85, 0],
              scale: [0, h.scale, h.scale, 0],
              x: [`${h.x}%`, `${h.x + (Math.random() * 20 - 10)}%`]
            }}
            transition={{ duration: h.duration, delay: h.delay, ease: "easeInOut" }}
            className="absolute text-[#ff8da1]/40"
          >
            <Heart size={18} className="fill-[#ff8da1]/25" />
          </motion.div>
        ))}

        {/* Stars */}
        {celebrationStars.map((s) => (
          <motion.div
            key={s.id}
            initial={{ x: `${s.x}%`, y: `${s.y}%`, opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0, s.scale, 0],
              rotate: [0, 180]
            }}
            transition={{ duration: s.duration, ease: "easeInOut" }}
            className="absolute text-gold-accent"
          >
            <Sparkles size={16} />
          </motion.div>
        ))}

        {/* Fireworks */}
        {celebrationFireworks.map((fw) => (
          <div
            key={fw.id}
            className="absolute"
            style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
          >
            {fw.particles.map((p, pIdx) => {
              const radian = (p.angle * Math.PI) / 180;
              const targetX = Math.cos(radian) * p.distance;
              const targetY = Math.sin(radian) * p.distance;

              return (
                <motion.div
                  key={pIdx}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{
                    x: [0, targetX],
                    y: [0, targetY],
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.2, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: fw.delay,
                    ease: "easeOut",
                  }}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* 1. Page-Specific Animated Floating Particles (Flowers, Hearts, Balloons, Sparkles) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {localParticles.map((p) => {
          if (p.type === 'flower') {
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: '100%', x: `${p.x}%`, rotate: 0 }}
                animate={{
                  opacity: [0, 0.7, 0.7, 0],
                  y: `${p.y - 30}%`,
                  x: [`${p.x}%`, `${p.x + p.drift / 2}%`],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute"
                style={{ width: 18 * p.scale, height: 18 * p.scale }}
              >
                {/* Custom Flower SVG */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
                  <path d="M12 2C11 5 8 5 8 8C5 8 5 11 2 12C5 13 5 16 8 16C8 19 11 19 12 22C13 19 16 19 16 16C19 16 19 13 22 12C19 11 19 8 16 8C16 5 13 2 12 2Z" fill="#FCA5B3" />
                  <circle cx="12" cy="12" r="3" fill="#E5C384" />
                </svg>
              </motion.div>
            );
          } else if (p.type === 'heart') {
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0, y: '95%', x: `${p.x}%` }}
                animate={{
                  opacity: [0, 0.75, 0.75, 0],
                  scale: [0, p.scale, p.scale, 0],
                  y: [`${p.y}%`, `${p.y - 25}%`],
                  x: [`${p.x}%`, `${p.x + p.drift / 3}%`],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute text-pastel-rose-deep/30"
              >
                <Heart size={14 * p.scale} className="fill-pastel-rose/20" />
              </motion.div>
            );
          } else {
            // Local balloon floating up slowly
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: '110%', x: `${p.x}%` }}
                animate={{
                  opacity: [0, 0.6, 0.6, 0],
                  y: '-10%',
                  x: [`${p.x}%`, `${p.x + p.drift}%`],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                className="absolute flex flex-col items-center"
                style={{ width: 22 * p.scale }}
              >
                <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <path d="M20 2 C9 2 2 10 2 21 C2 33 11 44 20 44 C29 44 38 33 38 21 C38 10 31 2 20 2 Z" fill={p.color} />
                  <path d="M17 44 L23 44 L20 48 Z" fill={p.color} />
                </svg>
                <div className="w-[1px] h-6 bg-pastel-rose/30" />
              </motion.div>
            );
          }
        })}
      </div>

      {/* 2. Top Header Title with Heart Beats */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 mt-1 w-full text-center"
      >
        <h2 className="responsive-title text-pastel-rose-deep font-bold tracking-wide flex items-center justify-center gap-1.5 text-glow">
          <span>Happy Birthday Sister</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="inline-block"
          >
            ❤️
          </motion.span>
        </h2>
      </motion.div>

      {/* 3. Easy-to-edit Metadata Board (Name & Date of Birth) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="z-10 grid grid-cols-2 gap-3 w-full max-w-sm my-4"
      >
        <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/60 shadow-xs flex flex-col items-center justify-center">
          <span className="text-[10px] font-sans font-semibold tracking-wider text-pastel-rose-deep/50 uppercase mb-0.5">
            Name
          </span>
          <span className="font-serif text-sm md:text-base font-bold text-pastel-rose-deep tracking-wide">
            {BIRTHDAY_GIRL_NAME}
          </span>
        </div>

        <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/60 shadow-xs flex flex-col items-center justify-center">
          <span className="text-[10px] font-sans font-semibold tracking-wider text-pastel-rose-deep/50 uppercase mb-0.5">
            Date of Birth
          </span>
          <span className="font-serif text-sm md:text-base font-bold text-pastel-rose-deep tracking-wide">
            {BIRTHDAY_DATE}
          </span>
        </div>
      </motion.div>

      {/* 4. Heartfelt Letter Card (Typewriter Animation & Completed Sparkles) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-md mx-auto p-5 md:p-6 rounded-3xl border border-white/80 relative"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 40px -10px rgba(243, 163, 178, 0.2), 0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Soft corner decorations */}
        <Sparkles size={14} className="absolute -top-1 -left-1 text-gold-accent animate-pulse" />
        <Sparkles size={14} className="absolute -bottom-1 -right-1 text-gold-accent animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative text-left flex flex-col gap-3 min-h-[160px] md:min-h-[180px]">
          {/* Subtle gold quote mark decor */}
          <span className="absolute -top-4 -left-2 font-serif text-4xl text-pastel-rose-deep/20 leading-none select-none">
            “
          </span>
          
          {/* Paragraphs rendered with typewriter effect */}
          {PARAGRAPHS.map((fullText, index) => {
            const currentTypedText = typedParagraphs[index];
            const isCompleted = currentTypedText.length === fullText.length;
            const sparkles = paragraphSparkles[index] || [];

            // Don't render paragraphs that haven't started typing yet
            if (index > currentParagraphIndex && currentTypedText === "") {
              return null;
            }

            return (
              <div key={index} className="relative py-1">
                <p 
                  className="font-serif tracking-wide indent-4 text-[17px] sm:text-[20px] leading-[1.8] sm:leading-[1.9]"
                  style={{
                    color: '#2F2F2F'
                  }}
                >
                  {currentTypedText}
                  {/* Flashing elegant cursor while typing */}
                  {index === currentParagraphIndex && !isFinished && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                      className="inline-block w-[1.5px] h-5 bg-[#E75480] ml-[2px] align-middle animate-pulse"
                    />
                  )}
                </p>

                {/* Sparkling particles appearing when a paragraph is completed */}
                <AnimatePresence>
                  {isCompleted && sparkles.map((sp) => (
                    <motion.div
                      key={sp.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                      className="absolute pointer-events-none"
                      style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                    >
                      <Sparkles size={sp.size} style={{ color: sp.color }} className="animate-spin-slow" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          })}

          <span className="absolute -bottom-10 -right-2 font-serif text-4xl text-pastel-rose-deep/20 leading-none select-none">
            ”
          </span>
        </div>
      </motion.div>

      {/* Photo Gallery Section (Fades in once the birthday message finishes typing) */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 w-full max-w-md mx-auto my-6 px-1"
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="font-serif text-xs md:text-sm font-bold text-pastel-rose-deep flex items-center gap-1.5">
                <Camera size={14} className="text-pastel-rose-deep/75 animate-pulse" />
                <span>Elena's Memory Book 🌸</span>
              </span>
              <span className="text-[9px] font-mono tracking-wider text-pastel-rose-deep/50 uppercase">
                {GALLERY_IMAGES.length} Memories
              </span>
            </div>

            {/* Polaroid Memory Grid */}
            <div className="grid grid-cols-2 gap-3">
              {GALLERY_IMAGES.map((img, idx) => (
                <motion.div
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  whileHover={{ scale: 1.04, rotate: idx % 2 === 0 ? -1.5 : 1.5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="cursor-pointer group flex flex-col p-2 rounded-2xl glass-panel border border-white/60 bg-white/25 backdrop-blur-xs shadow-md shadow-pastel-rose-deep/5"
                >
                  {/* Photo Container */}
                  <div className="overflow-hidden rounded-xl bg-pastel-rose/10 relative aspect-[4/3] w-full">
                    <img
                      src={img.url}
                      alt={img.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-pastel-rose-deep/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/95 backdrop-blur-xs text-pastel-rose-deep text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full shadow-xs">
                        Open ✨
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="mt-2 text-center px-1">
                    <span className="font-serif text-xs font-bold text-pastel-rose-deep block truncate">
                      {img.caption}
                    </span>
                    <span className="text-[8px] font-sans text-pastel-rose-deep/60 mt-0.5 block truncate">
                      Click to expand
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Preview Modal with Swipe Support */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
          >
            {/* Top Close Controls */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3">
              <span className="text-white/65 text-xs font-mono">
                {activeImageIndex + 1} / {GALLERY_IMAGES.length}
              </span>
              <button
                onClick={() => setActiveImageIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Left/Right Arrow controls for desktop */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
              <button
                onClick={handlePrevImage}
                className="p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer focus:outline-none"
                aria-label="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
              <button
                onClick={handleNextImage}
                className="p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer focus:outline-none"
                aria-label="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-md flex flex-col items-center justify-center">
              {/* Drag/Swipe instruction on mobile */}
              <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest mb-3 md:hidden">
                ← Swipe to Change →
              </span>

              {/* Slide image with motion drag support for swipes */}
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/40 shadow-2xl w-full aspect-[4/3] flex items-center justify-center">
                <motion.img
                  key={activeImageIndex}
                  src={GALLERY_IMAGES[activeImageIndex].url}
                  alt={GALLERY_IMAGES[activeImageIndex].caption}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(event, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      handleNextImage();
                    } else if (info.offset.x > swipeThreshold) {
                      handlePrevImage();
                    }
                  }}
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing select-none"
                />
              </div>

              {/* Image Caption & Description Card */}
              <motion.div
                key={`caption-${activeImageIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-full mt-4 text-center px-4"
              >
                <h3 className="font-serif text-base font-bold text-white tracking-wide">
                  {GALLERY_IMAGES[activeImageIndex].caption}
                </h3>
                <p className="font-sans text-xs text-white/70 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  {GALLERY_IMAGES[activeImageIndex].description}
                </p>
              </motion.div>
            </div>

            {/* Mobile Touch Indicators */}
            <div className="absolute bottom-6 flex items-center gap-1.5 md:hidden">
              {GALLERY_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeImageIndex ? 'bg-white scale-110 w-3' : 'bg-white/35'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Center stage row for Cute Vector interactive items: Cake & Gifts */}
      <div className="z-10 w-full max-w-sm flex items-end justify-around my-5 px-4 h-24">
        
        {/* Decorative Gift Box 1 */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: -5 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="cursor-pointer flex flex-col items-center"
        >
          <Gift size={22} className="text-pastel-rose-deep drop-shadow-sm animate-bounce" style={{ animationDuration: '3s' }} />
          <span className="text-[9px] font-sans text-pastel-rose-deep/55 font-semibold uppercase mt-1">
            Surprise
          </span>
        </motion.div>

        {/* Animated Celebration Cake SVG with flickering candle flame */}
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_8px_rgba(243,163,178,0.15)]">
            {/* Cake Base/Stand */}
            <path d="M15 65 L65 65 L60 69 L20 69 Z" fill="#E8DFE2" stroke="#D4C9E3" strokeWidth="1" />
            
            {/* Bottom Layer */}
            <rect x="22" y="44" width="36" height="21" rx="4" fill="#FFF" stroke="#E2D2E4" strokeWidth="1.5" />
            {/* Strawberry Cream Frosting trim */}
            <path d="M22 52 Q26 55, 30 52 Q34 49, 38 52 Q42 55, 46 52 Q50 49, 54 52 Q58 55, 58 52 L58 48 L22 48 Z" fill="#FCA5B3" />

            {/* Top Layer */}
            <rect x="28" y="28" width="24" height="16" rx="3" fill="#FFF" stroke="#E2D2E4" strokeWidth="1.5" />
            <path d="M28 34 Q31 36, 34 34 Q37 32, 40 34 Q43 36, 46 34 Q49 32, 52 34 L52 31 L28 31 Z" fill="#FCA5B3" />

            {/* Candle */}
            <rect x="39" y="16" width="2" height="12" fill="#E5C384" rx="0.5" />
            <line x1="40" y1="12" x2="40" y2="16" stroke="#D47A8F" strokeWidth="1" />

            {/* Flickering Candle Flame */}
            <motion.path
              d="M38.5 12 C38.5 12, 37 8, 40 5 C43 8, 41.5 12, 40 12 C38.5 12, 38.5 12, 38.5 12Z"
              fill="#F59E0B"
              animate={{ 
                scaleY: [1, 1.25, 0.9, 1.15, 1],
                rotate: [-4, 4, -2, 3, 0],
                x: [-0.5, 0.5, -0.2, 0.3, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              style={{ transformOrigin: '40px 12px' }}
              className="drop-shadow-[0_-1px_4px_rgba(245,158,11,0.65)]"
            />
          </svg>
        </div>

        {/* Decorative Gift Box 2 */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
          className="cursor-pointer flex flex-col items-center"
        >
          <Gift size={22} className="text-gold-soft drop-shadow-sm animate-bounce" style={{ animationDuration: '2.5s' }} />
          <span className="text-[9px] font-sans text-pastel-rose-deep/55 font-semibold uppercase mt-1">
            Gifts
          </span>
        </motion.div>
      </div>

      {/* 6. Route Navigation Actions - "Our Wishes" is locked/disabled until typing finishes */}
      <div className="z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center w-full max-w-sm mt-3">
        <Button variant="outline" size="md" onClick={onBack} className="gap-1.5 w-full sm:flex-1 py-3">
          <ChevronLeft size={16} />
          <span>Back</span>
        </Button>
        <Button 
          variant={isFinished ? "primary" : "outline"} 
          size="md" 
          onClick={isFinished ? onNext : undefined} 
          disabled={!isFinished}
          className={`gap-1.5 w-full sm:flex-1 py-3 transition-all duration-500 ${!isFinished ? 'opacity-45 cursor-not-allowed border-dashed text-pastel-rose-deep/50' : 'shadow-[0_0_15px_rgba(243,163,178,0.35)] hover:shadow-[0_0_22px_rgba(243,163,178,0.65)]'}`}
        >
          {isFinished ? (
            <>
              <span>Our Wishes</span>
              <ChevronRight size={16} />
            </>
          ) : (
            <>
              <Heart size={13} className="animate-pulse text-pastel-rose-deep fill-pastel-rose/30" />
              <span className="text-xs font-sans">Reading Letter...</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

