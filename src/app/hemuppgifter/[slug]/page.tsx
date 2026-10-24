import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HomeworkForm } from "@/components/homework/HomeworkForm";
import { TemplateIcon } from "@/components/homework/TemplateIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { isAiEnabled } from "@/lib/ai/config";
import { getTemplate, templates } from "@/lib/templates";

type Params = PageProps<"/hemuppgifter/[slug]">["params"];

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

async function resolveTemplate(params: Params) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();
  return template;
}

// Skalet (tillbakalänk och layout) delas av alla mallar och kan visas direkt vid navigering.
// Allt som beror på sluggen läses inuti Suspense.
export default function HomeworkPage({ params }: PageProps<"/hemuppgifter/[slug]">) {
  return (
    <>
      <section className="border-b border-line paper-grain">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 md:pt-14">
          <Link
            href="/hemuppgifter"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" /> Alla hemuppgifter
          </Link>
          <Suspense fallback={<HeroSkeleton />}>
            <TemplateHero params={params} />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<FormSkeleton />}>
        <TemplateForm params={params} />
      </Suspense>
    </>
  );
}

async function TemplateHero({ params }: { params: Params }) {
  const template = await resolveTemplate(params);
  return (
    <div className="mt-6 flex animate-fade-up flex-col gap-6 md:flex-row md:items-start">
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
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{template.intro}</p>
      </div>
    </div>
  );
}

async function TemplateForm({ params }: { params: Params }) {
  const template = await resolveTemplate(params);
  return <HomeworkForm template={template} aiEnabled={isAiEnabled()} />;
}

function HeroSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
      <Skeleton className="size-16 rounded-3xl" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-7 w-56 rounded-full" />
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-20 max-w-2xl" />
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 rounded-full" />
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );
}
