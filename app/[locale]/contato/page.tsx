import { Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

        {/* [CONFIGURATION REQUIRED] — form is UI-only; wire to an email service or
            server action once a contact address/provider is chosen. */}
        <Card className="mt-10">
          <form className="flex flex-col gap-4">
            <Input type="text" placeholder={dict.pages.contact.formName} />
            <Input type="email" placeholder={dict.pages.contact.formEmail} />
            <textarea
              placeholder={dict.pages.contact.formMessage}
              rows={5}
              className="w-full rounded-md border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none placeholder:text-silver/60 focus:border-gold"
            />
            <Button type="submit" variant="primary" className="gap-2 self-start">
              <Mail size={16} /> {dict.pages.contact.formSubmit}
            </Button>
          </form>
        </Card>
      </section>

      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
