"use client";

import { AlertTriangle, Check, ClipboardCopy, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getScale, type Answers } from "@/lib/scales";
import { answeredCount, evaluate, scoreItem } from "@/lib/scales/scoring";
import type { ScaleDefinition, ScaleResult, Severity } from "@/lib/scales/types";
import { cn } from "@/lib/utils";

const severityStyle: Record<Severity, string> = {
  none: "bg-emerald-100 text-emerald-900",
  mild: "bg-amber-100 text-amber-900",
  moderate: "bg-brand-200 text-brand-900",
  severe: "bg-red-100 text-red-900",
};

export function ScaleCalculator({ slug }: { slug: string }) {
  const scale = getScale(slug)!;
  const [answers, setAnswers] = useState<Answers>(() => scale.items.map(() => null));
  const result = evaluate(scale, answers);
  const answered = answeredCount(answers);

  function select(itemIndex: number, optionIndex: number) {
    setAnswers((prev) => prev.map((a, i) => (i === itemIndex ? optionIndex : a)));
  }

  function reset() {
    if (answered > 0 && !window.confirm("Rensa alla svar?")) return;
    setAnswers(scale.items.map(() => null));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0">
        <OptionLegend scale={scale} />
        <ol className="mt-6 space-y-3">
          {scale.items.map((item, itemIndex) => {
            const selected = answers[itemIndex];
            return (
              <li
                key={item.n}
                className={cn(
                  "rounded-2xl border bg-white p-4 transition-colors md:p-5",
                  selected === null ? "border-line" : "border-brand-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                      selected === null ? "bg-sand text-ink-soft" : "bg-brand-500 text-ink"
                    )}
                  >
                    {item.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink" id={`item-${item.n}`}>
                      {item.label}
                      {item.reversed && (
                        <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-paper">
                          omvänd
                        </span>
                      )}
                    </p>
                    {item.subscale && (
                      <p className="mt-0.5 text-sm text-ink-muted">{item.subscale}</p>
                    )}
                  </div>
                  {selected !== null && (
                    <span className="shrink-0 text-sm font-semibold text-brand-800 tabular-nums">
                      {scoreItem(scale, item, selected)} p
                    </span>
                  )}
                </div>
                <div
                  className={cn("mt-3 grid gap-1.5", gridCols(scale.options.length))}
                  role="group"
                  aria-labelledby={`item-${item.n}`}
                >
                  {scale.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      type="button"
                      aria-pressed={selected === optionIndex}
                      title={option.label}
                      onClick={() => select(itemIndex, optionIndex)}
                      className={cn(
                        "min-h-11 rounded-xl px-2 py-2 text-sm leading-tight font-medium transition",
                        selected === optionIndex
                          ? "bg-ink text-paper"
                          : "bg-sand text-ink-soft hover:bg-brand-100 hover:text-ink"
                      )}
                    >
                      {option.short ?? option.label}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ResultPanel
          scale={scale}
          result={result}
          answered={answered}
          answers={answers}
          onReset={reset}
        />
      </aside>
    </div>
  );
}

function gridCols(n: number) {
  if (n <= 4) return "grid-cols-2 sm:grid-cols-4";
  if (n === 5) return "grid-cols-5";
  return "grid-cols-7";
}

function OptionLegend({ scale }: { scale: ScaleDefinition }) {
  if (scale.options.every((o) => !o.short)) return null;
  return (
    <dl className="grid gap-x-6 gap-y-1 rounded-2xl bg-sand p-4 text-sm sm:grid-cols-2">
      {scale.options
        .filter((o) => o.short)
        .map((o) => (
          <div key={o.label} className="flex gap-2">
            <dt className="font-semibold whitespace-nowrap">{o.short}:</dt>
            <dd className="text-ink-soft">{o.label}</dd>
          </div>
        ))}
    </dl>
  );
}

function ResultPanel({
  scale,
  result,
  answered,
  answers,
  onReset,
}: {
  scale: ScaleDefinition;
  result: ScaleResult | null;
  answered: number;
  answers: Answers;
  onReset: () => void;
}) {
  const total = scale.items.length;
  const missing = scale.items.filter((_, i) => answers[i] === null).map((item) => item.n);

  return (
    <div className="overflow-hidden rounded-3xl bg-ink text-white">
      <div className="p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">Resultat</p>
        {result ? (
          <>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-6xl font-semibold tabular-nums">
                {result.total}
              </span>
              <span className="pb-2 text-white/50">/ {result.maxTotal} p</span>
            </div>
            <span
              className={cn(
                "mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold",
                severityStyle[result.severity]
              )}
            >
              {result.interpretation}
            </span>
            {result.subscales.length > 0 && (
              <ul className="mt-6 space-y-3">
                {result.subscales.map((s) => (
                  <li key={s.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">{s.name}</span>
                      <span className="font-semibold tabular-nums">
                        {s.score} <span className="font-normal text-white/40">/ {s.max}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-brand-500"
                        style={{ width: `${(s.score / s.max) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {result.flags.map((flag) => (
              <p
                key={flag}
                className="mt-5 flex gap-2 rounded-2xl bg-red-500/15 p-3 text-sm text-red-100 ring-1 ring-red-400/30"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                {flag}
              </p>
            ))}
          </>
        ) : (
          <>
            <p className="mt-3 font-display text-3xl font-semibold">
              {answered} <span className="text-white/40">av {total} besvarade</span>
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-brand-500 transition-all"
                style={{ width: `${(answered / total) * 100}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-white/60">
              Resultat och journaltext visas när alla frågor är besvarade.
              {answered > 0 && <> Saknas: {missing.join(", ")}.</>}
            </p>
          </>
        )}
      </div>

      {result && <JournalText key={result.journalText} text={result.journalText} />}

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Rensa
        </button>
        <span className="text-xs text-white/40">Inget sparas</span>
      </div>
    </div>
  );
}

function JournalText({ text }: { text: string }) {
  const [value, setValue] = useState(text);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Reserv för äldre webbläsare/osäkra kontexter
      const area = document.getElementById("journaltext") as HTMLTextAreaElement | null;
      area?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white p-6 text-ink">
      <label
        htmlFor="journaltext"
        className="text-xs font-semibold tracking-[0.18em] text-brand-800 uppercase"
      >
        Journaltext
      </label>
      <textarea
        id="journaltext"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={7}
        className="mt-2 field-sizing-content w-full resize-y rounded-2xl border border-line bg-paper p-3 text-sm leading-relaxed outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
      />
      <Button onClick={copy} variant={copied ? "soft" : "accent"} className="mt-3 w-full">
        {copied ? <Check /> : <ClipboardCopy />}
        {copied ? "Kopierat!" : "Kopiera journaltext"}
      </Button>
      <p className="mt-2 text-xs text-ink-muted">Du kan justera texten innan du kopierar.</p>
    </div>
  );
}
