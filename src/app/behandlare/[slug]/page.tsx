import { ArrowLeft, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScaleCalculator } from "@/components/scoring/ScaleCalculator";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getScale, scales } from "@/lib/scales";

export function generateStaticParams() {
  return scales.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/behandlare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const scale = getScale(slug);
  if (!scale) return {};
  return { title: `${scale.name} – rättningsmall`, robots: { index: false, follow: false } };
}

export default async function ScalePage({ params }: PageProps<"/behandlare/[slug]">) {
  const { slug } = await params;
  const scale = getScale(slug);
  if (!scale) notFound();

  return (
    <>
      <section className="border-b border-line paper-grain">
        <div className="mx-auto max-w-6xl animate-fade-up px-4 pt-10 pb-10 sm:px-6 md:pt-14">
          <Link
            href="/behandlare"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" /> Alla skattningar
          </Link>
          <Eyebrow className="mt-6">Rättningsmall</Eyebrow>
          <h1 className="mt-3 text-4xl font-semibold md:text-6xl">{scale.name}</h1>
          <p className="mt-2 text-ink-muted">{scale.fullName}</p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {scale.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ScaleCalculator slug={scale.slug} />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 className="text-lg font-semibold">Tolkning</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {scale.norms.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="size-4 text-brand-700" aria-hidden /> Referens
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{scale.reference}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          Skattningen är ett stöd och ersätter inte klinisk bedömning. Kontrollera alltid
          journaltexten innan den förs in.
        </p>
      </section>
    </>
  );
}
