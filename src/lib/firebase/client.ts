import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

function ensureClient() {
	if (typeof window === 'undefined') {
		throw new Error('Firebase client SDK should only be used on the client.');
	}
}

export const firebaseApp = (() => {
	if (typeof window === 'undefined') {
		// During SSR/build, return a dummy object to avoid initializing
		return (undefined as unknown) as ReturnType<typeof initializeApp>;
	}
	return getApps().length ? getApp() : initializeApp(firebaseConfig);
})();

export const firebaseAuth = (() => {
	if (typeof window === 'undefined') return (undefined as any);
	return getAuth(firebaseApp);
})();
export const firestoreDb = (() => {
	if (typeof window === 'undefined') return (undefined as any);
	return getFirestore(firebaseApp);
})();
export const firebaseStorage = (() => {
	if (typeof window === 'undefined') return (undefined as any);
	return getStorage(firebaseApp);
})();