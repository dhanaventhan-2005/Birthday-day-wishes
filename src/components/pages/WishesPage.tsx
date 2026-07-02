/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { Heart, ChevronRight, ChevronLeft, Mail, X, Sparkles, Send, Coffee, Flower } from 'lucide-react';

interface WishesPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface LetterConfig {
  id: string;
  title: string;
  summary: string;
  emoji: string;
  sender: string;
  colorTheme: string;
  bgGrad: string;
  content: string;
  decorativeIcon: React.ReactNode;
}

const LETTERS: LetterConfig[] = [
  {
    id: "letter-1",
    title: "To My Partner in Crime",
    summary: "Reflecting on our childhood giggles and late-night adventures...",
    emoji: "💖",
    sender: "Your Loving Sibling",
    colorTheme: "text-pastel-rose-deep border-pastel-rose/30",
    bgGrad: "from-pastel-rose-light/50 to-white/70",
    decorativeIcon: <Flower size={20} className="text-pastel-rose-deep/75" />,
    content: "Elena, looking back at our childhood, my absolute warmest and most cherished memories are those filled with your contagious laughter. From crafting blanket forts in the living room to whispering secret plans in the dark, you have been my constant light. You make this world infinitely softer and brighter just by being yourself. Thank you for your endless support, your gentle wisdom, and for always knowing how to make me smile. Today, I wish you a year of pure happiness, sweet achievements, and cozy moments!"
  },
  {
    id: "letter-2",
    title: "Stardust & Big Dreams",
    summary: "Wishing you strength and sparkling magic for the path ahead...",
    emoji: "✨",
    sender: "The Universe & Me",
    colorTheme: "text-gold-deep border-gold-soft/30",
    bgGrad: "from-pastel-gold-light/60 to-white/70",
    decorativeIcon: <Sparkles size={20} className="text-gold-accent" />,
    content: "To the brightest star in my sky: may your journey this year be filled with stardust, courage, and unexpected wonders. You possess a unique strength that inspires everyone around you, a heart so deep that it holds warmth for all, and an elegance that is truly rare. Never doubt how capable you are of reaching the highest summits. Let your dreams set sail today, and know that I will always be here, cheering you on from the front row. Shine bright, Elena! The world is yours to conquer."
  },
  {
    id: "letter-3",
    title: "A Scone, Coffee & Cozy Talks",
    summary: "Celebrating our quiet, comfortable bond and simple memories...",
    emoji: "☕",
    sender: "Your Best Friend Forever",
    colorTheme: "text-pastel-lavender-deep border-pastel-lavender/30",
    bgGrad: "from-pastel-lavender-light/50 to-white/70",
    decorativeIcon: <Coffee size={20} className="text-pastel-lavender-deep" />,
    content: "Dear Elena, some of my absolute favorite moments are the simplest ones—sharing warm pastries, sipping on hazelnut coffee, and talking for hours about absolutely everything and nothing at all. There is an incredible, rare comfort in our bond where silence feels just as warm as laughter. You are the sibling, the confidant, and the kindred spirit I am endlessly lucky to walk through life with. Happy Birthday, my sweet sister! Here is to a million more coffee chats, inside jokes, and peaceful days together."
  }
];

