import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  media: string[];
  alt?: string;
  className?: string;
}

export default function ImageCarousel({ media, alt = 'Product Image', className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.endsWith('.webm') || currentMedia?.endsWith('.mp4');

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {isVideo ? (
            <video
              src={currentMedia}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={currentMedia}
              alt={`${alt} - ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {media.length > 1 && (
        <>
          {/* Navigation Arrows (visible on hover for desktop) */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/60 hover:bg-white text-mocha-900 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/60 hover:bg-white text-mocha-900 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-sm"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {media.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
