/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RippleData {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleData[]>([]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: RippleData = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    if (onClick) {
      // Small timeout to allow the ripple animation to begin before navigating or performing logic
      setTimeout(() => {
        onClick(e);
      }, 150);
    }
  };

  const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pastel-rose/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none touch-manipulation min-h-[44px]';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase sm:px-5 sm:py-2.5',
    md: 'w-full max-w-[420px] h-[52px] text-[15px] sm:w-auto sm:h-auto sm:max-w-none sm:px-7 sm:py-3.5 sm:text-base tracking-wide',
    lg: 'w-full max-w-[420px] h-[54px] text-base sm:w-auto sm:h-auto sm:max-w-none sm:px-9 sm:py-4 sm:text-[18px] tracking-wider',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-pastel-rose via-[#FCA5B3] to-pastel-rose-deep text-white shadow-md shadow-pastel-rose/25 hover:shadow-lg hover:shadow-pastel-rose/40 border border-white/20',
    secondary: 'bg-pastel-lavender text-pastel-lavender-deep hover:bg-pastel-lavender-deep hover:text-white',
    outline: 'border border-pastel-rose/30 text-pastel-rose-deep bg-transparent hover:bg-pastel-rose-light/25 hover:border-pastel-rose',
    gold: 'bg-gradient-to-r from-gold-soft via-gold-accent to-gold-deep text-white shadow-md shadow-gold-accent/20 hover:shadow-lg hover:shadow-gold-accent/30 border border-white/10 font-serif font-semibold tracking-wider',
    glass: 'glass-panel text-pastel-rose-deep hover:bg-white/60 hover:text-pastel-rose-deep shadow-sm',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleButtonClick}
      className={`
        ${baseStyles} 
        ${sizeStyles[size]} 
        ${variantStyles[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {/* Click ripple elements */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.45 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
            className="absolute rounded-full bg-white/40 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Delicate inner glow ring on hover for primary/gold */}
      {(variant === 'primary' || variant === 'gold') && (
        <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
