import { ArrowRight, ClipboardList, Send } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TemplateIcon } from "@/components/homework/TemplateIcon";
import { PageHeader } from "@/components/layout/PageHeader";
import { CopyLinkButton } from "@/components/scoring/CopyLinkButton";
import { scales } from "@/lib/scales";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "För behandlare",
  description: "Rättningsmallar för skattningsskalor med automatisk journaltext.",
  robots: { index: false, follow: false },
};

export default function ClinicianPage() {
  return (
    <>
      <PageHeader
        eyebrow="För behandlare"
        title={
          <>
            Rätta skattningar. <span className="highlight italic">Få journaltexten.</span>
          </>
        }
      >
        Klicka i patientens svar så räknas totalpoäng, delskalor och tolkning ut direkt – med en
        journaltext som är klar att kopiera. Allt sker i din webbläsare och ingenting sparas.
      </PageHeader>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="flex items-center gap-3 text-3xl font-semibold">
          <ClipboardList className="size-7 text-brand-700" aria-hidden /> Skattningar
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {scales.map((scale) => (
            <Link
              key={scale.slug}
              href={`/behandlare/${scale.slug}`}
              className="group flex flex-col rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_40px_-24px_rgba(214,84,0,0.45)]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-3xl font-semibold">{scale.name}</h3>
                <span className="text-sm text-ink-muted tabular-nums">
                  {scale.items.length} frågor · 0–{scale.maxTotal} p
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{scale.fullName}</p>
              <p className="mt-4 flex-1 text-ink-soft">{scale.purpose}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-medium">
                Öppna rättningsmall
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-sand/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="flex items-center gap-3 text-3xl font-semibold">
            <Send className="size-7 text-brand-700" aria-hidden /> Skicka hemuppgift till patient
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Kopiera länken och skicka den till patienten via 1177, sms eller e-post. Patienten
            behöver inget konto och tar med en PDF till nästa besök.
          </p>
          <ul className="mt-8 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
            {templates.map((t) => (
              <li key={t.slug} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <TemplateIcon slug={t.slug} className="size-5" />
                </span>
                <div className="flex-1">
                  <Link href={`/hemuppgifter/${t.slug}`} className="font-semibold hover:underline">
                    {t.title}
                  </Link>
                  <p className="text-sm text-ink-muted">{t.summary}</p>
                </div>
                <CopyLinkButton
                  path={`/hemuppgifter/${t.slug}`}
                  className="self-start sm:self-auto"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
