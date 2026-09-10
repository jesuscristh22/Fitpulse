import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// SERVER ONLY. Never import this file from a Client Component.
// [CONFIGURATION REQUIRED] — FIREBASE_ADMIN_* env vars, set as encrypted
// Vercel environment variables, never committed to GitHub.
function getAdminApp(): App {
  if (getApps().length) return getApps()[0]!;
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("[CONFIGURATION REQUIRED] Firebase Admin credentials are missing.");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
