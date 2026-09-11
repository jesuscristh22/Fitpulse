import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// No email provider configured yet — messages are saved to Firestore and
// readable by Super Admin from the admin panel. Swap this for a real email
// service (Resend, SendGrid, etc.) once one is chosen; the form itself
// doesn't need to change either way.
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await adminDb().collection("contact_messages").add({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/contact/submit]", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
