import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/lib/i18n";
import { getStripe } from "@/lib/stripe-server";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";
import { notFound } from "next/navigation";

// Verifies the Checkout Session server-side with Stripe before showing a
// success message — never trust the redirect URL alone, since it can be
// bookmarked, shared, or hit without ever actually paying. The webhook
// (not this page) is what grants the credit; this page only confirms status.
export default async function MilitaryCheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string };
}) {
  if (!isLocaleSlug(params.locale)) notFound();
  const locale = params.locale as LocaleSlug;
  const dict = getDictionary(locale);
  const ms = dict.militarySuccess;
  const base = `/${locale}`;

  let paid = false;
  if (searchParams.session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(searchParams.session_id);
      paid = session.payment_status === "paid";
    } catch (error) {
      console.error("[militar/sucesso] failed to verify session:", error);
    }
  }

  return (
    <RequireAuth locale={locale}>
      <main className="min-h-screen bg-carbon">
        <SiteHeader locale={locale} dict={dict} />
        <div className="mx-auto max-w-lg px-6 pb-24 pt-40 text-center">
          {paid ? (
            <>
              <CheckCircle2 size={48} className="mx-auto text-gold" />
              <h1 className="mt-4 font-heading text-3xl font-extrabold">{ms.title}</h1>
              <p className="mt-4 text-silver">{ms.subtitle}</p>
            </>
          ) : (
            <>
              <XCircle size={48} className="mx-auto text-red-400" />
              <h1 className="mt-4 font-heading text-2xl font-bold">{ms.notConfirmedTitle}</h1>
              <p className="mt-4 text-silver">{ms.notConfirmedSubtitle}</p>
            </>
          )}
          {paid && (
            <div className="mt-8">
              <Link href={`${base}/militar/programa`}>
                <button className="rounded-md bg-gold px-6 py-3 text-sm font-bold uppercase text-carbon hover:bg-gold-light">
                  {ms.viewProgram}
                </button>
              </Link>
            </div>
          )}
          <Link href={`${base}/dashboard`} className="mt-4 inline-block text-gold hover:underline">
            {ms.backToDashboard}
          </Link>
        </div>
      </main>
    </RequireAuth>
  );
}
