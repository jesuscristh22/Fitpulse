import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getBlogPosts } from "@/lib/blog-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

const coverImages = [
  "/images/feature-phoneapp.jpg",
  "/images/feature-womanback.jpg",
  "/images/feature-treadmill.jpg",
  "/images/feature-dumbbell.jpg",
];

export default async function BlogPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const posts = await getBlogPosts(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-36 sm:px-10 sm:pt-44">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">{dict.blog.updatedWeekly}</p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{dict.blog.title}</h1>
        <p className="mt-4 max-w-xl text-silver">{dict.blog.subtitle}</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="flex flex-col gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite transition-colors hover:border-gold/40 sm:flex-row"
            >
              <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-64">
                <Image src={coverImages[i % coverImages.length]} alt={post.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6">
                <p className="text-xs text-silver">{new Date(post.publishedAt).toLocaleDateString(locale)}</p>
                <h2 className="mt-2 font-heading text-lg font-bold leading-snug sm:text-xl">{post.title}</h2>
                <p className="mt-2 text-sm text-silver">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold">{dict.dashboardExtra.readMore}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
