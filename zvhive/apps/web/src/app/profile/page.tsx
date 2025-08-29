"use client";
import { useAuth } from "../../providers/AuthProvider";
import { getFirebaseClientApp } from "../../lib/firebaseClient";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      {user ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div>Email: {user.email}</div>
            <div>UID: {user.uid}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image src={photoURL || user.photoURL || "/favicon.ico"} alt="avatar" fill className="rounded-full border border-white/10 object-cover" />
            </div>
            <label className="text-sm">
              <span className="px-3 py-2 rounded bg-foreground text-background cursor-pointer">Upload Foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !user) return;
                setError(null);
                setUploading(true);
                try {
                  const app = getFirebaseClientApp();
                  const storage = getStorage(app);
                  const r = ref(storage, `avatars/${user.uid}`);
                  await uploadBytes(r, file);
                  const url = await getDownloadURL(r);
                  setPhotoURL(url);
                  // Optionally persist to account
                  await apiFetch("/api/account/me", { method: "POST", body: { photoURL: url }, idToken: await user.getIdToken() });
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Upload gagal");
                } finally {
                  setUploading(false);
                }
              }} />
            </label>
            {uploading && <span className="text-xs text-muted">Mengunggah...</span>}
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
        </div>
      ) : (
        <p className="text-muted">Silakan masuk untuk mengelola profil.</p>
      )}
    </div>
  );
}

