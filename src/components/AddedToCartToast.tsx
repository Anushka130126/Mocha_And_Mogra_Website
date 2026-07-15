import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddedToCartToastProps {
  productName: string | null;
  onClose: () => void;
}

export default function AddedToCartToast({ productName, onClose }: AddedToCartToastProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!productName) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [productName, onClose]);

  return (
    <AnimatePresence>
      {productName && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-mocha-900 text-gold-200 shadow-2xl flex items-center gap-4 px-5 py-4 min-w-72"
        >
          <ShoppingBag size={18} strokeWidth={1.5} className="text-gold-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-0.5">
              Added to Cart
            </p>
            <p className="font-lora text-sm text-gold-200">{productName}</p>
          </div>
          <button
            onClick={() => { navigate('/cart'); onClose(); }}
            className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-gold-400 hover:text-gold-200 transition-colors border-l border-mocha-700 pl-4 ml-1 flex-shrink-0"
          >
            View Cart
          </button>
          <button onClick={onClose} className="text-mocha-500 hover:text-mocha-300 transition-colors ml-1">
            <X size={14} strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
