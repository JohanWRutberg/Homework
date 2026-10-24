import { aktivitetsdagbok } from "./aktivitetsdagbok";
import { beteendeanalys } from "./beteendeanalys";
import { exponeringstrappa } from "./exponeringstrappa";
import { somndagbok } from "./somndagbok";
import { tankedagbok } from "./tankedagbok";
import type { FormValues, HomeworkTemplate } from "./types";

/** Lägg till nya mallar här – biblioteket, sidan och PDF-exporten följer med automatiskt. */
export const templates: HomeworkTemplate[] = [
  tankedagbok,
  beteendeanalys,
  exponeringstrappa,
  aktivitetsdagbok,
  somndagbok,
];

export function getTemplate(slug: string): HomeworkTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}

export function emptyValues(template: HomeworkTemplate): FormValues {
  return Object.fromEntries(
    template.sections.map((section) => [
      section.id,
      Array.from({ length: section.repeatable?.min ?? 1 }, () => ({})),
    ])
  );
}

export function hasAnyValue(values: FormValues): boolean {
  return Object.values(values).some((entries) =>
    entries.some((entry) => Object.values(entry).some((v) => v.trim() !== ""))
  );
}

export { CATEGORIES } from "./types";
export type * from "./types";
