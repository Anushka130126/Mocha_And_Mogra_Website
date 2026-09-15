import express from 'express';
import dotenv from 'dotenv';
import { createOrderHandler, verifyPaymentHandler } from './razorpay.js';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for local dev testing if required
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Express route wrapper for Request/Response handlers
const adaptHandler = (handler) => async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const webReq = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });

  try {
    const webRes = await handler(webReq);
    const data = await webRes.json();
    return res.status(webRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

app.post('/api/create-order', adaptHandler(createOrderHandler));
app.post('/api/verify-payment', adaptHandler(verifyPaymentHandler));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Razorpay API Server running at http://localhost:${PORT}`);
});
