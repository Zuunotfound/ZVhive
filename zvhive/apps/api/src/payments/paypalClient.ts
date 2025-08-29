import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal environment variables');
  }
  return mode === 'live'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

export function getPayPalClient() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

