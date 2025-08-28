"use client";
import { useAuth } from "../../providers/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      {user ? (
        <div className="space-y-2">
          <div>Email: {user.email}</div>
          <div>UID: {user.uid}</div>
        </div>
      ) : (
        <p className="text-muted">Silakan masuk untuk mengelola profil.</p>
      )}
    </div>
  );
}

