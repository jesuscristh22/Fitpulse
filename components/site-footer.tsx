import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function SiteFooter({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <footer className="border-t border-white/10 px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/app-icon.png" alt="FitPulse" width={28} height={28} className="rounded-md" />
          <span className="font-heading text-sm font-bold">FITPULSE</span>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm text-silver sm:grid-cols-3">
          <div>
            <p className="mb-3 font-semibold text-white">{dict.footer.product}</p>
            <ul className="space-y-2">
              <li><Link href={`${base}/recursos`} className="hover:text-white">{dict.nav.features}</Link></li>
              <li><Link href={`${base}/planos`} className="hover:text-white">{dict.nav.pricing}</Link></li>
              <li><Link href={`${base}/blog`} className="hover:text-white">{dict.blog.title}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">{dict.footer.company}</p>
            <ul className="space-y-2">
              <li><Link href={`${base}/sobre`} className="hover:text-white">{dict.footer.about}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-white">{dict.footer.support}</p>
            <ul className="space-y-2">
              <li><Link href={`${base}/contato`} className="hover:text-white">{dict.footer.contact}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-silver/60">
        © {new Date().getFullYear()} FitPulse. {dict.footer.rights}
      </p>
    </footer>
  );
}
