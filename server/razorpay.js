import crypto from 'crypto';
import Razorpay from 'razorpay';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are missing');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

/**
 * Handle POST /api/create-order
 * Request body: { amount: number (in paise), currency?: string, receipt?: string }
 */
export async function createOrderHandler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = body;

    // Validate minimum amount (100 paise = 1 INR)
    if (typeof amount !== 'number' || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Minimum amount is 100 paise (₹1).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    });

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Razorpay Create Order Error:', err);
    if (err.message && err.message.includes('credentials')) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: err.error?.description || err.message || 'Failed to create Razorpay order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle POST /api/verify-payment
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function verifyPaymentHandler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment verification parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return new Response(
        JSON.stringify({ error: 'RAZORPAY_KEY_SECRET environment variable is missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // HMAC-SHA256 signature generation: order_id + "|" + payment_id
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid payment signature' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Razorpay Verify Payment Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Payment verification failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
