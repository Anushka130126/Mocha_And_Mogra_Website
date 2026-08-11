import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

const PRODUCTS: Record<number, { id: number; name: string; price: number }> = {
  1: { id: 1, name: 'JALPARIÉ', price: 9500 },
  2: { id: 2, name: 'ROSÉ MOGRA', price: 9500 },
  3: { id: 3, name: 'RIWAAYAT', price: 9500 },
  4: { id: 4, name: 'SUNDOWNER SILK', price: 9500 },
  5: { id: 5, name: 'RUBY DOE', price: 9500 },
  6: { id: 6, name: 'BUTTER MOGRA', price: 9500 },
  7: { id: 7, name: 'SAPPHIRE MOGRA', price: 9500 },
  8: { id: 8, name: 'CHAANDINI', price: 3500 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items, shippingMethod } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty items payload' });
    }

    // SECURITY: Always calculate the subtotal on the server using canonical catalog prices
    let calculatedSubtotal = 0;
    for (const item of items) {
      const productId = Number(item.product?.id || item.productId);
      const quantity = Math.max(1, Number(item.quantity || 1));
      const catalogProduct = PRODUCTS[productId];

      if (!catalogProduct) {
        return res.status(400).json({ error: `Invalid product ID: ${productId}` });
      }

      calculatedSubtotal += catalogProduct.price * quantity;
    }

    // Shipping cost calculation
    const shippingCost = shippingMethod === 'express' ? 500 : (calculatedSubtotal >= 5000 ? 0 : 500);
    const totalAmountINR = calculatedSubtotal + shippingCost;
    const amountInPaise = totalAmountINR * 100;

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      // Safe environment check: If environment variables are not configured yet, return fallback mock order payload
      const mockOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return res.status(200).json({
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: keyId || 'rzp_test_mock_key',
        isMock: true,
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_mm_${Date.now()}`,
      notes: {
        itemCount: String(items.length),
        calculatedSubtotal: String(calculatedSubtotal),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return res.status(500).json({ error: 'Failed to create order on server' });
  }
}
