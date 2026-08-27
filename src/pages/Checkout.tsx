import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, ShieldCheck, ChevronDown, Check, Globe, Building2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

const INTERNATIONAL_COUNTRIES = [
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971' },
  { name: 'Canada', code: 'CA', dial: '+1' },
  { name: 'Australia', code: 'AU', dial: '+61' },
  { name: 'Singapore', code: 'SG', dial: '+65' },
  { name: 'Germany', code: 'DE', dial: '+49' },
  { name: 'France', code: 'FR', dial: '+33' },
  { name: 'Qatar', code: 'QA', dial: '+974' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966' },
  { name: 'Kuwait', code: 'KW', dial: '+965' },
  { name: 'Malaysia', code: 'MY', dial: '+60' },
  { name: 'Japan', code: 'JP', dial: '+81' },
  { name: 'Netherlands', code: 'NL', dial: '+31' },
  { name: 'Switzerland', code: 'CH', dial: '+41' },
];

type DeliveryRegion = 'domestic' | 'international';
type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { currency, formatPrice, usdRate } = useCurrency();
  
  // Auto-set region based on selected currency ($ -> International, ₹ -> Domestic India)
  const [region, setRegion] = useState<DeliveryRegion>(() =>
    currency === 'USD' ? 'international' : 'domestic'
  );

  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [submitting, setSubmitting] = useState(false);

  // Address fields
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
    gstin: '',
  });

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  useEffect(() => {
    // If user changes currency globally, sync the checkout region tab
    if (currency === 'USD') setRegion('international');
    else setRegion('domestic');
  }, [currency]);

  // Shipping cost calculation
  const isFreeShipping = region === 'domestic' 
    ? subtotal >= 5000 
    : (currency === 'USD' ? subtotal >= 200 : subtotal >= 16000);

  const shippingCost = isFreeShipping 
    ? 0 
    : (region === 'domestic' ? 500 : (currency === 'USD' ? 25 * usdRate : 2000));

  const total = subtotal + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1600));
    clearCart();
    navigate('/order-confirmation');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-2">Secure 1-Page Checkout</p>
          <h1 className="font-cinzel text-3xl md:text-4xl tracking-widest text-mocha-900 uppercase">
            Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Delivery Region, Address & Payment (7 Cols) */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Region Switcher Tab */}
              <div className="bg-white border border-mocha-200 p-6 rounded-lg shadow-sm">
                <h2 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-900 mb-4 flex items-center gap-2">
                  <Globe size={16} strokeWidth={1.5} className="text-mocha-600" />
                  1. Shipping Region
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegion('domestic')}
                    className={`py-3.5 px-4 rounded-md font-cinzel text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 border transition-all ${
                      region === 'domestic'
                        ? 'border-mocha-900 bg-mocha-900 text-gold-200 shadow-sm'
                        : 'border-mocha-200 text-mocha-600 hover:border-mocha-400 bg-mocha-50/50'
                    }`}
                  >
                    <span>🇮🇳</span> India (Domestic)
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegion('international')}
                    className={`py-3.5 px-4 rounded-md font-cinzel text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 border transition-all ${
                      region === 'international'
                        ? 'border-mocha-900 bg-mocha-900 text-gold-200 shadow-sm'
                        : 'border-mocha-200 text-mocha-600 hover:border-mocha-400 bg-mocha-50/50'
                    }`}
                  >
                    <span>🌐</span> International
                  </button>
                </div>

                <p className="font-lora text-xs text-mocha-400 mt-3 italic">
                  {region === 'domestic'
                    ? 'Free domestic express shipping across India on orders above ₹5,000.'
                    : 'Insured worldwide shipping via DHL / FedEx. Customs duties handled transparently.'}
                </p>
              </div>

              {/* Address Form Section */}
              <div className="bg-white border border-mocha-200 p-6 rounded-lg shadow-sm space-y-6">
                <h2 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-900 mb-2 flex items-center gap-2">
                  <MapPin size={16} strokeWidth={1.5} className="text-mocha-600" />
                  2. Delivery Address
                </h2>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.firstName}
                      onChange={(e) => setAddress((a) => ({ ...a, firstName: e.target.value }))}
                      placeholder="Priya"
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.lastName}
                      onChange={(e) => setAddress((a) => ({ ...a, lastName: e.target.value }))}
                      placeholder="Sharma"
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                    />
                  </div>
                </div>

                {/* International Country Select */}
                {region === 'international' && (
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      Country / Territory *
                    </label>
                    <div className="relative">
                      <select
                        value={address.country}
                        onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors appearance-none cursor-pointer"
                      >
                        {INTERNATIONAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-mocha-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Street Address */}
                <div>
                  <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                    placeholder="House No., Street Name, Landmark"
                    className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                  />
                </div>

                {/* Apartment / Suite */}
                <div>
                  <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => setAddress((a) => ({ ...a, apartment: e.target.value }))}
                    placeholder="Flat 4B, 2nd Floor"
                    className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                  />
                </div>

                {/* City, State & PIN / Zip Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      placeholder={region === 'domestic' ? 'Mumbai' : 'New York'}
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      {region === 'domestic' ? 'State *' : 'State / Region *'}
                    </label>
                    {region === 'domestic' ? (
                      <div className="relative">
                        <select
                          required
                          value={address.state}
                          onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                          className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-mocha-400 pointer-events-none" />
                      </div>
                    ) : (
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                        placeholder="NY / London"
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      {region === 'domestic' ? 'PIN Code *' : 'ZIP / Postal Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                      placeholder={region === 'domestic' ? '400001' : '10001'}
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                    Phone Number (for Courier Tracking Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                    placeholder={region === 'domestic' ? '+91 98765 43210' : '+1 (555) 000-0000'}
                    className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white border border-mocha-200 p-6 rounded-lg shadow-sm space-y-6">
                <h2 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-900 mb-2 flex items-center gap-2">
                  <CreditCard size={16} strokeWidth={1.5} className="text-mocha-600" />
                  3. Payment Method
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'upi', label: 'UPI / GPay / PhonePe' },
                    { id: 'netbanking', label: 'Net Banking' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayment(m.id as PaymentMethod)}
                      className={`p-3 rounded border text-left font-cinzel text-xs tracking-wider transition-all ${
                        payment === m.id
                          ? 'border-mocha-900 bg-mocha-50 text-mocha-900 font-semibold'
                          : 'border-mocha-200 text-mocha-600 hover:border-mocha-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Card Fields */}
                {payment === 'card' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8920"
                        value={card.number}
                        onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="08/28"
                          value={card.expiry}
                          onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                          className="w-full border-0 border-b border-mocha-300 bg-transparent py-2 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                        />
                      </div>
                      <div>
                        <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={card.cvv}
                          onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                          className="w-full border-0 border-b border-mocha-300 bg-transparent py-2 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-mocha-50/80 border border-mocha-200 p-6 rounded-lg sticky top-28 space-y-6">
                <h2 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-900 border-b border-mocha-200 pb-3">
                  Order Summary ({items.length})
                </h2>

                {/* Items preview */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-18 object-cover rounded border border-mocha-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-sm text-mocha-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="font-cinzel text-[9px] text-mocha-400 uppercase">
                          Qty: {item.quantity} · {item.product.motif} Motif
                        </p>
                        <p className="font-lora text-xs font-semibold text-mocha-800 mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-mocha-200 pt-4 text-xs font-lora text-mocha-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-mocha-900">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>
                      Shipping ({region === 'domestic' ? 'India' : 'International DHL/FedEx'})
                    </span>
                    <span className="font-semibold text-mocha-900">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-700 font-medium">Free</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-mocha-200 pt-3 text-base">
                    <span className="font-cinzel text-xs tracking-widest text-mocha-900 uppercase font-bold">
                      Total
                    </span>
                    <span className="font-playfair font-bold text-mocha-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Complete Order CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-mocha-900 text-gold-200 font-cinzel text-xs tracking-[0.25em] uppercase hover:bg-mocha-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  {submitting ? 'Processing Order...' : `Place Order — ${formatPrice(total)}`}
                </button>

                <div className="flex items-center justify-center gap-2 text-mocha-400 font-cinzel text-[9px] tracking-[0.15em] uppercase">
                  <ShieldCheck size={14} className="text-emerald-700" /> 256-Bit SSL Encrypted Luxury Checkout
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
