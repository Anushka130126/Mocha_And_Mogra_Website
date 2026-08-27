import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { createDirectShopifyCheckout } from '../lib/shopify';
import ImageCarousel from './ImageCarousel';
import { useCurrency } from '../context/CurrencyContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddedToCart?: (product: Product) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
};

export default function ProductModal({ product, onClose, onAddedToCart }: ProductModalProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setAdded(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    onClose();
    if (onAddedToCart) onAddedToCart(product);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product);
    onClose();
    window.location.href = createDirectShopifyCheckout([{ variantId: product.id, quantity: 1 }]);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 bg-mocha-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-[#FFFEF7] shadow-2xl overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 text-mocha-600 hover:text-mocha-900 transition-colors p-2"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Arch Image */}
            <div className="relative px-10 pt-10">
              <div
                className="rounded-md w-full overflow-hidden bg-mocha-100"
                style={{ aspectRatio: '3/4' }}
              >
                <ImageCarousel 
                  media={product.images || [product.image]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-10 py-8">
              {/* Tags */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-mocha-500">
                  {product.category}
                </span>
                <span className="text-mocha-300">·</span>
                <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-mocha-500">
                  {product.motif} Motif
                </span>
              </div>

              {/* Name & Price */}
              <h2 className="font-playfair text-3xl text-mocha-900 mb-1">{product.name}</h2>
              <p className="font-lora text-xl text-mocha-600 mb-4">{formatPrice(product.price)}</p>

              {/* Prominent Action Buttons (1-Click Buy Now & Add to Bag) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-mocha-900 text-gold-200 font-cinzel text-xs tracking-[0.2em] uppercase hover:bg-mocha-800 transition-colors shadow-md"
                >
                  <ArrowRight size={14} strokeWidth={1.5} />
                  Buy Now — {formatPrice(product.price)}
                </button>
                <button
                  id="modal-add-to-bag-btn"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-mocha-800 text-mocha-900 font-cinzel text-xs tracking-[0.2em] uppercase hover:bg-mocha-50 transition-colors"
                >
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Add to Bag
                </button>
              </div>

              <div className="w-12 h-px bg-gold-500 mb-6" />

              {/* Story */}
              <div className="mb-6">
                <h3 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-500 mb-3">
                  The Story
                </h3>
                <p className="font-lora text-sm leading-relaxed text-mocha-700">
                  {product.story}
                </p>
              </div>

              {/* Personality */}
              <div className="mb-6">
                <h3 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-500 mb-3">
                  Her Personality
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.personality.map((trait) => (
                    <span
                      key={trait}
                      className="border border-mocha-300 text-mocha-600 font-lora text-xs px-3 py-1 tracking-wide"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="mb-6">
                <h3 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-500 mb-3">
                  Craft Details
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.keywords.map((kw) => (
                    <span key={kw} className="bg-mocha-50 text-mocha-600 font-lora text-xs px-3 py-1">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Wear For */}
              <div className="mb-8">
                <h3 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-500 mb-3">
                  Wear For
                </h3>
                <p className="font-lora text-sm italic text-mocha-600 leading-relaxed">
                  {product.wearFor}
                </p>
              </div>

              {/* Secondary Continue Browsing link */}
              <div className="pt-4 border-t border-mocha-100 text-center">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-mocha-400 font-cinzel text-[10px] tracking-[0.25em] uppercase py-2 hover:text-mocha-800 transition-colors"
                >
                  Continue Browsing <ArrowRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
