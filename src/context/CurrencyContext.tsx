import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'INR' | 'USD';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (inrAmount: number) => string;
  usdRate: number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// Approx conversion rate for now (1 USD = 83 INR)
const USD_RATE = 83;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');

  useEffect(() => {
    // Check saved preference first
    const saved = localStorage.getItem('currency') as Currency;
    if (saved === 'INR' || saved === 'USD') {
      setCurrency(saved);
      return;
    }

    // Auto-detect based on timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && !tz.toLowerCase().includes('kolkata')) {
        setCurrency('USD');
      } else {
        setCurrency('INR');
      }
    } catch (error) {
      setCurrency('INR');
    }
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('currency', c);
  };

  const formatPrice = (inrAmount: number) => {
    if (currency === 'USD') {
      const usdAmount = Math.round(inrAmount / USD_RATE);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(usdAmount);
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(inrAmount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice, usdRate: USD_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
