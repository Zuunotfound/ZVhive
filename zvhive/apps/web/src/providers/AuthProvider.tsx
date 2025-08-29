"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFirebaseClientApp } from "../lib/firebaseClient";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

type AuthContextType = {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutNow: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = getFirebaseClientApp();
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      idToken,
      loading,
      async signInWithGoogle() {
        const app = getFirebaseClientApp();
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      },
      async signOutNow() {
        const app = getFirebaseClientApp();
        const auth = getAuth(app);
        await signOut(auth);
      },
    }),
    [user, idToken, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

