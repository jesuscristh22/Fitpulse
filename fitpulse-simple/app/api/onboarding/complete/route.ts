import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { completeOnboarding } from "@/lib/onboarding-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, ...onboardingData } = body ?? {};
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }
    const result = await completeOnboarding(idToken, onboardingData);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid onboarding data", issues: error.issues }, { status: 400 });
    }
    console.error("[/api/onboarding/complete]", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
