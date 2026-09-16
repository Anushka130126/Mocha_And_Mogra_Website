import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import Razorpay from 'razorpay';

// Razorpay dev middleware — handles /api/create-order and /api/verify-payment
// Runs inside Vite's Node.js process so env vars are available via process.env
function razorpayDevApiPlugin(env: Record<string, string>) {
  return {
    name: 'razorpay-dev-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';

        if (!url.startsWith('/api/create-order') && !url.startsWith('/api/verify-payment')) {
          return next();
        }

        let bodyData = '';
        req.on('data', (chunk: any) => { bodyData += chunk; });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');

          const key_id = env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID;
          const key_secret = env.RAZORPAY_KEY_SECRET;

          if (!key_id || !key_secret) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Razorpay credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are missing in .env file' }));
          }

          try {
            const body = bodyData ? JSON.parse(bodyData) : {};

            // ── /api/create-order ──────────────────────────────────
            if (url.startsWith('/api/create-order')) {
              const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = body;

              if (typeof amount !== 'number' || amount < 100) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid amount. Minimum is 100 paise (₹1).' }));
              }

              const razorpay = new Razorpay({ key_id, key_secret });
              const order = await razorpay.orders.create({ amount: Math.round(amount), currency, receipt });

              res.statusCode = 200;
              return res.end(JSON.stringify({
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
              }));
            }

            // ── /api/verify-payment ────────────────────────────────
            if (url.startsWith('/api/verify-payment')) {
              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

              if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Missing required payment verification parameters' }));
              }

              const generatedSignature = crypto
                .createHmac('sha256', key_secret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

              if (generatedSignature !== razorpay_signature) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, error: 'Invalid payment signature' }));
              }

              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                message: 'Payment verified successfully',
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
              }));
            }

          } catch (err: any) {
            console.error('[Razorpay Dev API]', err);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.error?.description || err.message || 'Internal Server Error' }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env file into env object available at config time (Node.js process level)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), razorpayDevApiPlugin(env)],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
