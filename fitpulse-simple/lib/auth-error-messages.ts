import type { FirebaseError } from "firebase/app";

export interface AuthErrorLabels {
  emailInUse: string;
  invalidEmail: string;
  weakPassword: string;
  wrongCredentials: string;
  tooManyRequests: string;
  network: string;
  popupClosed: string;
  generic: string;
}

// Firebase Auth errors carry a `.code` like "auth/email-already-in-use" —
// the old code here swallowed all of them into one generic message, making
// it impossible for anyone (including us) to tell a taken email apart from
// a network failure apart from a weak password. This maps the common ones
// to something the person can actually act on.
export function getAuthErrorMessage(error: unknown, labels: AuthErrorLabels): string | null {
  const code = (error as FirebaseError)?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return labels.emailInUse;
    case "auth/invalid-email":
      return labels.invalidEmail;
    case "auth/weak-password":
      return labels.weakPassword;
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/user-not-found":
      return labels.wrongCredentials;
    case "auth/too-many-requests":
      return labels.tooManyRequests;
    case "auth/network-request-failed":
      return labels.network;
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null; // person just closed the Google popup — not a real error, no message needed
    default:
      return labels.generic;
  }
}
