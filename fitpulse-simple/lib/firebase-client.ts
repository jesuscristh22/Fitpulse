"use client";

import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// [CONFIGURATION REQUIRED] — values come from NEXT_PUBLIC_FIREBASE_* env vars
// set in Vercel Project Settings > Environment Variables.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// IMPORTANT: these are lazy getters, not eager top-level `export const`.
// Client Components still get their module code executed once during
// server-side rendering (before hydration) — if we called getAuth()/
// getFirestore() eagerly at import time, a missing/invalid Firebase config
// (e.g. before env vars are set in Vercel) would throw during the build's
// static generation step and take down every single page at once. Deferring
// creation until something actually calls these functions (always from a
// browser event handler or a client-only useEffect) keeps builds green
// regardless of whether Firebase is configured yet.
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

export function getFirebaseDb(): Firestore {
  if (!dbInstance) dbInstance = getFirestore(getFirebaseApp());
  return dbInstance;
}

// Not used yet (no upload features built — Storage is skipped until a later
// phase), but kept lazy for the same reason as above.
export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) storageInstance = getStorage(getFirebaseApp());
  return storageInstance;
}
