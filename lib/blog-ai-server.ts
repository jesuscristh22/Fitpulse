import "server-only";
import { adminDb } from "./firebase-admin";
import type { LocaleSlug } from "./locales-config";

const LOCALE_LANGUAGE_NAME: Record<LocaleSlug, string> = {
  "pt-br": "Brazilian Portuguese",
  en: "English",
  es: "Spanish (Spain)",
};

const TOPIC_POOL = [
  "hydration and exercise performance",
  "warm-up routines before strength training",
  "protein intake for muscle recovery",
  "how to stay consistent with a workout habit",
  "the difference between soreness and injury pain",
  "mobility work for beginners",
  "how sleep affects fat loss and muscle gain",
  "beginner-friendly calisthenics progressions",
  "how to avoid plateaus in strength training",
  "active recovery on rest days",
];

function pickWeeklyTopic(): string {
  // Deterministic-ish rotation based on the ISO week number, so every locale
  // gets the same topic in a given week without needing extra state.
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  return TOPIC_POOL[week % TOPIC_POOL.length];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface GeneratedPost {
  title: string;
  excerpt: string;
  body: string[];
  tags: string[];
}

async function generateWithOpenAI(topic: string, languageName: string): Promise<GeneratedPost> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("[CONFIGURATION REQUIRED] OPENAI_API_KEY is not set.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a fitness content writer for FitPulse, a training app. Write general, evidence-based wellness information — never medical diagnoses, never specific medication or injury treatment advice. Keep a warm, encouraging, non-judgmental tone. Respond ONLY with a JSON object: { \"title\": string, \"excerpt\": string (under 20 words), \"body\": string[] (3 short paragraphs), \"tags\": string[] (2-3 lowercase tags) }.",
        },
        {
          role: "user",
          content: `Write a short blog post in ${languageName} about: ${topic}.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");
  return JSON.parse(content) as GeneratedPost;
}

// Called weekly by the Vercel Cron job (see vercel.json + /api/blog/generate).
// Writes one freshly AI-generated post per site locale to Firestore. Never
// throws for a single locale failure — logs and continues, so one bad
// generation doesn't block the others.
export async function generateWeeklyBlogPosts(): Promise<{ locale: LocaleSlug; slug: string }[]> {
  const topic = pickWeeklyTopic();
  const results: { locale: LocaleSlug; slug: string }[] = [];

  for (const locale of Object.keys(LOCALE_LANGUAGE_NAME) as LocaleSlug[]) {
    try {
      const generated = await generateWithOpenAI(topic, LOCALE_LANGUAGE_NAME[locale]);
      const slug = slugify(generated.title);
      const publishedAt = new Date().toISOString().slice(0, 10);

      await adminDb()
        .collection("blog_posts")
        .doc(`${locale}-${slug}`)
        .set({
          locale,
          slug,
          title: generated.title,
          excerpt: generated.excerpt,
          body: generated.body,
          tags: generated.tags,
          publishedAt,
          source: "ai",
        });

      results.push({ locale, slug });
    } catch (error) {
      console.error(`[generateWeeklyBlogPosts] Failed for locale "${locale}":`, error);
    }
  }

  return results;
}
