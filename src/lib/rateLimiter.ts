import { adminDb } from './firebase/admin';

function getYearMonth(now = new Date()): string {
	const y = now.getUTCFullYear();
	const m = String(now.getUTCMonth() + 1).padStart(2, '0');
	return `${y}-${m}`;
}

function getYearMonthDay(now = new Date()): string {
	const y = now.getUTCFullYear();
	const m = String(now.getUTCMonth() + 1).padStart(2, '0');
	const d = String(now.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

async function resolveMonthlyLimitForUser(userId: string | null): Promise<number> {
	const defaultLimit = Number(process.env.FREE_PLAN_MONTHLY_LIMIT ?? 1500);
	if (!userId) return defaultLimit;
	const db = adminDb();
	const planRef = db.collection('plans').doc(userId);
	const planSnap = await planRef.get();
	if (!planSnap.exists) return defaultLimit;
	const data = planSnap.data() as { limitMonthly?: number };
	return data?.limitMonthly ?? defaultLimit;
}

export async function checkAndIncrementApiUsage(identifier: string | null, now = new Date()): Promise<{ allowed: boolean; remaining: number; used: number; limit: number; }>{
	const userKey = identifier ?? 'anonymous';
	const yearMonth = getYearMonth(now);
	const db = adminDb();
	const usageRef = db.collection('usage').doc(yearMonth).collection('users').doc(userKey);
	const limit = await resolveMonthlyLimitForUser(identifier);
	const res = await db.runTransaction(async (tx) => {
		const snap = await tx.get(usageRef);
		const used = (snap.exists ? (snap.data()?.count as number) : 0) + 1;
		const allowed = used <= limit;
		tx.set(usageRef, { count: allowed ? used : used - 1, updatedAt: new Date() }, { merge: true });
		return { allowed, used: allowed ? used : used - 1 };
	});
	return { allowed: res.allowed, remaining: Math.max(0, limit - res.used), used: res.used, limit };
}

export async function canReportBugOncePerDay(identifier: string | null, now = new Date()): Promise<{ allowed: boolean }>{
	const userKey = identifier ?? 'anonymous';
	const ymd = getYearMonthDay(now);
	const db = adminDb();
	const ref = db.collection('bugReports').doc(`${userKey}:${ymd}`);
	const snap = await ref.get();
	if (snap.exists) return { allowed: false };
	await ref.set({ createdAt: new Date() });
	return { allowed: true };
}