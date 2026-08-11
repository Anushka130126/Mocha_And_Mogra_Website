import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock } = req.body || {};

    if (isMock || (typeof razorpay_order_id === 'string' && razorpay_order_id.startsWith('order_mock_'))) {
      return res.status(200).json({
        isAuthentic: true,
        orderId: razorpay_order_id,
        message: 'Mock payment verified successfully',
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment signature verification parameters' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET is not configured on Vercel' });
    }

    // SECURITY: HMAC-SHA256 signature calculation: order_id + "|" + payment_id
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const signatureBuffer = Buffer.from(razorpay_signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    let isAuthentic = false;
    if (signatureBuffer.length === expectedBuffer.length) {
      isAuthentic = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    }

    if (isAuthentic) {
      return res.status(200).json({
        isAuthentic: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      console.error('Critical Security Warning: Razorpay Signature Mismatch Detected!');
      return res.status(400).json({
        isAuthentic: false,
        error: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Razorpay Payment Verification Error:', error);
    return res.status(500).json({ error: 'Payment verification failed internally' });
  }
}
