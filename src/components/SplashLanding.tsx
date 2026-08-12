import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SPLASH_KEY = 'mnm_splash_seen';

export default function SplashLanding() {
  const [visible, setVisible] = useState(() => {
    return sessionStorage.getItem(SPLASH_KEY) !== '1';
  });

  const navigate = useNavigate();
  const touchStartY = useRef(0);

  const dismiss = () => {
    sessionStorage.setItem(SPLASH_KEY, '1');
    // Unlock scroll on both html + body
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    // Snap page to top so it isn't stuck mid-scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;

    // Lock scroll on BOTH html and body — Chrome can scroll html even when body is hidden
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // We use non-passive here intentionally so we can prevent the actual
    // scroll from moving the document behind the splash
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 20) dismiss();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.changedTouches[0].screenY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent document scroll while splash is covering the screen
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (Math.abs(touchStartY.current - e.changedTouches[0].screenY) > 40) dismiss();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'Space', 'Enter'].includes(e.code)) {
        e.preventDefault();
        dismiss();
      }
    };

    // non-passive for wheel + touchmove so we can e.preventDefault()
    // this stops the underlying page from scrolling behind the splash
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKey);

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKey);
    };
  }, [visible]);

  const handleExplore = () => {
    dismiss();
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] bg-mocha-900 flex flex-col justify-end"
        >
          {/* Background Image — eager + high priority */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/covermain.webp"
              alt="Mocha & Mogra"
              className="w-full h-full object-cover opacity-80"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mocha-900/80 via-transparent to-mocha-900/30" />
          </div>

          {/* Logo */}
          <div className="absolute top-8 left-8 z-10">
            <img
              src="/images/mnmlogo-Photoroom.webp"
              alt="MnM Logo"
              className="h-12 w-auto invert opacity-90"
              loading="eager"
            />
          </div>

          {/* Swipe hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
          >
            <p className="font-cinzel text-white/70 text-xs tracking-[0.3em] uppercase animate-pulse">
              Swipe or Scroll to Enter
            </p>
          </motion.div>

          {/* CTA */}
          <div className="relative z-10 px-8 pb-16 md:pb-12 flex justify-center max-w-lg mx-auto w-full">
            <button
              onClick={handleExplore}
              className="w-full md:w-auto bg-gold-500 hover:bg-gold-400 text-mocha-900 font-cinzel text-xs tracking-[0.2em] uppercase py-4 px-12 transition-colors flex items-center justify-center gap-2"
            >
              Explore Collection <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
