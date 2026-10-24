import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Field, HomeworkTemplate } from "@/lib/templates/types";

function display(field: Field, value: string): string {
  if (!value) return "–";
  if (field.type === "scale")
    return `${value}${field.unit ?? ""} (${field.min} = ${field.minLabel}, ${field.max} = ${field.maxLabel})`;
  if (field.type === "number" && field.unit) return `${value} ${field.unit}`;
  return value;
}

export function ExampleView({
  template,
  onStart,
}: {
  template: HomeworkTemplate;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-200">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden />
        <p className="leading-relaxed text-ink">
          Så här kan en ifylld {template.title.toLowerCase()} se ut. Exemplet är påhittat – ditt
          eget blir annorlunda, och det är precis som det ska vara.
        </p>
      </div>

      {template.sections.map((section) =>
        (template.example[section.id] ?? []).map((entry, index) => (
          <article
            key={`${section.id}-${index}`}
            className="rounded-3xl border border-line bg-white p-6 md:p-8"
          >
            <h3 className="mb-5 text-xl font-semibold">
              {section.repeatable ? `${section.repeatable.itemLabel} ${index + 1}` : section.title}
            </h3>
            <dl className="space-y-5">
              {section.fields
                .filter((f) => entry[f.id])
                .map((field) => (
                  <div key={field.id}>
                    <dt className="text-sm font-semibold text-ink-muted">{field.label}</dt>
                    <dd className="mt-1 border-l-2 border-brand-400 pl-4 font-display text-lg leading-relaxed text-ink italic">
                      {display(field, entry[field.id])}
                    </dd>
                  </div>
                ))}
            </dl>
          </article>
        ))
      )}

      <Button size="lg" onClick={onStart} className="group">
        Fyll i din egen
        <ArrowRight className="text-brand-400 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
