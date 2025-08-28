import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;

export function getAdminApp(): App {
	if (!adminApp) {
		const projectId = process.env.FIREBASE_PROJECT_ID;
		const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
		let privateKey = process.env.FIREBASE_PRIVATE_KEY;
		if (!projectId || !clientEmail || !privateKey) {
			throw new Error('Missing Firebase admin env vars');
		}
		// Support escaped newlines
		privateKey = privateKey.replace(/\\n/g, '\n');
		adminApp = getApps()[0] || initializeApp({
			credential: cert({ projectId, clientEmail, privateKey }),
		});
	}
	return adminApp!;
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());