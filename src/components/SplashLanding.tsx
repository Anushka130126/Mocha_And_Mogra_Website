import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SplashLanding() {
  const [visible, setVisible] = useState(() => {
    return sessionStorage.getItem('splashShown') !== 'true';
  });
  const navigate = useNavigate();

  // Handle scroll to dismiss
  useEffect(() => {
    if (!visible) return;

    const handleScroll = (e: Event) => {
      e.preventDefault();
      setVisible(false);
      sessionStorage.setItem('splashShown', 'true');
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 20) {
        setVisible(false);
        sessionStorage.setItem('splashShown', 'true');
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].screenY;
      if (Math.abs(touchStartY - touchEndY) > 50) {
        setVisible(false);
        sessionStorage.setItem('splashShown', 'true');
      }
    };

    // Prevent scrolling the main body while splash is active
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [visible]);

  const handleExplore = () => {
    setVisible(false);
    sessionStorage.setItem('splashShown', 'true');
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] bg-mocha-900 flex flex-col justify-end"
        >
          {/* Background Video/Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/covermain.webp"
              alt="Mocha & Mogra Splash"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mocha-900/80 via-transparent to-mocha-900/30" />
          </div>

          {/* Logo / Brand Name */}
          <div className="absolute top-8 left-8 z-10">
            <img 
              src="/images/mnmlogo-Photoroom.webp" 
              alt="MnM Logo" 
              className="h-12 w-auto invert opacity-90"
            />
          </div>

          {/* Swipe indicator for mobile, or scroll for desktop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
          >
             <p className="font-cinzel text-white/70 text-xs tracking-[0.3em] uppercase animate-pulse">
               Swipe or Scroll to Enter
             </p>
          </motion.div>

          {/* Actions */}
          <div className="relative z-10 px-8 pb-16 md:pb-12 flex justify-center max-w-lg mx-auto w-full">
            <button
              onClick={handleExplore}
              className="w-full md:w-auto bg-gold-500 hover:bg-gold-400 text-mocha-900 font-cinzel text-xs tracking-[0.2em] uppercase py-4 px-12 transition-colors flex items-center justify-center gap-2"
            >
              Enter the Wardrobe <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
