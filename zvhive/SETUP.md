# ZVHive Setup (Keys & .env)

## Firebase Web (Client)
1. Firebase Console → Project → Project settings → Your apps → Web app
2. Copy Web SDK config → put into `apps/web/.env.local`
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID

## Firebase Admin (API)
1. Firebase Console → Project settings → Service accounts → Generate new private key
2. From JSON:
   - FIREBASE_PROJECT_ID = project_id
   - FIREBASE_CLIENT_EMAIL = client_email
   - FIREBASE_PRIVATE_KEY = private_key (replace newlines with \n)

## PayPal
1. developer.paypal.com → Dashboard → My Apps & Credentials
2. Create App (Sandbox first)
3. Copy credentials:
   - PAYPAL_CLIENT_ID
   - PAYPAL_CLIENT_SECRET
   - PAYPAL_MODE=sandbox (switch to live for production)

## Orkut (Gateway domestik)
- Placeholder. If you choose a local gateway (Midtrans/Xendit/etc.), add keys as envs (e.g. `ORKUT_API_KEY`).

## API Base URL
- apps/web/.env.local → NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 (dev)

## Run dev
```bash
npm run dev
```