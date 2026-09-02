import "server-only";
import { adminDb } from "./firebase-admin";
import { getSeedPosts, type BlogPost } from "./blog-content";
import type { LocaleSlug } from "./locales-config";

// Server-side only (called from Server Components / route handlers).
// Tries Firestore first (posts written by the weekly AI generation cron —
// see /api/blog/generate); falls back to the hand-written seed posts if
// Firebase Admin isn't configured yet, or if no AI posts exist yet for this
// locale. This means the blog is never empty, regardless of setup stage.
//
// Sorting happens in JS (not via Firestore `orderBy`) specifically to avoid
// requiring a composite index for the locale + orderBy combination — same
// reasoning as lib/workouts-client.ts's useMyWorkouts.
export async function getBlogPosts(locale: LocaleSlug): Promise<BlogPost[]> {
  try {
    const snapshot = await adminDb()
      .collection("blog_posts")
      .where("locale", "==", locale)
      .limit(20)
      .get();

    if (snapshot.empty) {
      return getSeedPosts(locale);
    }

    const posts = snapshot.docs.map((doc) => doc.data() as BlogPost);
    posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    return posts;
  } catch (error) {
    console.error("[getBlogPosts] Firestore unavailable, falling back to seed posts:", error);
    return getSeedPosts(locale);
  }
}

export async function getBlogPost(locale: LocaleSlug, slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts(locale);
  return posts.find((p) => p.slug === slug) ?? null;
}
