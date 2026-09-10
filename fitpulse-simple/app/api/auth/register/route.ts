import { NextResponse } from "next/server";
import { provisionUserFromIdToken } from "@/lib/auth-server";

// POST { idToken } — called once right after Firebase sign-up (email/password
// or Google) succeeds on the client. See lib/auth-server.ts for what it does.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = body?.idToken as string | undefined;
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }
    const result = await provisionUserFromIdToken(idToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/auth/register]", error);
    return NextResponse.json({ error: "Failed to provision user" }, { status: 500 });
  }
}
