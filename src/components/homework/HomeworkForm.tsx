"use client";

import { Eye, FileDown, LoaderCircle, PenLine, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadHomeworkPdf } from "@/lib/pdf/download";
import { emptyValues, hasAnyValue } from "@/lib/templates";
import type { FormValues, HomeworkTemplate, Section } from "@/lib/templates/types";
import { cn } from "@/lib/utils";
import { ExampleView } from "./ExampleView";
import { FieldInput } from "./FieldInput";

type View = "fyll-i" | "exempel";

export function HomeworkForm({
  template,
  aiEnabled,
}: {
  template: HomeworkTemplate;
  aiEnabled: boolean;
}) {
  const [view, setView] = useState<View>("fyll-i");
  const [values, setValues] = useState<FormValues>(() => emptyValues(template));
  const [name, setName] = useState("");
  const [pdfState, setPdfState] = useState<"idle" | "busy" | "error">("idle");

  const dirty = hasAnyValue(values) || name.trim() !== "";
  const progress = useMemo(() => countProgress(template, values), [template, values]);

  // Varna innan sidan lämnas – inget sparas, så ett oavsiktligt klick ska inte radera allt.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(sectionId: string, index: number, fieldId: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((entry, i) =>
        i === index ? { ...entry, [fieldId]: value } : entry
      ),
    }));
  }

  function addEntry(section: Section) {
    setValues((prev) => ({ ...prev, [section.id]: [...prev[section.id], {}] }));
  }

  function removeEntry(section: Section, index: number) {
    const entry = values[section.id][index];
    const hasContent = Object.values(entry).some((v) => v.trim() !== "");
    if (
      hasContent &&
      !window.confirm(`Ta bort ${section.repeatable?.itemLabel.toLowerCase()} ${index + 1}?`)
    )
      return;
    setValues((prev) => ({
      ...prev,
      [section.id]: prev[section.id].filter((_, i) => i !== index),
    }));
  }

  function reset() {
    if (!window.confirm("Rensa allt du skrivit? Det går inte att ångra.")) return;
    setValues(emptyValues(template));
    setName("");
  }

  async function downloadPdf() {
    setPdfState("busy");
    try {
      await downloadHomeworkPdf(template, values, name);
      setPdfState("idle");
    } catch (error) {
      console.error("PDF kunde inte skapas", (error as Error)?.name);
      setPdfState("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
      <div className="min-w-0">
        {/* Flikar */}
        <div
          className="mb-8 inline-flex rounded-full border border-line bg-white p-1"
          role="tablist"
        >
          {(
            [
              ["fyll-i", "Fyll i", PenLine],
              ["exempel", "Se ett exempel", Eye],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition",
                view === id ? "bg-ink text-paper shadow" : "text-ink-soft hover:text-ink"
              )}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </button>
          ))}
        </div>

        {view === "exempel" ? (
          <ExampleView template={template} onStart={() => setView("fyll-i")} />
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-10" noValidate>
            <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
              <label htmlFor="namn" className="font-display text-lg font-semibold">
                Ditt namn{" "}
                <span className="font-sans text-sm font-normal text-ink-muted">
                  (valfritt – syns bara i PDF:en)
                </span>
              </label>
              <input
                id="namn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="mt-2.5 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>

            {template.sections.map((section) => (
              <fieldset key={section.id} className="space-y-5">
                {(template.sections.length > 1 || section.description) && (
                  <legend className="mb-5">
                    <span className="block font-display text-3xl font-semibold">
                      {section.title}
                    </span>
                    {section.description && (
                      <span className="mt-1 block text-ink-soft">{section.description}</span>
                    )}
                  </legend>
                )}

                {values[section.id].map((entry, index) => (
                  <div
                    key={index}
                    className="animate-fade-up rounded-3xl border border-line bg-white p-6 shadow-[0_12px_32px_-24px_rgba(26,22,20,0.3)] md:p-8"
                  >
                    {section.repeatable && (
                      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                        <h3 className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex size-8 items-center justify-center rounded-full bg-brand-500 font-sans text-sm text-ink">
                            {index + 1}
                          </span>
                          {section.repeatable.itemLabel} {index + 1}
                        </h3>
                        {values[section.id].length > section.repeatable.min && (
                          <button
                            type="button"
                            onClick={() => removeEntry(section, index)}
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-muted hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="size-4" aria-hidden /> Ta bort
                          </button>
                        )}
                      </div>
                    )}
                    <div className="space-y-7">
                      {section.fields.map((field) => (
                        <FieldInput
                          key={field.id}
                          field={field}
                          inputId={`${section.id}-${index}-${field.id}`}
                          value={entry[field.id] ?? ""}
                          onChange={(v) => update(section.id, index, field.id, v)}
                          templateSlug={template.slug}
                          sectionId={section.id}
                          aiEnabled={aiEnabled}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {section.repeatable && values[section.id].length < section.repeatable.max && (
                  <button
                    type="button"
                    onClick={() => addEntry(section)}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line py-5 font-medium text-ink-soft transition hover:border-brand-400 hover:bg-brand-50 hover:text-ink"
                  >
                    <Plus className="size-5" aria-hidden /> {section.repeatable.addLabel}
                  </button>
                )}
              </fieldset>
            ))}
          </form>
        )}
      </div>

      {/* Sidopanel */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-ink p-6 text-white">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
            Din ifyllnad
          </p>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-display text-4xl font-semibold">{progress.percent}%</span>
            <span className="text-sm text-white/60">
              {progress.filled} av {progress.total} fält
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          <Button
            variant="accent"
            size="lg"
            className="mt-6 w-full"
            onClick={downloadPdf}
            disabled={pdfState === "busy"}
          >
            {pdfState === "busy" ? <LoaderCircle className="animate-spin" /> : <FileDown />}
            {pdfState === "busy" ? "Skapar PDF …" : "Ladda ner som PDF"}
          </Button>
          {pdfState === "error" && (
            <p role="alert" className="mt-3 text-sm text-brand-200">
              PDF:en kunde inte skapas. Försök igen, eller ta en skärmbild som reserv.
            </p>
          )}
          <p className="mt-3 text-xs leading-relaxed text-white/55">
            PDF:en skapas i din enhet. Inget skickas eller sparas. Stänger du sidan försvinner det
            du skrivit.
          </p>

          {dirty && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Börja om
            </button>
          )}
        </div>

        <div className="mt-5 rounded-3xl border border-line bg-white p-6">
          <h2 className="text-lg font-semibold">Så gör du</h2>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            {template.howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-900">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

function countProgress(template: HomeworkTemplate, values: FormValues) {
  let total = 0;
  let filled = 0;
  for (const section of template.sections) {
    for (const entry of values[section.id]) {
      for (const field of section.fields) {
        total += 1;
        if ((entry[field.id] ?? "").trim() !== "") filled += 1;
      }
    }
  }
  return { total, filled, percent: total === 0 ? 0 : Math.round((filled / total) * 100) };
}
