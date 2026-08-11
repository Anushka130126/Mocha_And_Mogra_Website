import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not configured on Vercel');
      return res.status(200).json({ status: 'ignored' });
    }

    if (!signature) {
      return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
    }

    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // SECURITY: Verify webhook authenticity using RAZORPAY_WEBHOOK_SECRET
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Critical Security Warning: Invalid Webhook Signature Detected!');
      return res.status(400).json({ error: 'Invalid Webhook Signature' });
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    switch (payload.event) {
      case 'order.paid':
        console.log(`Order Paid Webhook verified: ${payload.payload?.order?.entity?.id}`);
        break;
      case 'payment.failed':
        console.log(`Payment Failed Webhook: ${payload.payload?.payment?.entity?.id}`);
        break;
      default:
        console.log(`Unhandled webhook event: ${payload.event}`);
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
