import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getBlogPost } from "@/lib/blog-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const post = await getBlogPost(locale, params.slug);
  if (!post) notFound();

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-sm text-silver hover:text-white">
          <ArrowLeft size={14} /> {dict.blog.back}
        </Link>

        <p className="mt-6 text-xs text-silver">{new Date(post.publishedAt).toLocaleDateString(locale)}</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">{post.title}</h1>

        <div className="mt-8 space-y-5 text-silver">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-silver">
              #{tag}
            </span>
          ))}
        </div>
      </article>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
