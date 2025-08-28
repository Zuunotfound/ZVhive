import admin from 'firebase-admin';
let appInitialized = false;
export function getFirebaseAdminApp() {
    if (!appInitialized) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (!projectId || !clientEmail || !privateKey) {
            throw new Error('Missing Firebase Admin environment variables');
        }
        // Support escaped newlines in env var
        privateKey = privateKey.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        appInitialized = true;
    }
    return admin.app();
}
export function getFirestore() {
    return getFirebaseAdminApp().firestore();
}
export function getAuth() {
    return getFirebaseAdminApp().auth();
}
//# sourceMappingURL=firebaseAdmin.js.map