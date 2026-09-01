import { notFound } from "next/navigation";
import { isLocaleSlug, type LocaleSlug } from "@/lib/locales-config";

export function generateStaticParams() {
  return [{ locale: "pt-br" }, { locale: "en" }, { locale: "es" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocaleSlug(params.locale)) notFound();
  return children;
}
