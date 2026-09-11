import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { getDictionary } from "@/lib/i18n";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function ContactPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">{dict.pages.contact.title}</p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
          {dict.pages.contact.headline}
        </h1>
        <p className="mt-4 max-w-md text-silver">{dict.pages.contact.subtext}</p>

        <Card className="mt-10">
          <ContactForm dict={dict.pages.contact} />
        </Card>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
