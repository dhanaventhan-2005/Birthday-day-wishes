/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PageId, PageDefinition } from './types';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Navigation } from './components/Navigation';
import { AudioPlayer } from './components/AudioPlayer';
import { PageTransition } from './components/PageTransition';

// Import our beautiful page skeletons
import { WelcomePage } from './components/pages/WelcomePage';
import { JourneyPage } from './components/pages/JourneyPage';
import { WishesPage } from './components/pages/WishesPage';
import { CanvasPage } from './components/pages/CanvasPage';
import { CelebrationPage } from './components/pages/CelebrationPage';

const PAGES: PageDefinition[] = [
  { id: 'welcome', label: 'Welcome', description: 'Begin the experience' },
  { id: 'journey', label: 'Journey', description: 'Our path of memories' },
  { id: 'wishes', label: 'Wishes', description: 'Whispers of love' },
  { id: 'canvas', label: 'Canvas', description: 'Interactive stardust' },
  { id: 'celebration', label: 'Celebrate', description: 'Make a magical wish' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('welcome');

  // Navigation callbacks
  const handleNextPage = () => {
    const currentIndex = PAGES.findIndex((p) => p.id === currentPage);
    if (currentIndex < PAGES.length - 1) {
      setCurrentPage(PAGES[currentIndex + 1].id);
    }
  };

  const handlePrevPage = () => {
    const currentIndex = PAGES.findIndex((p) => p.id === currentPage);
    if (currentIndex > 0) {
      setCurrentPage(PAGES[currentIndex - 1].id);
    }
  };

  const handleReset = () => {
    setCurrentPage('welcome');
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage key="welcome" onNext={handleNextPage} />;
      case 'journey':
        return <JourneyPage key="journey" onNext={handleNextPage} onBack={handlePrevPage} />;
      case 'wishes':
        return <WishesPage key="wishes" onNext={handleNextPage} onBack={handlePrevPage} />;
      case 'canvas':
        return <CanvasPage key="canvas" onNext={handleNextPage} onBack={handlePrevPage} />;
      case 'celebration':
        return <CelebrationPage key="celebration" onReset={handleReset} onBack={handlePrevPage} />;
      default:
        return <WelcomePage key="welcome" onNext={handleNextPage} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-pastel-rose-light selection:text-pastel-rose-deep">
      {/* 1. Global Interactive Ambient Background */}
      <BackgroundEffects />

      {/* 2. Audio Controller Element */}
      <AudioPlayer />

      {/* Elegant minimalist header logo */}
      <header className="w-full py-3 md:py-6 px-4 md:px-8 text-center md:text-left z-30">
        <div className="inline-flex items-center gap-2 select-none">
          <span className="font-script text-2xl md:text-3xl text-pastel-rose-deep font-semibold tracking-wide">
            For You
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse" />
        </div>
      </header>

      {/* 3. Main Stage with glassmorphism for a modern premium feel */}
      <main className="w-[94%] sm:w-[85%] md:w-[80%] lg:w-full max-w-2xl mx-auto px-2 py-2 md:py-8 lg:py-16 flex-1 flex flex-col justify-center relative z-20 overflow-hidden">
        <div className="w-full py-5 px-3.5 sm:p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-white/35 backdrop-blur-md border border-white/50 shadow-xl shadow-pastel-rose-deep/[0.02] flex flex-col items-center justify-center min-h-[380px] sm:min-h-[500px] max-h-[75vh] md:max-h-none overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <PageTransition key={currentPage}>
              <div className="w-full flex flex-col items-center justify-center overflow-x-hidden py-1">
                {renderActivePage()}
              </div>
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer copyright label */}
      <footer className="w-full text-center py-2 md:py-6 pb-24 md:pb-28 text-[9px] md:text-[10px] font-sans font-medium text-pastel-rose-deep/40 tracking-widest uppercase select-none z-30">
        Crafted with Love • 2026
      </footer>

      {/* 4. Elegant Progress & Floating Bottom Tab Bar */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pages={PAGES}
      />
    </div>
  );
}
