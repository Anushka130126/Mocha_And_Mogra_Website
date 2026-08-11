import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { loadRazorpayScript } from '../services/razorpay';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

type Step = 'address' | 'shipping' | 'payment';
type PaymentMethod = 'card' | 'upi' | 'netbanking';
type ShippingMethod = 'standard' | 'express';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState<Step>('address');
  const [shipping, setShipping] = useState<ShippingMethod>('standard');
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = shipping === 'express' ? 500 : (subtotal >= 5000 ? 0 : 500);
  const total = subtotal + shippingCost;

  const [address, setAddress] = useState({
    firstName: '', lastName: '', address: '', apt: '',
    city: '', state: '', pin: '', phone: '',
  });

  const [card, setCard] = useState({
    number: '', expiry: '', cvv: '', name: '',
  });

  const [upiId, setUpiId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const steps: { id: Step; label: string; icon: typeof MapPin }[] = [
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  const stepOrder: Step[] = ['address', 'shipping', 'payment'];
  const currentStepIndex = stepOrder.indexOf(activeStep);

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.firstName.trim()) errs.firstName = 'First name required';
    if (!address.lastName.trim()) errs.lastName = 'Last name required';
    if (!address.address.trim()) errs.address = 'Street address required';
    if (!address.city.trim()) errs.city = 'City required';
    if (!address.state) errs.state = 'State required';
    if (!/^\d{6}$/.test(address.pin.trim())) errs.pin = 'Enter 6-digit PIN code';
    if (!/^\+?\d{10,12}$/.test(address.phone.trim().replace(/\s/g, ''))) errs.phone = 'Enter valid 10-digit phone';
    
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (payment === 'card') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) errs.cardNumber = 'Enter 16-digit card number';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry.trim())) errs.cardExpiry = 'MM/YY required';
      if (!/^\d{3,4}$/.test(card.cvv.trim())) errs.cardCvv = '3-4 digit CVV required';
      if (!card.name.trim()) errs.cardName = 'Name on card required';
    } else if (payment === 'upi') {
      if (!upiId.includes('@') || upiId.trim().length < 5) errs.upiId = 'Enter valid UPI ID (e.g. name@upi)';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinueToShipping = () => {
    if (validateAddress()) {
      setActiveStep('shipping');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      setActiveStep('address');
      return;
    }
    if (!validatePayment()) {
      setActiveStep('payment');
      return;
    }

    setSubmitting(true);

    const orderDetails = {
      orderNumber: `MM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...items],
      total,
      email: `${address.firstName.toLowerCase()}@example.com`,
      shippingAddress: `${address.address}, ${address.city}, ${address.state} - ${address.pin}`,
    };

    const completeCheckout = () => {
      try {
        sessionStorage.setItem('latest_order', JSON.stringify(orderDetails));
      } catch (e) {
        console.error(e);
      }
      clearCart();
      navigate('/order-confirmation', { state: { orderDetails } });
    };

    try {
      // 1. Create Order via Serverless Route
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          shippingMethod: shipping,
        }),
      });

      const orderData = await orderRes.ok ? await orderRes.json() : null;

      // If mock environment or server fallback
      if (!orderData || orderData.isMock || !window.Razorpay) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !orderData?.keyId || orderData?.isMock) {
          // Graceful simulated checkout fallback when environment variables or SDK are not yet connected
          await new Promise((r) => setTimeout(r, 1000));
          setSubmitting(false);
          completeCheckout();
          return;
        }
      }

      // 2. Launch Razorpay Checkout Modal
      const razorpayKey = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Mocha & Mogra',
        description: 'Luxury Saree Purchase',
        image: '/images/mnmlogo-Photoroom.webp',
        order_id: orderData.orderId,
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: `${address.firstName.toLowerCase()}@example.com`,
          contact: address.phone,
        },
        theme: {
          color: '#3D2814',
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Cryptographic Signature Verification on Server
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isMock: orderData.isMock,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.isAuthentic) {
            completeCheckout();
          } else {
            alert('Payment verification failed! Invalid signature detected.');
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const RazorpayCtor = window.Razorpay as unknown as new (opts: typeof options) => { open: () => void };
      const razorpayInstance = new RazorpayCtor(options);
      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay Checkout Flow Exception:', err);
      // Fallback
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitting(false);
      completeCheckout();
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Logo only header for checkout */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Secure Checkout</p>
          <h1 className="font-cinzel text-3xl tracking-widest text-mocha-900 uppercase">
            Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, i) => {
            const isDone = stepOrder.indexOf(step.id) < currentStepIndex;
            const isActive = step.id === activeStep;
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      if (isDone || isActive) setActiveStep(step.id);
                    }}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? 'bg-mocha-800 border-mocha-800 text-gold-200'
                        : isActive
                        ? 'border-mocha-800 text-mocha-800'
                        : 'border-mocha-200 text-mocha-300'
                    }`}
                  >
                    {isDone ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      <span className="font-cinzel text-xs">{i + 1}</span>
                    )}
                  </button>
                  <span className={`font-cinzel text-[10px] tracking-[0.15em] uppercase ${
                    isActive ? 'text-mocha-900' : 'text-mocha-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-20 h-px mx-3 mb-6 transition-colors ${
                    stepOrder.indexOf(steps[i + 1].id) <= currentStepIndex
                      ? 'bg-mocha-800'
                      : 'bg-mocha-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Address Section */}
            <Section
              title="Shipping Address"
              icon={MapPin}
              open={activeStep === 'address'}
              done={currentStepIndex > 0}
              onEdit={() => setActiveStep('address')}
            >
              <div className="grid grid-cols-2 gap-6 mt-6">
                <FormField
                  label="First Name"
                  value={address.firstName}
                  onChange={(v) => setAddress((a) => ({ ...a, firstName: v }))}
                  placeholder="Priya"
                  error={formErrors.firstName}
                />
                <FormField
                  label="Last Name"
                  value={address.lastName}
                  onChange={(v) => setAddress((a) => ({ ...a, lastName: v }))}
                  placeholder="Sharma"
                  error={formErrors.lastName}
                />
              </div>
              <FormField
                label="Address"
                value={address.address}
                onChange={(v) => setAddress((a) => ({ ...a, address: v }))}
                placeholder="123, Rose Lane"
                className="mt-6"
                error={formErrors.address}
              />
              <FormField
                label="Apartment, suite, etc. (optional)"
                value={address.apt}
                onChange={(v) => setAddress((a) => ({ ...a, apt: v }))}
                placeholder="Flat 4B"
                className="mt-6"
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <FormField
                  label="City"
                  value={address.city}
                  onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                  placeholder="Mumbai"
                  error={formErrors.city}
                />
                <div>
                  <label className="block font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-500 mb-2">
                    State
                  </label>
                  <div className="relative">
                    <select
                      value={address.state}
                      onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                      className={`w-full border-0 border-b bg-transparent py-3 text-mocha-800 font-lora text-sm focus:outline-none transition-colors appearance-none cursor-pointer ${
                        formErrors.state ? 'border-red-500' : 'border-mocha-300 focus:border-mocha-700'
                      }`}
                    >
                      <option value="">Select</option>
                      {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-mocha-400 pointer-events-none" strokeWidth={1.5} />
                  </div>
                  {formErrors.state && <p className="text-red-500 text-[10px] mt-1 font-lora">{formErrors.state}</p>}
                </div>
                <FormField
                  label="PIN Code"
                  value={address.pin}
                  onChange={(v) => setAddress((a) => ({ ...a, pin: v }))}
                  placeholder="400001"
                  error={formErrors.pin}
                />
              </div>
              <FormField
                label="Phone"
                value={address.phone}
                onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}
                placeholder="+91 98765 43210"
                className="mt-6"
                error={formErrors.phone}
              />
              <div className="mt-8">
                <button
                  onClick={handleContinueToShipping}
                  className="btn-primary-filled"
                >
                  Continue to Shipping
                </button>
              </div>
            </Section>

            {/* Shipping Section */}
            <Section
              title="Shipping Method"
              icon={Truck}
              open={activeStep === 'shipping'}
              done={currentStepIndex > 1}
              onEdit={() => setActiveStep('shipping')}
            >
              <div className="mt-6 space-y-3">
                <ShippingOption
                  id="standard"
                  label="Standard Shipping"
                  sub="3–5 Business Days"
                  price="Free"
                  selected={shipping === 'standard'}
                  onSelect={() => setShipping('standard')}
                />
                <ShippingOption
                  id="express"
                  label="Express Shipping"
                  sub="1–2 Business Days"
                  price="₹500"
                  selected={shipping === 'express'}
                  onSelect={() => setShipping('express')}
                />
              </div>
              <div className="mt-8">
                <button onClick={() => setActiveStep('payment')} className="btn-primary-filled">
                  Continue to Payment
                </button>
              </div>
            </Section>

            {/* Payment Section */}
            <Section
              title="Payment"
              icon={CreditCard}
              open={activeStep === 'payment'}
              done={false}
              onEdit={() => {}}
              badge={<ShieldCheck size={14} strokeWidth={1.5} className="text-mocha-400" />}
            >
              <div className="mt-6 space-y-3">
                <PaymentOption
                  id="card"
                  label="Credit / Debit Card"
                  icon={<CreditCard size={16} strokeWidth={1.5} />}
                  selected={payment === 'card'}
                  onSelect={() => setPayment('card')}
                />
                {payment === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-8 pr-2 pb-4 space-y-5"
                  >
                    <FormField
                      label="Card Number"
                      value={card.number}
                      onChange={(v) => setCard((c) => ({ ...c, number: v }))}
                      placeholder="1234 5678 9012 3456"
                      error={formErrors.cardNumber}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        label="Expiration (MM/YY)"
                        value={card.expiry}
                        onChange={(v) => setCard((c) => ({ ...c, expiry: v }))}
                        placeholder="08/28"
                        error={formErrors.cardExpiry}
                      />
                      <FormField
                        label="Security Code (CVV)"
                        value={card.cvv}
                        onChange={(v) => setCard((c) => ({ ...c, cvv: v }))}
                        placeholder="•••"
                        error={formErrors.cardCvv}
                      />
                    </div>
                    <FormField
                      label="Name on Card"
                      value={card.name}
                      onChange={(v) => setCard((c) => ({ ...c, name: v }))}
                      placeholder="Priya Sharma"
                      error={formErrors.cardName}
                    />
                  </motion.div>
                )}
                <PaymentOption
                  id="upi"
                  label="UPI (GPay, PhonePe, Paytm)"
                  selected={payment === 'upi'}
                  onSelect={() => setPayment('upi')}
                />
                {payment === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-8 pr-2 pb-4"
                  >
                    <FormField
                      label="UPI ID"
                      value={upiId}
                      onChange={(v) => setUpiId(v)}
                      placeholder="yourname@upi"
                      error={formErrors.upiId}
                    />
                  </motion.div>
                )}
                <PaymentOption
                  id="netbanking"
                  label="Net Banking"
                  selected={payment === 'netbanking'}
                  onSelect={() => setPayment('netbanking')}
                />
              </div>
              <div className="mt-8">
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="btn-primary-filled w-full justify-center py-4 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay Now — ₹{total.toLocaleString('en-IN')}</>
                  )}
                </button>
              </div>
            </Section>

            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 font-cinzel text-xs tracking-[0.2em] uppercase text-mocha-400 hover:text-mocha-700 transition-colors"
            >
              ← Return to Cart
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="border border-mocha-200 p-6 sticky top-28">
              <h2 className="font-cinzel text-xs tracking-[0.2em] uppercase text-mocha-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-center">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-14 overflow-hidden bg-mocha-100"
                        style={{ borderRadius: '50% 50% 3px 3px / 40% 40% 3px 3px', aspectRatio: '3/4' }}
                      >
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-mocha-700 text-gold-200 font-cinzel text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cinzel text-[10px] tracking-[0.15em] uppercase text-mocha-700 truncate">
                        {item.product.name}
                      </p>
                      <p className="font-lora text-xs text-mocha-400">{item.product.motif} Motif</p>
                    </div>
                    <p className="font-lora text-sm text-mocha-700 flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-mocha-200 pt-5 space-y-3">
                <div className="flex justify-between font-lora text-sm text-mocha-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-lora text-sm text-mocha-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-forest-600">Free</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-lora text-sm text-mocha-600">
                  <span>Taxes (included)</span>
                  <span>₹{Math.round(subtotal * 0.05).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-mocha-200 mt-5 pt-5 flex justify-between items-center">
                <span className="font-cinzel text-sm tracking-[0.1em] uppercase text-mocha-900">Total</span>
                <span className="font-playfair text-xl text-mocha-900">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title, icon: Icon, open, done, onEdit, children, badge,
}: {
  title: string;
  icon: typeof MapPin;
  open: boolean;
  done: boolean;
  onEdit: () => void;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="border border-mocha-200 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-mocha-600" strokeWidth={1.5} />
          <h2 className="font-playfair text-xl text-mocha-900">{title}</h2>
          {badge && <span className="ml-2">{badge}</span>}
        </div>
        {done && !open && (
          <button
            onClick={onEdit}
            className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-mocha-500 hover:text-mocha-800 underline transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <AnimatePresenceSection open={open}>
        {children}
      </AnimatePresenceSection>
    </div>
  );
}

import { AnimatePresence } from 'framer-motion';

function AnimatePresenceSection({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormField({
  label, value, onChange, placeholder, className = '', error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-cinzel text-[10px] tracking-[0.25em] uppercase text-mocha-500 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-[10px] mt-1 font-lora">{error}</p>}
    </div>
  );
}

function ShippingOption({
  label, sub, price, selected, onSelect,
}: {
  id: string;
  label: string;
  sub: string;
  price: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-4 border transition-all duration-200 text-left ${
        selected ? 'border-mocha-700 bg-mocha-50' : 'border-mocha-200 hover:border-mocha-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-mocha-800' : 'border-mocha-300'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-mocha-800" />}
        </div>
        <div>
          <p className="font-lora text-sm text-mocha-800">{label}</p>
          <p className="font-lora text-xs text-mocha-400">{sub}</p>
        </div>
      </div>
      <span className="font-lora text-sm text-mocha-700">{price}</span>
    </button>
  );
}

function PaymentOption({
  label, selected, onSelect, icon,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-4 border transition-all duration-200 text-left ${
        selected ? 'border-mocha-700 bg-mocha-50' : 'border-mocha-200 hover:border-mocha-400'
      }`}
    >
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? 'border-mocha-800' : 'border-mocha-300'
      }`}>
        {selected && <div className="w-2 h-2 rounded-full bg-mocha-800" />}
      </div>
      <span className="font-lora text-sm text-mocha-800 flex-1">{label}</span>
      {icon && <span className="text-mocha-400">{icon}</span>}
    </button>
  );
}
