import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createDirectShopifyCheckout, SHOPIFY_STORE_DOMAIN } from '../lib/shopify';
import { useCurrency } from '../context/CurrencyContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const { currency, formatPrice, usdRate } = useCurrency();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const threshold = currency === 'USD' ? 200 * usdRate : 5000;
  const shippingFee = currency === 'USD' ? 25 * usdRate : 500;
  const shipping = subtotal >= threshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const itemsPayload = items.map((item) => ({
        variantId: item.product.shopifyVariantId || item.product.id,
        quantity: item.quantity,
      }));
      const checkoutUrl = createDirectShopifyCheckout(itemsPayload);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.warn('Redirecting to Shopify Checkout:', err);
      window.location.href = `https://${SHOPIFY_STORE_DOMAIN}/checkout`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <p className="section-label mb-3">Your Curated Selection</p>
          <h1 className="font-cinzel text-4xl md:text-5xl tracking-widest text-mocha-900 uppercase">
            Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyCart onShop={() => navigate('/shop')} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Items */}
            <div className="lg:col-span-2 space-y-0">
              <div className="border-t border-mocha-200">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-mocha-200 py-8 flex gap-6"
                    >
                      {/* Arch image */}
                      <div
                        className="flex-shrink-0 w-28 overflow-hidden bg-mocha-100 cursor-pointer"
                        style={{ borderRadius: '6px', aspectRatio: '3/4' }}
                        onClick={() => navigate('/shop')}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-cinzel text-xs tracking-[0.2em] uppercase text-mocha-500 mb-1">
                              {item.product.category} · {item.product.motif} Motif
                            </p>
                            <h3 className="font-playfair text-xl text-mocha-900 mb-1">
                              {item.product.name}
                            </h3>
                            <p className="font-lora text-sm text-mocha-500 italic">
                              {item.product.personality.join(', ')}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-mocha-400 hover:text-mocha-800 transition-colors flex-shrink-0 p-1"
                            aria-label="Remove item"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          {/* Quantity */}
                          <div className="flex items-center border border-mocha-200">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center text-mocha-600 hover:text-mocha-900 hover:bg-mocha-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} strokeWidth={1.5} />
                            </button>
                            <span className="w-10 text-center font-lora text-sm text-mocha-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center text-mocha-600 hover:text-mocha-900 hover:bg-mocha-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} strokeWidth={1.5} />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-playfair text-lg text-mocha-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <div className="pt-6">
                <button
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-2 font-cinzel text-xs tracking-[0.2em] uppercase text-mocha-500 hover:text-mocha-800 transition-colors"
                >
                  ← Return to Wardrobe
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-mocha-200 p-8 sticky top-28">
                <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-mocha-900 mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between font-lora text-sm text-mocha-700">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-lora text-sm text-mocha-700">
                    <span>Artisanal Packaging</span>
                    <span className="text-forest-600 font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between font-lora text-sm text-mocha-700">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-forest-600 font-medium">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-lora text-xs text-mocha-400 italic">
                      Add {formatPrice(threshold - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                {/* Promo */}
                <div className="flex gap-2 mb-8">
                  <div className="flex items-center gap-2 flex-1 border-b border-mocha-300">
                    <Tag size={14} className="text-mocha-400" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Gift card or promo code"
                      className="flex-1 bg-transparent font-lora text-sm text-mocha-700 placeholder-mocha-400 outline-none py-2"
                    />
                  </div>
                  <button className="font-cinzel text-xs tracking-[0.15em] uppercase text-mocha-600 hover:text-mocha-900 border border-mocha-300 px-3 py-2 hover:border-mocha-600 transition-colors">
                    Apply
                  </button>
                </div>

                <div className="border-t border-mocha-200 pt-6 mb-8">
                  <div className="flex justify-between">
                    <span className="font-cinzel text-sm tracking-[0.15em] uppercase text-mocha-900">
                      Estimated Total
                    </span>
                    <span className="font-playfair text-xl text-mocha-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full btn-primary-filled justify-center py-4 text-sm flex items-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      Processing...
                      <Loader2 size={14} className="animate-spin" strokeWidth={1.5} />
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </>
                  )}
                </button>
                <p className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-mocha-400 text-center mt-4">
                  Secure &amp; Encrypted
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <ShoppingBag size={40} className="text-mocha-300 mb-6" strokeWidth={1} />
      <h2 className="font-playfair text-3xl text-mocha-900 mb-4">Your cart is empty.</h2>
      <p className="font-lora text-sm text-mocha-500 leading-relaxed mb-10 max-w-sm">
        Every great wardrobe begins with a single piece. Browse the wardrobe and find the story that speaks to you.
      </p>
      <button onClick={onShop} className="btn-primary">
        Enter the Wardrobe <ArrowRight size={14} strokeWidth={1.5} />
      </button>
    </motion.div>
  );
}
