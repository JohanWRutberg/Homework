import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeworkForm } from "@/components/homework/HomeworkForm";
import { TemplateIcon } from "@/components/homework/TemplateIcon";
import { isAiEnabled } from "@/lib/ai/config";
import { getTemplate, templates } from "@/lib/templates";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/hemuppgifter/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};
  return { title: template.title, description: template.summary };
}

export default async function HomeworkPage({ params }: PageProps<"/hemuppgifter/[slug]">) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  return (
    <>
      <section className="border-b border-line paper-grain">
        <div className="mx-auto max-w-6xl animate-fade-up px-4 pt-10 pb-12 sm:px-6 md:pt-14">
          <Link
            href="/hemuppgifter"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" /> Alla hemuppgifter
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-brand-500 text-ink shadow-lg shadow-brand-500/30">
              <TemplateIcon slug={template.slug} className="size-8" />
            </span>
            <div>
              <p className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                <span className="rounded-full bg-white px-3 py-1 font-medium text-ink-soft ring-1 ring-line">
                  {template.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" /> {template.minutes}
                </span>
              </p>
              <h1 className="mt-3 text-4xl font-semibold md:text-6xl">{template.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {template.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeworkForm template={template} aiEnabled={isAiEnabled()} />
    </>
  );
}
