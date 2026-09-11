import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getDictionary } from "@/lib/i18n";
import { TERMS_OF_SERVICE } from "@/lib/legal-content";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

export default function TermsPage({ params }: { params: { locale: string } }) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);

  return (
    <main className="bg-carbon">
      <SiteHeader locale={locale} dict={dict} />
      <LegalDocumentView doc={TERMS_OF_SERVICE[locale]} disclaimer={dict.footer.termsDisclaimer} />
      <SiteFooter locale={locale} dict={dict} />
    </main>
  );
}
