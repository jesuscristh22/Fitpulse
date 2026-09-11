import type { LegalDocument } from "@/lib/legal-content";

export function LegalDocumentView({ doc, disclaimer }: { doc: LegalDocument; disclaimer: string }) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
      <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">{doc.title}</h1>
      <p className="mt-2 text-sm text-silver">{doc.lastUpdated}</p>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-silver">
        {disclaimer}
      </div>

      <p className="mt-8 text-silver">{doc.intro}</p>

      <div className="mt-10 space-y-8">
        {doc.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-heading text-lg font-bold">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-silver">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
