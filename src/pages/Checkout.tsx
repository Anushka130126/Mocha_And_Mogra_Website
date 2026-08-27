import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, Truck, ChevronDown, Check, Globe, ArrowRight } from 'lucide-react';
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

type Step = 'address' | 'shipping' | 'payment';
type DeliveryRegion = 'domestic' | 'international';
type PaymentMethod = 'card' | 'upi' | 'netbanking';
type ShippingMethod = 'standard' | 'express';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { currency, formatPrice, usdRate } = useCurrency();

  const [activeStep, setActiveStep] = useState<Step>('address');
  const [region, setRegion] = useState<DeliveryRegion>(() =>
    currency === 'USD' ? 'international' : 'domestic'
  );
  
  const [shipping, setShipping] = useState<ShippingMethod>('standard');
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  useEffect(() => {
    if (currency === 'USD') setRegion('international');
    else setRegion('domestic');
  }, [currency]);

  // Shipping logic
  const isFreeShipping = region === 'domestic'
    ? subtotal >= 5000
    : (currency === 'USD' ? subtotal >= 200 : subtotal >= 16000);

  const expressCost = currency === 'USD' ? 25 * usdRate : 500;
  const shippingCost = shipping === 'express' ? expressCost : (isFreeShipping ? 0 : (region === 'domestic' ? 500 : (currency === 'USD' ? 25 * usdRate : 2000)));
  const total = subtotal + shippingCost;

  const stepOrder: Step[] = ['address', 'shipping', 'payment'];
  const currentStepIndex = stepOrder.indexOf(activeStep);

  const handlePlaceOrder = async () => {
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
    <div className="pt-24 pb-20 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-mocha-500 mb-2">
            Luxury Checkout
          </p>
          <h1 className="font-cinzel text-3xl md:text-4xl tracking-widest text-mocha-900 uppercase">
            Checkout
          </h1>
        </div>

        {/* 3 Step Accordion Indicator Bar */}
        <div className="flex items-center justify-center mb-12">
          {[
            { id: 'address', label: '1. Address' },
            { id: 'shipping', label: '2. Shipping' },
            { id: 'payment', label: '3. Payment' },
          ].map((step, i) => {
            const isDone = stepOrder.indexOf(step.id as Step) < currentStepIndex;
            const isActive = step.id === activeStep;
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (isDone || isActive) setActiveStep(step.id as Step);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                    isDone
                      ? 'bg-mocha-900 border-mocha-900 text-gold-200 shadow-sm'
                      : isActive
                      ? 'bg-mocha-800 border-mocha-800 text-gold-200 shadow-sm'
                      : 'border-mocha-200 text-mocha-400 bg-mocha-50/50'
                  }`}
                >
                  <span className="font-cinzel text-xs tracking-wider uppercase font-medium">
                    {step.label}
                  </span>
                  {isDone && <Check size={13} strokeWidth={2.5} />}
                </button>
                {i < 2 && (
                  <div
                    className={`w-12 sm:w-20 h-px mx-2 transition-colors ${
                      stepOrder.indexOf(stepOrder[i + 1]) <= currentStepIndex
                        ? 'bg-mocha-800'
                        : 'bg-mocha-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Accordion Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: ADDRESS */}
            <div className="border border-mocha-200/80 bg-[#FAF7F2] p-6 sm:p-8 rounded-lg shadow-sm">
              <div
                onClick={() => setActiveStep('address')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs ${
                    activeStep === 'address' ? 'bg-mocha-900 text-gold-200' : 'bg-mocha-100 text-mocha-600'
                  }`}>
                    1
                  </div>
                  <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-mocha-900 font-semibold">
                    Shipping Address
                  </h2>
                </div>
                {currentStepIndex > 0 && (
                  <span className="font-cinzel text-[10px] tracking-widest text-mocha-500 uppercase underline">
                    Edit
                  </span>
                )}
              </div>

              {activeStep === 'address' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-mocha-200/60 space-y-6"
                >
                  {/* Region Switcher Tab inside Step 1 */}
                  <div className="mb-6">
                    <label className="block font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-500 mb-2">
                      Select Delivery Destination
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegion('domestic')}
                        className={`py-3 px-4 rounded font-cinzel text-xs tracking-wider uppercase border transition-all ${
                          region === 'domestic'
                            ? 'border-mocha-900 bg-mocha-900 text-gold-200 shadow-sm'
                            : 'border-mocha-300 text-mocha-600 hover:border-mocha-500'
                        }`}
                      >
                        🇮🇳 India (Domestic)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegion('international')}
                        className={`py-3 px-4 rounded font-cinzel text-xs tracking-wider uppercase border transition-all ${
                          region === 'international'
                            ? 'border-mocha-900 bg-mocha-900 text-gold-200 shadow-sm'
                            : 'border-mocha-300 text-mocha-600 hover:border-mocha-500'
                        }`}
                      >
                        🌐 International
                      </button>
                    </div>
                  </div>

                  {/* Name Fields: First, Middle (Optional), Last */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.firstName}
                        onChange={(e) => setAddress((a) => ({ ...a, firstName: e.target.value }))}
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                      />
                    </div>
                    <div>
                      <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                        Middle Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.middleName}
                        onChange={(e) => setAddress((a) => ({ ...a, middleName: e.target.value }))}
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
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
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
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
                          className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 appearance-none cursor-pointer"
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

                  {/* Street & Apartment */}
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.apartment}
                      onChange={(e) => setAddress((a) => ({ ...a, apartment: e.target.value }))}
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                    />
                  </div>

                  {/* City, State & PIN/ZIP */}
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
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
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
                            className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800 appearance-none cursor-pointer"
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
                          className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
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
                        className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1.5">
                      Phone Number (for Courier Tracking) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                      className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                    />
                  </div>

                  {/* Billing address same as shipping address checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={sameBillingAddress}
                        onChange={(e) => setSameBillingAddress(e.target.checked)}
                        className="w-4 h-4 accent-mocha-800 cursor-pointer"
                      />
                      <span className="font-lora text-xs text-mocha-700">
                        Billing address is the same as shipping address
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep('shipping')}
                      className="w-full py-3.5 bg-mocha-900 text-gold-200 font-cinzel text-xs tracking-[0.2em] uppercase hover:bg-mocha-800 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      Continue to Shipping <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* STEP 2: SHIPPING METHOD */}
            <div className="border border-mocha-200/80 bg-[#FAF7F2] p-6 sm:p-8 rounded-lg shadow-sm">
              <div
                onClick={() => {
                  if (currentStepIndex >= 1) setActiveStep('shipping');
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs ${
                    activeStep === 'shipping' ? 'bg-mocha-900 text-gold-200' : 'bg-mocha-100 text-mocha-600'
                  }`}>
                    2
                  </div>
                  <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-mocha-900 font-semibold">
                    Shipping Method
                  </h2>
                </div>
                {currentStepIndex > 1 && (
                  <span className="font-cinzel text-[10px] tracking-widest text-mocha-500 uppercase underline">
                    Edit
                  </span>
                )}
              </div>

              {activeStep === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-mocha-200/60 space-y-4"
                >
                  <div
                    onClick={() => setShipping('standard')}
                    className={`p-4 rounded-md border cursor-pointer flex items-center justify-between transition-all ${
                      shipping === 'standard'
                        ? 'border-mocha-900 bg-mocha-50/80 shadow-sm'
                        : 'border-mocha-200 hover:border-mocha-400'
                    }`}
                  >
                    <div>
                      <p className="font-cinzel text-xs tracking-wider uppercase font-semibold text-mocha-900">
                        Standard Insured Delivery
                      </p>
                      <p className="font-lora text-xs text-mocha-500 mt-0.5">
                        {region === 'domestic' ? '3–5 Business Days across India' : '5–8 Business Days via DHL/FedEx'}
                      </p>
                    </div>
                    <span className="font-lora text-sm font-semibold text-mocha-900">
                      {isFreeShipping ? 'Free' : formatPrice(region === 'domestic' ? 500 : (currency === 'USD' ? 25 * usdRate : 2000))}
                    </span>
                  </div>

                  <div
                    onClick={() => setShipping('express')}
                    className={`p-4 rounded-md border cursor-pointer flex items-center justify-between transition-all ${
                      shipping === 'express'
                        ? 'border-mocha-900 bg-mocha-50/80 shadow-sm'
                        : 'border-mocha-200 hover:border-mocha-400'
                    }`}
                  >
                    <div>
                      <p className="font-cinzel text-xs tracking-wider uppercase font-semibold text-mocha-900">
                        Priority Air Express
                      </p>
                      <p className="font-lora text-xs text-mocha-500 mt-0.5">
                        {region === 'domestic' ? '1–2 Business Days' : '3–4 Business Days Priority Courier'}
                      </p>
                    </div>
                    <span className="font-lora text-sm font-semibold text-mocha-900">
                      {formatPrice(expressCost)}
                    </span>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep('payment')}
                      className="w-full py-3.5 bg-mocha-900 text-gold-200 font-cinzel text-xs tracking-[0.2em] uppercase hover:bg-mocha-800 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="border border-mocha-200/80 bg-[#FAF7F2] p-6 sm:p-8 rounded-lg shadow-sm">
              <div
                onClick={() => {
                  if (currentStepIndex >= 2) setActiveStep('payment');
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs ${
                    activeStep === 'payment' ? 'bg-mocha-900 text-gold-200' : 'bg-mocha-100 text-mocha-600'
                  }`}>
                    3
                  </div>
                  <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-mocha-900 font-semibold">
                    Payment Method
                  </h2>
                </div>
              </div>

              {activeStep === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-mocha-200/60 space-y-6"
                >
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
                            ? 'border-mocha-900 bg-mocha-900 text-gold-200 font-semibold shadow-sm'
                            : 'border-mocha-300 text-mocha-700 hover:border-mocha-500 bg-mocha-50/50'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Card Form */}
                  {payment === 'card' && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={card.number}
                          onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                          className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={card.expiry}
                            onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                            className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                          />
                        </div>
                        <div>
                          <label className="block font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={card.cvv}
                            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                            className="w-full border-0 border-b border-mocha-300 bg-transparent py-2.5 text-mocha-900 font-lora text-sm focus:outline-none focus:border-mocha-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="w-full py-4 bg-mocha-900 text-gold-200 font-cinzel text-xs tracking-[0.25em] uppercase hover:bg-mocha-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Processing Order...' : `Place Order — ${formatPrice(total)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Right Order Summary Column (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF7F2] border border-mocha-200/80 p-6 rounded-lg sticky top-28 space-y-6 shadow-sm">
              <h2 className="font-cinzel text-xs tracking-[0.25em] uppercase text-mocha-900 border-b border-mocha-200 pb-3">
                Order Summary ({items.length})
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-18 object-cover rounded border border-mocha-200 flex-shrink-0 bg-mocha-50"
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

              <div className="space-y-3 border-t border-mocha-200 pt-4 text-xs font-lora text-mocha-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-mocha-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Shipping ({region === 'domestic' ? 'India' : 'International DHL/FedEx'})</span>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
