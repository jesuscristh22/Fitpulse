import "server-only";

// [CONFIGURATION REQUIRED] YOUTUBE_API_KEY — a free YouTube Data API v3 key
// from Google Cloud Console. Used to automatically find a real video for
// exercises the Military AI generator discovers that aren't in our curated
// library yet. This trades manual verification (which doesn't scale) for
// YouTube's own search ranking — reasonable for a first pass, but a human
// should still spot-check auto-discovered exercises periodically.
export async function searchYouTubeVideoId(query: string): Promise<string | undefined> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return undefined;

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&safeSearch=strict&q=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error("[searchYouTubeVideoId] request failed:", res.status, await res.text());
      return undefined;
    }
    const data = await res.json();
    return data.items?.[0]?.id?.videoId ?? undefined;
  } catch (error) {
    console.error("[searchYouTubeVideoId] error:", error);
    return undefined;
  }
}
