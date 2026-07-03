/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { Cake, Sparkles, RotateCcw, Flame, Sparkle, Heart, X, Gift, Send, Loader2 } from 'lucide-react';

interface CelebrationPageProps {
  onReset: () => void;
  onBack: () => void;
}

export const CelebrationPage: React.FC<CelebrationPageProps> = ({ onReset, onBack }) => {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);

  // New states for the interactive wish-making flow
  const [showMakeWishModal, setShowMakeWishModal] = useState(false);
  const [wishText, setWishText] = useState('');
  const [isSendingWish, setIsSendingWish] = useState(false);
  const [showWishSuccessModal, setShowWishSuccessModal] = useState(false);
  const [wishError, setWishError] = useState('');
  const [countdown, setCountdown] = useState(4);

  // Handle countdown timer for automatic blowout transition
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showWishSuccessModal && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showWishSuccessModal && countdown === 0) {
      setShowWishSuccessModal(false);
      triggerBlowout();
    }
    return () => clearTimeout(timer);
  }, [showWishSuccessModal, countdown]);

  const handleBlowCandle = () => {
    window.dispatchEvent(new CustomEvent('play-birthday-music'));
    if (isBlownOut) return;
    // Do not immediately trigger candle blowout animation, open the wish-making modal instead!
    setShowMakeWishModal(true);
  };

  const submitWish = async () => {
    const trimmedWish = wishText.trim();
    if (!trimmedWish) {
      setWishError('Your wish cannot be empty. Let your heart speak! ✨');
      return;
    }
    setWishError('');
    setIsSendingWish(true);

    try {
      const response = await fetch('/api/wish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wish: trimmedWish,
          timestamp: new Date().toLocaleString(),
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSendingWish(false);
        setShowMakeWishModal(false);
        setWishText('');
        setCountdown(4); // Reset countdown to 4 seconds
        setShowWishSuccessModal(true);
      } else {
        throw new Error(data.error || 'The connection to the stars was lost.');
      }
    } catch (error: any) {
      console.error('Wish Error:', error);
      setWishError(error?.message || 'The stars are currently unreachable. Please try again! 🌌');
      setIsSendingWish(false);
    }
  };

  const triggerBlowout = () => {
    setIsBlownOut(true);
    
    // Trigger window event for global confetti burst if supported
    const event = new CustomEvent('birthday-blowout', { detail: { blown: true } });
    window.dispatchEvent(event);

    // After 1.2s of smoke rise, open the secret wish card
    setTimeout(() => {
      setShowWishModal(true);
    }, 1200);
  };

  const skipSuccessCountdown = () => {
    setShowWishSuccessModal(false);
    triggerBlowout();
  };

  const handleRestart = () => {
    setIsBlownOut(false);
    setShowWishModal(false);
    setShowMakeWishModal(false);
    setShowWishSuccessModal(false);
    setWishText('');
    setWishError('');
    onReset();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[58vh] sm:min-h-[72vh] text-center py-4 sm:py-6 px-2 sm:px-4 md:px-8 w-full max-w-xl mx-auto overflow-hidden relative select-none">
      
      {/* Top Header & Floating Emblem */}
      <div className="flex flex-col items-center">
        {/* Cake symbol with floating golden crowns */}
        <div className="relative mb-3">
          <motion.div
            animate={isBlownOut ? { scale: 1 } : { scale: [1, 1.08, 1], rotate: [0, 1.5, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative p-2.5 rounded-full bg-gradient-to-r from-pastel-rose-light to-pastel-lavender/40 border border-white/60 shadow-md z-10"
          >
            <Cake size={20} className="text-pastel-rose-deep" />
          </motion.div>
          {/* Tiny floating stars around */}
          <motion.div
            animate={{ y: [-5, 5, -5], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute -top-1 -left-1 text-gold-accent"
          >
            <Sparkles size={12} />
          </motion.div>
          <motion.div
            animate={{ y: [4, -4, 4], opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-2 -right-1 text-pastel-rose"
          >
            <Sparkle size={10} />
          </motion.div>
        </div>

        {/* Heading */}
        <h2 className="responsive-title text-pastel-rose-deep font-bold tracking-wide mb-1.5 text-glow">
          The Celebration
        </h2>

        <p className="font-sans text-[10px] md:text-xs text-pastel-rose-deep/60 tracking-[0.2em] uppercase font-bold mb-4 sm:mb-6">
          Chapter IV • Blow the Magical Candle
        </p>
      </div>

      {/* Elegant birthday cake interactive visual shell */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-white/40 to-pastel-rose-light/10 border border-white/60 flex flex-col items-center justify-center mb-5 shadow-lg shadow-pastel-rose-deep/5 overflow-hidden group">
        
        {/* Interactive candle stand and candle body */}
        <div className="relative flex flex-col items-center justify-end h-32 w-28">
          
          {/* Flame element (active / blown-out smoke) */}
          <AnimatePresence mode="wait">
            {!isBlownOut ? (
              <motion.div
                key="candle-flame"
                onClick={handleBlowCandle}
                whileHover={{ scale: 1.15 }}
                className="absolute -top-8 cursor-pointer flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2, filter: 'blur(4px)' }}
              >
                {/* Flame layer 1 (outer glow) */}
                <motion.div
                  animate={{ scaleY: [1, 1.25, 0.95, 1.15, 1], rotate: [-2, 3, -1, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="w-4 h-7 rounded-full bg-gradient-to-b from-orange-400 via-amber-400 to-yellow-100 blur-[0.5px] origin-bottom shadow-[0_-3px_15px_rgba(245,158,11,0.65)]"
                />
                <span className="text-[7px] font-sans text-pastel-rose-deep/40 font-bold uppercase tracking-widest mt-1 block group-hover:text-pastel-rose-deep/80 transition-colors">
                  Tap to Blow
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="candle-smoke"
                className="absolute -top-12 flex flex-col items-center pointer-events-none"
              >
                {/* Grey smoke drifting up circles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.7, y: 15, scale: 0.5, x: 0 }}
                    animate={{ 
                      opacity: 0, 
                      y: -25 - i * 15, 
                      scale: 1.8, 
                      x: (i % 2 === 0 ? 8 : -8) + Math.random() * 4 - 2 
                    }}
                    transition={{ duration: 1.2 + i * 0.3, ease: 'easeOut' }}
                    className="absolute w-2 h-2 rounded-full bg-neutral-400/40 blur-[1.5px]"
                  />
                ))}
                <span className="text-[7px] font-mono text-pastel-rose-deep/30 font-bold uppercase tracking-widest mt-1">
                  Wish Casted
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candle cylinder stick */}
          <div className="w-4 h-16 bg-gradient-to-r from-pastel-rose via-white to-pastel-rose-deep rounded-t-sm shadow-sm relative overflow-hidden">
            {/* Elegant spirals on candle */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.45)_50%,transparent_75%)] bg-[length:12px_12px]" />
          </div>

          {/* Candle Holder socket */}
          <div className="w-7 h-2 bg-gold-accent rounded-full border border-gold-deep shadow-xs" />
        </div>

        {/* Instructive subtitle inside sphere */}
        <div className="absolute bottom-6 font-sans text-[9px] text-pastel-rose-deep/60 tracking-[0.15em] font-bold uppercase">
          {!isBlownOut ? 'Make a Wish ✨' : 'Your Wish is Set 🌠'}
        </div>
      </div>

      {/* Primary Action Button to Blow candle with ripple effect */}
      <div className="z-10 w-full mb-5 flex justify-center">
        <Button
          variant={isBlownOut ? "glass" : "primary"}
          size="md"
          onClick={handleBlowCandle}
          disabled={isBlownOut}
          className="gap-2.5 w-full max-w-[420px] shadow-[0_0_15px_rgba(243,163,178,0.3)] hover:shadow-[0_0_25px_rgba(243,163,178,0.5)] border border-white/30"
        >
          {isBlownOut ? (
            <>
              <Sparkles size={14} className="text-gold-accent animate-pulse" />
              <span>Wish Casted to the Stars</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Make a Wish & Blow Candle</span>
              <span>💨</span>
            </>
          )}
        </Button>
      </div>

      {/* Secret Wishes Letter Modal Overlay */}
      <AnimatePresence>
        {showWishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[94%] max-w-md rounded-[24px] sm:rounded-[32px] glass-panel bg-gradient-to-b from-pastel-gold-light/95 via-[#FFFDFE]/95 to-pastel-rose-light/95 border border-white/80 shadow-2xl p-5 sm:p-6 md:p-8 text-center relative overflow-y-auto max-h-[90vh]"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowWishModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-pastel-rose-deep transition-all cursor-pointer focus:outline-none shadow-sm"
                aria-label="Close Letter"
              >
                <X size={15} />
              </button>

              {/* Header Heart Crown */}
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-white rounded-full shadow-md border border-pastel-rose-light relative">
                  <Heart size={22} className="text-pastel-rose-deep fill-pastel-rose/25 animate-pulse" />
                  <div className="absolute -top-1 -right-1 text-gold-accent">
                    <Sparkles size={12} />
                  </div>
                </div>
              </div>

              {/* Star-cast Confirmation Heading */}
              <span className="text-[9px] sm:text-[10px] font-sans text-pastel-rose-deep/60 tracking-widest uppercase font-bold block mb-1">
                Your Magical Wish is Sealed
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-pastel-rose-deep tracking-wide mb-3">
                Deva bharathy! 🌸
              </h3>

              {/* Heartfelt Blessing Paragraph with high contrast readable styling */}
              <p 
                className="font-serif text-[15px] sm:text-[18px] text-[#333333] bg-white/92 p-4 sm:p-6 rounded-2xl border border-white/70 italic shadow-inner mb-5"
                style={{ textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.05)', lineHeight: '1.7' }}
              >
                "Your sisterly bond is a guiding beacon of joy. May this next chapter of your life be written in pure light, sweet laughter, stardust dreams, and cozy, quiet coffee sips. You are deeply loved, admired, and cherished beyond measure."
              </p>

              {/* Action and Sign off */}
              <div className="flex items-center justify-center gap-3 w-full">
                <Button 
                  variant="gold" 
                  size="sm" 
                  onClick={() => setShowWishModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs shadow-md border border-white/20 w-full sm:w-auto"
                >
                  <Gift size={12} />
                  <span>Accept Wishes</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Make Your Secret Wish Modal Overlay */}
      <AnimatePresence>
        {showMakeWishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Custom Placeholder Style Tag */}
            <style dangerouslySetInnerHTML={{__html: `
              .custom-wish-textarea::placeholder {
                color: #9CA3AF !important;
                opacity: 1 !important;
              }
            `}} />

            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[94%] max-w-md rounded-[24px] sm:rounded-[32px] border border-white/80 shadow-2xl p-5 sm:p-6 md:p-8 text-center relative overflow-y-auto max-h-[90vh]"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMakeWishModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-pastel-rose-deep transition-all cursor-pointer focus:outline-none shadow-sm"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              {/* Title & Subtitle */}
              <div className="flex flex-col items-center mb-5">
                <div className="p-2.5 bg-pastel-rose-light/40 rounded-full mb-2 border border-pastel-rose-light relative">
                  <Sparkles size={20} style={{ color: '#E75480' }} />
                </div>
                <h3 
                  className="font-serif text-lg sm:text-2xl tracking-wide mb-1.5"
                  style={{ color: '#E75480', fontWeight: 700 }}
                >
                  ✨ Make Your Secret Wish ✨
                </h3>
                <p 
                  className="font-serif italic max-w-xs leading-relaxed text-[13px] sm:text-[15px]"
                  style={{ color: '#6B7280' }}
                >
                  "Close your eyes, make a wish from your heart, and let the stars carry it."
                </p>
              </div>

              {/* Textarea */}
              <div className="relative w-full">
                <textarea
                  value={wishText}
                  onChange={(e) => {
                    setWishText(e.target.value);
                    if (wishError) setWishError('');
                  }}
                  placeholder="Write your secret wish here..."
                  rows={4}
                  maxLength={1000}
                  className="w-full font-serif p-4 rounded-2xl shadow-inner resize-none transition-all duration-200 leading-relaxed custom-wish-textarea focus:outline-none"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#2D2D2D',
                    caretColor: '#EC4899',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    fontSize: '16px',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#EC4899';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                
                {/* Character Counter */}
                <span 
                  className="absolute bottom-3 right-3 text-[10px] font-mono"
                  style={{ color: '#6B7280' }}
                >
                  {wishText.length}/1000
                </span>
              </div>

              {/* Error validation message */}
              {wishError && (
                <p className="text-xs font-sans font-semibold text-red-500 mt-2 text-center">
                  {wishError}
                </p>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowMakeWishModal(false)}
                  disabled={isSendingWish}
                  className="w-full sm:order-1 transition-all duration-200"
                  style={{
                    color: '#E75480',
                    borderColor: '#E75480',
                    borderWidth: '1px',
                    backgroundColor: 'transparent',
                    height: '52px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(231, 84, 128, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={submitWish}
                  disabled={isSendingWish}
                  className="w-full sm:order-2 gap-2 shadow-md transition-all duration-200 border-none"
                  style={{
                    background: 'linear-gradient(135deg, #FF7EB3, #FF5E95)',
                    color: 'white',
                    height: '52px',
                  }}
                >
                  {isSendingWish ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Sending Wish...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>🌟 Wish Upon a Star</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magical Wish Success Modal Overlay */}
      <AnimatePresence>
        {showWishSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[94%] max-w-sm text-center relative p-5 sm:p-8 overflow-y-auto max-h-[90vh]"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(232, 84, 128, 0.18)',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.08)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Spinning/pulsing shooting star effect */}
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="p-3 bg-white/90 rounded-full shadow-lg border border-pastel-gold/30 relative"
                >
                  <Sparkles size={26} className="text-gold-accent" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-pastel-rose/30"
                  />
                </motion.div>
              </div>

              {/* Magical response text */}
              <h3 
                className="font-serif tracking-wide mb-3 text-center text-2xl sm:text-[34px] leading-snug"
                style={{
                  color: '#E75480',
                  fontWeight: 700,
                }}
              >
                ✨ Your Wish Has Been Sealed ✨
              </h3>
              
              <div 
                className="font-serif text-center p-4 sm:p-5 rounded-2xl shadow-inner mb-4 whitespace-pre-line text-[15px] sm:text-[18px]"
                style={{
                  color: '#333333',
                  lineHeight: '1.7',
                  fontWeight: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(232, 84, 128, 0.08)'
                }}
              >
                ✨ Your wish has been entrusted to the stars.

                Keep believing in magic,
                and may your heart's deepest wish
                find its way to reality. 🌠
              </div>

              {/* Optional small note */}
              <p 
                className="font-sans text-center mb-5 max-w-xs mx-auto text-[13px] sm:text-[15px]"
                style={{
                  color: '#6B7280',
                }}
              >
                Some wishes are meant to stay secret.<br />
                Yours is safe among the stars. ✨
              </p>

              {/* Progress/Timer indicator */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1 text-xs sm:text-sm mb-3">
                  <span style={{ color: '#E75480', fontWeight: 600 }}>
                    ✨ Blowing Out the Candle in{' '}
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={countdown}
                        initial={{ opacity: 0, scale: 0.8, y: -5 }}
                        animate={{ opacity: 1, scale: 1.1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block font-mono font-bold"
                      >
                        {countdown}
                      </motion.span>
                    </AnimatePresence>{' '}
                    Seconds...
                  </span>
                </div>
                
                {/* Timer Bar */}
                <div className="w-40 sm:w-48 h-2 bg-pastel-rose/10 rounded-full overflow-hidden mb-4 sm:mb-5 relative shadow-[0_0_8px_rgba(255,126,179,0.2)]">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(to right, #FF7EB3, #FBBF24)',
                      boxShadow: '0 0 8px #FF7EB3'
                    }}
                  />
                </div>

                <Button
                  variant="gold"
                  size="sm"
                  onClick={skipSuccessCountdown}
                  className="px-6 py-3 rounded-full text-sm border-none font-sans font-bold w-full max-w-[280px]"
                  style={{
                    background: 'linear-gradient(135deg, #FBBF24, #D4A017)',
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(251, 191, 36, 0.3)',
                    height: '52px',
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 6px 20px rgba(251, 191, 36, 0.5)'
                  }}
                >
                  <span>✨ Continue the Magic</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Control Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center z-10 w-full max-w-sm mt-3">
        <Button variant="outline" size="md" onClick={onBack} className="gap-1.5 w-full sm:flex-1">
          <span>Back</span>
        </Button>
        <Button variant="gold" size="md" onClick={handleRestart} className="gap-1.5 w-full sm:flex-1 shadow-[0_0_12px_rgba(212,175,55,0.25)] hover:shadow-[0_0_18px_rgba(212,175,55,0.45)]">
          <RotateCcw size={14} />
          <span>Relive the Magic</span>
        </Button>
      </div>

    </div>
  );
};
