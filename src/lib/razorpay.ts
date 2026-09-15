declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  order_id?: string;
  payment_id?: string;
}

export interface RazorpayCheckoutOptions {
  amount: number; // in INR
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (response: VerifyPaymentResponse) => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Dynamically load Razorpay checkout script if not already loaded
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiate Razorpay payment flow:
 * 1. Calls backend /api/create-order
 * 2. Opens Razorpay modal with order_id
 * 3. On payment success, verifies signature via /api/verify-payment
 */
export const initiateRazorpayPayment = async (options: RazorpayCheckoutOptions): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    options.onError?.('Failed to load Razorpay SDK. Please check your internet connection.');
    return;
  }

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!keyId) {
    options.onError?.('Razorpay is not configured. Please contact support.');
    return;
  }
  const amountInPaise = Math.round(options.amount * 100);

  if (amountInPaise < 100) {
    options.onError?.('Minimum order amount for payment is ₹1.');
    return;
  }

  // STEP 1: Backend - Create Order
  let orderData: CreateOrderResponse;
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      throw new Error(errRes.error || `Server responded with status ${response.status}`);
    }

    orderData = await response.json();
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    options.onError?.(err.message || 'Unable to create payment order. Please try again.');
    return;
  }

  // STEP 2: STEP 2: FRONTEND - Checkout Modal Configuration
  const razorpayOptions = {
    key: keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: options.name || 'Mocha & Mogra',
    description: options.description || 'Stitched in Silk — Sarees & Luxury Couture',
    image: options.image || 'https://res.cloudinary.com/xtrw55ut/image/upload/v1724000000/mnmlogo.png',
    order_id: orderData.order_id,
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    theme: {
      color: '#4A2C2A', // Mocha luxury palette
    },
    handler: async (response: any) => {
      // STEP 3: BACKEND - Verify Signature
      try {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData: VerifyPaymentResponse = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          options.onSuccess?.(verifyData);
        } else {
          options.onError?.(verifyData.error || 'Payment signature verification failed.');
        }
      } catch (err: any) {
        console.error('Verification request error:', err);
        options.onError?.('Network error while verifying payment signature.');
      }
    },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
    },
  };

  const razorpayInstance = new window.Razorpay(razorpayOptions);

  razorpayInstance.on('payment.failed', (response: any) => {
    console.error('Razorpay Payment Failed:', response.error);
    const failureMsg = response.error?.description || response.error?.reason || 'Payment failed.';
    options.onError?.(failureMsg);
  });

  razorpayInstance.open();
};
