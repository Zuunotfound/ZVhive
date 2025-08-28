import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { getPayPalClient } from '../payments/paypalClient';

const router = Router();

router.use(authenticateFirebaseToken);

router.post('/paypal/create-order', async (req, res) => {
  try {
    const { planId, amount, currency = 'USD' } = req.body || {};
    if (!amount) return res.status(400).json({ error: 'amount required' });
    const request: any = new (require('@paypal/checkout-server-sdk').orders.OrdersCreateRequest)();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: planId || 'plan',
          amount: { currency_code: currency, value: String(amount) },
        },
      ],
    });
    const response = await getPayPalClient().execute(request);
    res.json({ id: response.result.id, status: response.result.status });
  } catch (e) {
    res.status(500).json({ error: 'PayPal create order failed' });
  }
});

router.post('/paypal/capture-order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const request: any = new (require('@paypal/checkout-server-sdk').orders.OrdersCaptureRequest)(orderId);
    request.requestBody({});
    const response = await getPayPalClient().execute(request);
    res.json({ status: response.result.status, id: response.result.id });
  } catch (e) {
    res.status(500).json({ error: 'PayPal capture failed' });
  }
});

// Placeholder for domestic gateway "orkut"
router.post('/orkut/create-invoice', async (_req, res) => {
  res.json({ ok: true, message: 'Orkut gateway stubbed' });
});

export default router;

