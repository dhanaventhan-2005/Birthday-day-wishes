/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [showBlockedButton, setShowBlockedButton] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  // Royal-free, dreamy emotional background music (soft piano/orchestral track)
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3';

  // Keep refs of key state to avoid stale closure issues in global event handlers
  const isPlayingRef = useRef(isPlaying);
  const isMutedRef = useRef(isMuted);
  const isUserPausedRef = useRef(isUserPaused);
  const hasPlayedOnceRef = useRef(hasPlayedOnce);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isUserPausedRef.current = isUserPaused;
  }, [isUserPaused]);

  useEffect(() => {
    hasPlayedOnceRef.current = hasPlayedOnce;
  }, [hasPlayedOnce]);

  // Handle fading volume over a duration
  const fadeTo = (targetVolume: number, durationMs: number, onComplete?: () => void) => {
    if (fadeInterval.current) {
      clearInterval(fadeInterval.current);
    }
    if (!audioRef.current) return;

    const startVolume = audioRef.current.volume;
    const stepTime = 30; // ~33fps updates for super smooth gradients
    const steps = durationMs / stepTime;
    const volumeStep = (targetVolume - startVolume) / steps;
    let currentStep = 0;

    fadeInterval.current = setInterval(() => {
      if (!audioRef.current) {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        return;
      }

      currentStep++;
      let nextVolume = startVolume + volumeStep * currentStep;

      // Handle float boundary limits
      if (volumeStep > 0 && nextVolume >= targetVolume) {
        nextVolume = targetVolume;
      } else if (volumeStep < 0 && nextVolume <= targetVolume) {
        nextVolume = targetVolume;
      }

      audioRef.current.volume = Math.max(0, Math.min(1, nextVolume));

      if (currentStep >= steps || nextVolume === targetVolume) {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        fadeInterval.current = null;
        if (onComplete) onComplete();
      }
    }, stepTime);
  };

  const playMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }

    audioRef.current.muted = isMutedRef.current;
    setIsUserPaused(false);

    // Fade in over 1 second when starting
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setHasPlayedOnce(true);
        setShowBlockedButton(false);
        setShowNotification(false);
        fadeTo(0.25, 1000);
      })
      .catch((err) => {
        console.log('Playback blocked by browser policy. Prompting with tap to play button.', err);
        setShowBlockedButton(true);
      });
  };

  const pauseMusic = () => {
    if (!audioRef.current) return;
    setIsUserPaused(true);
    setIsPlaying(false);
    // Fade out over 1 second when pausing, then pause the element
    fadeTo(0, 1000, () => {
      if (audioRef.current && !isPlayingRef.current) {
        audioRef.current.pause();
      }
    });
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  useEffect(() => {
    // Lazy setup audio element
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;
    audioRef.current.muted = false;

    // Listen to custom play trigger from interactive buttons
    const handleGlobalPlay = () => {
      if (!isUserPausedRef.current && !isPlayingRef.current) {
        playMusic();
      }
    };

    // Auto-detect first user interaction on mobile to unlock and start audio gracefully
    const handleFirstInteraction = () => {
      if (!hasPlayedOnceRef.current && !isPlayingRef.current && !isUserPausedRef.current) {
        playMusic();
      }
      // Clean up interaction triggers once handled
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('play-birthday-music', handleGlobalPlay);
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    // Auto-dismiss the gentle tip after 10 seconds
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 10000);

    return () => {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('play-birthday-music', handleGlobalPlay);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-2">
      {/* Blocked or Pending User Interaction Fallback Floating Button */}
      <AnimatePresence>
        {showBlockedButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playMusic}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pastel-rose to-pastel-rose-deep text-white border-2 border-white/40 shadow-lg text-[11px] font-sans font-bold tracking-wider cursor-pointer hover:shadow-xl transition-all"
          >
            <Music size={13} className="animate-pulse text-white" />
            <span>🎵 Tap to Play Music</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Soft, magical reminder popup asking the user to activate music */}
      <AnimatePresence>
        {showNotification && !showBlockedButton && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="flex items-center gap-2 px-3.5 py-1.5 glass-panel rounded-full shadow-md border border-white/60 mb-1"
          >
            <Sparkles size={13} className="text-gold-accent animate-spin-slow" />
            <span className="text-[11px] font-sans text-pastel-rose-deep tracking-wide font-medium">
              Listen to magical birthday melody ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mini Music Controller Bar in the bottom-right corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel-dark border border-white/40 shadow-lg shadow-pastel-rose-deep/5"
      >
        {/* Animated music note icon */}
        <div className="relative w-7 h-7 flex items-center justify-center bg-white/20 rounded-full mr-1.5 overflow-visible">
          {isPlaying && (
            <>
              {/* Floating magical music notes */}
              <motion.span
                initial={{ y: 0, opacity: 0, scale: 0.5 }}
                animate={{ y: -20, opacity: [0, 1, 0], scale: 1 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                className="absolute text-pastel-rose-deep text-[10px] pointer-events-none font-bold"
                style={{ left: '10%' }}
              >
                ♪
              </motion.span>
              <motion.span
                initial={{ y: 2, opacity: 0, scale: 0.5 }}
                animate={{ y: -16, opacity: [0, 1, 0], scale: 1 }}
                transition={{ repeat: Infinity, duration: 2.3, delay: 0.7, ease: 'easeOut' }}
                className="absolute text-gold-deep text-[9px] pointer-events-none font-bold"
                style={{ right: '10%' }}
              >
                ♫
              </motion.span>
            </>
          )}

          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="text-pastel-rose-deep"
          >
            <Music size={15} />
          </motion.div>
        </div>

        {/* 1. Play Button */}
        <motion.button
          onClick={playMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isPlaying}
          className={`p-1.5 rounded-full transition-all duration-300 focus:outline-none ${
            isPlaying
              ? 'text-pastel-rose-deep/30 cursor-not-allowed'
              : 'text-pastel-rose-deep hover:bg-white/35 bg-white/10'
          }`}
          title="Play Music"
          aria-label="Play Music"
        >
          <Play size={14} className="fill-current" />
        </motion.button>

        {/* 2. Pause Button */}
        <motion.button
          onClick={pauseMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!isPlaying}
          className={`p-1.5 rounded-full transition-all duration-300 focus:outline-none ${
            !isPlaying
              ? 'text-pastel-rose-deep/30 cursor-not-allowed'
              : 'text-pastel-rose-deep hover:bg-white/35 bg-white/10'
          }`}
          title="Pause Music"
          aria-label="Pause Music"
        >
          <Pause size={14} className="fill-current" />
        </motion.button>

        {/* 3. Mute/Unmute Button */}
        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-full text-pastel-rose-deep hover:bg-white/35 bg-white/10 transition-all duration-300 focus:outline-none"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </motion.button>
      </motion.div>
    </div>
  );
};
