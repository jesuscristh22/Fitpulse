import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { LocaleSlug } from "@/lib/locales-config";

export function SiteFooter({ locale, dict }: { locale: LocaleSlug; dict: Dictionary }) {
  const base = `/${locale}`;

  return (
    <footer className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-[112rem] grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-12">
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/images/app-icon.png" alt="FitPulse" width={28} height={28} className="rounded-md" />
            <span className="font-heading text-sm font-bold">FITPULSE</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-silver">{dict.footer.tagline}</p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">{dict.footer.product}</p>
          <ul className="space-y-2 text-sm text-silver">
            <li><Link href={`${base}/recursos`} className="hover:text-white">{dict.nav.features}</Link></li>
            <li><Link href={`${base}/planos`} className="hover:text-white">{dict.nav.pricing}</Link></li>
            <li><Link href={`${base}/exercicios`} className="hover:text-white">{dict.nav.library}</Link></li>
            <li><Link href={`${base}/militar`} className="hover:text-white">{dict.military.badge}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{dict.footer.training}</p>
          <ul className="space-y-2 text-sm text-silver">
            <li><Link href={`${base}/treinos/funcionais`} className="hover:text-white">{dict.functionalWorkouts.navLabel}</Link></li>
            <li><Link href={`${base}/treinos/danca`} className="hover:text-white">{dict.dance.navLabel}</Link></li>
            <li><Link href={`${base}/desafios`} className="hover:text-white">{dict.challenges.navLabel}</Link></li>
            <li><Link href={`${base}/copiloto`} className="hover:text-white">{dict.copilot.navLabel}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{dict.footer.community}</p>
          <ul className="space-y-2 text-sm text-silver">
            <li><Link href={`${base}/coaches`} className="hover:text-white">{dict.coach.navLabel}</Link></li>
            <li><Link href={`${base}/academias`} className="hover:text-white">{dict.gym.navLabel}</Link></li>
            <li><Link href={`${base}/blog`} className="hover:text-white">{dict.blog.title}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{dict.footer.company}</p>
          <ul className="space-y-2 text-sm text-silver">
            <li><Link href={`${base}/sobre`} className="hover:text-white">{dict.footer.about}</Link></li>
            <li><Link href={`${base}/contato`} className="hover:text-white">{dict.footer.contact}</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[112rem] text-xs text-silver/60">
        © {new Date().getFullYear()} FitPulse. {dict.footer.rights}
      </p>
    </footer>
  );
}
