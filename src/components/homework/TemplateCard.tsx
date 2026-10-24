import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import type { HomeworkTemplate } from "@/lib/templates";
import { TemplateIcon } from "./TemplateIcon";

export function TemplateCard({ template }: { template: HomeworkTemplate }) {
  return (
    <Link
      href={`/hemuppgifter/${template.slug}`}
      className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_40px_-24px_rgba(214,84,0,0.45)]"
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-500 group-hover:text-ink">
          <TemplateIcon slug={template.slug} className="size-6" />
        </span>
        <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink-soft">
          {template.category}
        </span>
      </div>
      <h3 className="text-2xl font-semibold text-ink">{template.title}</h3>
      <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{template.summary}</p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-ink-muted">
          <Clock className="size-4" /> {template.minutes}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-ink">
          Öppna
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
