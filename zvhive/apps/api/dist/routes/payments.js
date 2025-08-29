import { Router } from 'express';
import { authenticateFirebaseToken } from '../middleware/auth';
import { getFirestore } from '../lib/firebaseAdmin';
import { getPayPalClient } from '../payments/paypalClient';
const router = Router();
router.use(authenticateFirebaseToken);
router.post('/paypal/create-order', async (req, res) => {
    try {
        const { planId, amount, currency = 'USD' } = req.body || {};
        if (!amount)
            return res.status(400).json({ error: 'amount required' });
        const request = new (require('@paypal/checkout-server-sdk').orders.OrdersCreateRequest)();
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
    }
    catch (e) {
        res.status(500).json({ error: 'PayPal create order failed' });
    }
});
router.post('/paypal/capture-order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const request = new (require('@paypal/checkout-server-sdk').orders.OrdersCaptureRequest)(orderId);
        request.requestBody({});
        const response = await getPayPalClient().execute(request);
        if (response.result.status === 'COMPLETED') {
            const { plan = 'pro', durationMonths = 1 } = req.body || {};
            const uid = req.user.uid;
            const now = Date.now();
            const expires = now + durationMonths * 30 * 24 * 60 * 60 * 1000;
            await getFirestore().collection('accounts').doc(uid).set({ plan, planExpiresAt: expires, adsDisabled: plan !== 'free', updatedAt: now }, { merge: true });
        }
        res.json({ status: response.result.status, id: response.result.id });
    }
    catch (e) {
        res.status(500).json({ error: 'PayPal capture failed' });
    }
});
// Placeholder for domestic gateway "orkut"
router.post('/orkut/create-invoice', async (_req, res) => {
    res.json({ ok: true, message: 'Orkut gateway stubbed' });
});
// PayPal webhook stub (for future validation)
router.post('/paypal/webhook', async (req, res) => {
    // TODO: verify signature headers with PayPal SDK
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=payments.js.map