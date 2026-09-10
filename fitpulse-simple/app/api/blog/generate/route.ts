import { NextResponse } from "next/server";
import { generateWeeklyBlogPosts } from "@/lib/blog-ai-server";

// Triggered weekly by Vercel Cron (see vercel.json "crons"). Vercel signs
// cron requests with `Authorization: Bearer ${CRON_SECRET}` automatically
// when CRON_SECRET is set as an env var — this route rejects anything else,
// so nobody else can trigger (and spend OpenAI credits on) this endpoint.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    return NextResponse.json({ error: "[CONFIGURATION REQUIRED] CRON_SECRET is not set." }, { status: 501 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await generateWeeklyBlogPosts();
  return NextResponse.json({ generated: results });
}
