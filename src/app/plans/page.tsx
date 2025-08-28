"use client";
import { useAuth } from '@/components/AuthProvider';
import AuthGate from '@/components/AuthGate';
import { firestoreDb } from '@/lib/firebase/client';
import { doc, setDoc } from 'firebase/firestore';

export default function PlansPage() {
	return (
		<AuthGate>
			<PlansContent />
		</AuthGate>
	);
}

function PlansContent() {
	const { user } = useAuth();
	async function upgrade(plan: { name: string; price: string; limitMonthly: number }) {
		// Create order via PayPal
		const res = await fetch('/api/payments/paypal/create-order', {
			method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ total: plan.price })
		});
		const order = await res.json();
		// NOTE: In real flow, redirect/approve in PayPal JS, then capture. Here we directly capture for demo.
		const cap = await fetch('/api/payments/paypal/capture-order', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ orderId: order.id }) });
		const capRes = await cap.json();
		if (!cap.ok) {
			alert('Payment failed');
			return;
		}
		// Store plan in Firestore for limiter
		await setDoc(doc(firestoreDb, 'plans', user!.uid), { plan: plan.name, limitMonthly: plan.limitMonthly, updatedAt: new Date() }, { merge: true });
		alert('Plan upgraded!');
	}
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Plans</h2>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card title="Free" price="Rp0" features={["1500 API/bulan", "Bug 1x/24h"]} ctaText="Aktif" onClick={undefined} />
				<Card title="Pro" price="$5" features={["100k API/bulan", "Prioritas dukungan"]} ctaText="Upgrade" onClick={() => upgrade({ name: 'Pro', price: '5.00', limitMonthly: 100000 })} />
				<Card title="Ultra" price="$15" features={["Tak terbatas*", "Dukungan premium"]} ctaText="Upgrade" onClick={() => upgrade({ name: 'Ultra', price: '15.00', limitMonthly: 100000000 })} />
			</div>
		</div>
	);
}

function Card({ title, price, features, ctaText, onClick }: { title: string; price: string; features: string[]; ctaText: string; onClick?: () => void; }) {
	return (
		<div className="rounded-xl border border-white/10 p-6 bg-white/5">
			<div className="flex items-baseline justify-between">
				<div className="text-lg font-semibold">{title}</div>
				<div className="text-2xl font-bold">{price}</div>
			</div>
			<ul className="mt-4 space-y-1 text-sm text-white/70">
				{features.map((f) => <li key={f}>• {f}</li>)}
			</ul>
			<button onClick={onClick} disabled={!onClick} className="mt-5 w-full px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400 disabled:opacity-60">{ctaText}</button>
		</div>
	);
}