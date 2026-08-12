import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Mail, Package } from 'lucide-react';

const orderNumber = `MM-${Math.floor(100000 + Math.random() * 900000)}`;

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-6 text-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 rounded-full bg-mocha-50 border border-mocha-200 flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle size={32} className="text-mocha-700" strokeWidth={1.5} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="section-label mb-4"
          >
            Order Confirmed
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl text-mocha-900 mb-5"
          >
            Thank You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="font-lora text-base text-mocha-600 leading-relaxed mb-3"
          >
            Your saree is on its way to you. It has been wrapped with care and packaged with the intention it was made with.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="font-playfair text-lg italic text-mocha-500 mb-10"
          >
            "A new story is about to begin."
          </motion.p>

          {/* Order detail card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="border border-mocha-200 p-8 mb-10 text-left"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-400 mb-2">
                  Order Number
                </p>
                <p className="font-playfair text-lg text-mocha-900">{orderNumber}</p>
              </div>
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-400 mb-2">
                  Date
                </p>
                <p className="font-lora text-sm text-mocha-700">
                  {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-400 mb-2">
                  Estimated Delivery
                </p>
                <p className="font-lora text-sm text-mocha-700">
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-400 mb-2">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                  <p className="font-lora text-sm text-mocha-700">Confirmed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <div className="flex items-center gap-3 text-mocha-500">
              <Mail size={16} strokeWidth={1.5} />
              <p className="font-lora text-sm">Confirmation sent to your email</p>
            </div>
            <div className="hidden sm:block w-px h-4 bg-mocha-200" />
            <div className="flex items-center gap-3 text-mocha-500">
              <Package size={16} strokeWidth={1.5} />
              <p className="font-lora text-sm">Tracking details to follow</p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary"
            >
              Continue Shopping <ArrowRight size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="font-cinzel text-xs tracking-[0.2em] uppercase text-mocha-500 hover:text-mocha-800 transition-colors py-3"
            >
              Need Help? Contact Us
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom image strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-3"
        >
          {[
            '/images/ruby_doe.webp',
            '/images/butter_mogra.webp',
            '/images/sundowner_silk.webp',
          ].map((src, i) => (
            <div
              key={i}
              className="overflow-hidden bg-mocha-100"
              style={{ borderRadius: '6px', aspectRatio: '3/4' }}
            >
              <img src={src} alt="" className="w-full h-full object-cover opacity-70" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
