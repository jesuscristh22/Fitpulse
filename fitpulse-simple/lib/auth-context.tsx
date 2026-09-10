"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "./firebase-client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      // If Firebase isn't configured yet, or a env var is malformed, this
      // must never take down the entire app — every page renders through
      // this provider. Fail safe: treat it as "signed out" and log the
      // real reason to the console for debugging.
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
    } catch (error) {
      console.error("[AuthProvider] Firebase Auth failed to initialize:", error);
      setLoading(false);
    }
    return () => unsubscribe?.();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
