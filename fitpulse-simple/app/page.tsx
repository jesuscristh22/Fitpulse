import { redirect } from "next/navigation";
import { DEFAULT_LOCALE_SLUG } from "@/lib/locales-config";

// The root path always redirects to the default locale (pt-br).
// A smarter Accept-Language redirect can be added later via middleware.
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE_SLUG}`);
}