export const WishesPage: React.FC<WishesPageProps> = ({ onNext, onBack }) => {
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);

  const selectedLetter = LETTERS.find(l => l.id === activeLetterId);

  return (
    <div className="flex flex-col items-center justify-between min-h-[58vh] sm:min-h-[72vh] text-center py-4 sm:py-6 px-2 sm:px-4 md:px-8 w-full max-w-xl mx-auto overflow-hidden relative select-none">
      
      {/* Top Header & Floating Emblem */}
      <div className="flex flex-col items-center">
        {/* Heart beat animation */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="mb-3 p-2.5 rounded-full bg-pastel-rose-light/50 border border-pastel-rose/40 shadow-sm"
        >
          <Heart size={20} className="text-pastel-rose-deep fill-pastel-rose/40" />
        </motion.div>

        {/* Heading */}
        <h2 className="responsive-title text-pastel-rose-deep font-bold tracking-wide mb-1.5 text-glow">
          Whispers of Love
        </h2>

        <p className="font-sans text-[10px] md:text-xs text-pastel-rose-deep/60 tracking-[0.2em] uppercase font-bold mb-4 sm:mb-6">
          Chapter II • Handwritten Letters
        </p>
      </div>

      {/* Grid of Interactive Envelope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg mx-auto mb-8 relative z-10">
        {LETTERS.map((letter, idx) => (
          <motion.div
            key={letter.id}
            onClick={() => setActiveLetterId(letter.id)}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`cursor-pointer group flex flex-col justify-between p-5 rounded-2xl border bg-gradient-to-br ${letter.bgGrad} ${letter.colorTheme} shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
          >
            {/* Soft decorative floating shapes inside card */}
            <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <Mail size={80} />
            </div>

            {/* Letter Head */}
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-white/65 shadow-xs border border-white/50">
                {letter.decorativeIcon}
              </div>
              <span className="text-xl">{letter.emoji}</span>
            </div>

            {/* Title & description */}
            <div className="text-left mt-6">
              <h3 className="font-serif text-sm font-bold tracking-wide leading-snug">
                {letter.title}
              </h3>
              <p className="font-sans text-[11px] text-pastel-rose-deep/60 mt-1.5 leading-relaxed line-clamp-2">
                {letter.summary}
              </p>
            </div>

            {/* Read Button link */}
            <div className="mt-4 flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-wider text-pastel-rose-deep/70 group-hover:text-pastel-rose-deep group-hover:translate-x-1 transition-all duration-300">
              <span>Unfold Letter</span>
              <ChevronRight size={10} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immersive detailed glass modal envelope overlay */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 20, rotate: 1 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className={`w-full max-w-md rounded-[32px] glass-panel bg-gradient-to-b ${selectedLetter.bgGrad} border border-white/80 shadow-2xl overflow-hidden p-6 md:p-8 relative text-left`}
              style={{ backdropFilter: 'blur(16px)' }}
            >
              {/* Magical Sparkles behind */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pastel-rose/30 rounded-full filter blur-xl opacity-70 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pastel-lavender/30 rounded-full filter blur-xl opacity-70 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setActiveLetterId(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-pastel-rose-deep transition-all cursor-pointer focus:outline-none shadow-sm"
                aria-label="Close Letter"
              >
                <X size={15} />
              </button>

              {/* Letter Heading */}
              <div className="flex items-center gap-3 mb-5 border-b border-pastel-rose/20 pb-3">
                <div className="p-2.5 rounded-2xl bg-white/90 shadow-sm border border-white">
                  {selectedLetter.decorativeIcon}
                </div>
                <div>
                  <span className="text-[10px] font-sans text-pastel-rose-deep/60 tracking-widest uppercase font-bold">
                    Elena's Birthday Wish
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-pastel-rose-deep tracking-wide">
                    {selectedLetter.title}
                  </h3>
                </div>
              </div>

              {/* Letter Content in gorgeous handwritten font look with solid high contrast background */}
              <div 
                className="font-serif text-[16px] sm:text-[18px] text-[#333333] bg-white/92 p-4 sm:p-6 rounded-2xl border border-white/70 italic shadow-inner max-h-[170px] sm:max-h-[250px] overflow-y-auto"
                style={{ textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.05)', lineHeight: '1.8' }}
              >
                "{selectedLetter.content}"
              </div>

              {/* Signature */}
              <div className="mt-5 flex items-center justify-between border-t border-pastel-rose/20 pt-4">
                <div className="text-left">
                  <span className="text-[9px] font-sans text-pastel-rose-deep/50 uppercase tracking-wider block">
                    Sent with Love
                  </span>
                  <span className="font-script text-2xl text-pastel-rose-deep font-semibold">
                    {selectedLetter.sender}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Cute love heartbeat effect
                    const event = new CustomEvent('heart-burst', { detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 } });
                    window.dispatchEvent(event);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pastel-rose text-white text-[10px] font-sans font-bold tracking-wider uppercase shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Heart size={10} className="fill-current" />
                  <span>Send Love</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center z-10 w-full max-w-sm mt-3">
        <Button variant="outline" size="md" onClick={onBack} className="gap-1.5 w-full sm:flex-1">
          <ChevronLeft size={16} />
          <span>Back</span>
        </Button>
        <Button variant="primary" size="md" onClick={onNext} className="gap-1.5 w-full sm:flex-1">
          <span>Stardust Canvas</span>
          <ChevronRight size={16} />
        </Button>
      </div>

    </div>
  );
};

