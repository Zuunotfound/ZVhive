"use client";
import { useEffect, useState } from 'react';
import AdminGate from '@/components/AdminGate';

type UserRecord = { uid: string; email?: string; displayName?: string; disabled?: boolean; customClaims?: any };

export default function AdminUsersPage() {
	return (
		<AdminGate>
			<UsersManager />
		</AdminGate>
	);
}

function UsersManager() {
	const [users, setUsers] = useState<UserRecord[]>([]);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function refresh() {
		const res = await fetch('/api/admin/users/list');
		const data = await res.json();
		setUsers(data.users ?? []);
	}
	useEffect(() => { refresh(); }, []);

	async function createUser() {
		setLoading(true);
		await fetch('/api/admin/users/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
		setEmail(''); setPassword('');
		await refresh();
		setLoading(false);
	}
	async function del(uid: string) {
		setLoading(true);
		await fetch('/api/admin/users/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ uid }) });
		await refresh();
		setLoading(false);
	}
	async function setFlag(uid: string, field: string, value: boolean) {
		setLoading(true);
		await fetch('/api/admin/users/flags', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ uid, field, value }) });
		await refresh();
		setLoading(false);
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Users</h2>
			<div className="flex gap-2">
				<input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md bg-white/10 border border-white/10 px-3 py-2" />
				<input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md bg-white/10 border border-white/10 px-3 py-2" />
				<button onClick={createUser} disabled={loading} className="px-3 py-2 rounded-md bg-brand-500 hover:bg-brand-400">Tambah</button>
			</div>
			<div className="rounded-lg border border-white/10 divide-y divide-white/10">
				{users.map((u) => (
					<div key={u.uid} className="p-3 flex items-center gap-3 text-sm">
						<div className="flex-1">
							<div className="font-medium">{u.displayName || u.email || u.uid}</div>
							<div className="text-white/50">{u.uid}</div>
						</div>
						<button onClick={() => setFlag(u.uid, 'isVerified', true)} className="px-2 py-1 rounded bg-white/10">Verify</button>
						<button onClick={() => setFlag(u.uid, 'isBlocked', true)} className="px-2 py-1 rounded bg-white/10">Block</button>
						<button onClick={() => del(u.uid)} className="px-2 py-1 rounded bg-red-600/80">Delete</button>
					</div>
				))}
			</div>
		</div>
	);
}