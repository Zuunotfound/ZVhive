import paypal from '@paypal/checkout-server-sdk';

function getPayPalEnv() {
	const clientId = process.env.PAYPAL_CLIENT_ID;
	const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
	if (!clientId || !clientSecret) throw new Error('Missing PayPal env');
	const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
	return new paypal.core.PayPalHttpClient(environment);
}

export async function createOrder(total: string, currency = 'USD') {
	const request = new paypal.orders.OrdersCreateRequest();
	request.prefer('return=representation');
	request.requestBody({
		intent: 'CAPTURE',
		purchase_units: [
			{
				amount: { currency_code: currency, value: total },
			},
		],
	});
	const client = getPayPalEnv();
	const response = await client.execute(request);
	return response.result;
}

export async function captureOrder(orderId: string) {
	const request = new paypal.orders.OrdersCaptureRequest(orderId);
	request.requestBody({});
	const client = getPayPalEnv();
	const response = await client.execute(request);
	return response.result;
}