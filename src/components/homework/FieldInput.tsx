"use client";

import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import type { AiClientConfig } from "@/lib/ai/models";
import type { Field, ScaleField } from "@/lib/templates/types";
import { cn } from "@/lib/utils";
import { AiChat } from "./AiChat";

interface Props {
  field: Field;
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  templateSlug: string;
  sectionId: string;
  ai: AiClientConfig | null;
}

const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgba(26,22,20,0.04)] outline-none transition placeholder:text-ink-muted/70 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export function FieldInput({
  field,
  inputId,
  value,
  onChange,
  templateSlug,
  sectionId,
  ai,
}: Props) {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpId = `${inputId}-hjalp`;

  return (
    <div className="group/field">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={inputId} className="font-display text-lg font-semibold text-ink">
          {field.label}
        </label>
        <button
          type="button"
          onClick={() => setHelpOpen((o) => !o)}
          aria-expanded={helpOpen}
          aria-controls={helpId}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
            helpOpen ? "bg-ink text-paper" : "text-brand-800 hover:bg-brand-50"
          )}
        >
          <MessageCircleQuestion className="size-4" aria-hidden />
          Vad menas här?
          <ChevronDown
            className={cn("size-3.5 transition-transform", helpOpen && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      {helpOpen && (
        <div
          id={helpId}
          className="bubble mt-3 mb-5 animate-fade-up border border-brand-200 bg-brand-50 p-5"
        >
          <p className="leading-relaxed text-ink">{field.help}</p>
          {ai && (
            <AiChat
              inputId={inputId}
              templateSlug={templateSlug}
              sectionId={sectionId}
              fieldId={field.id}
              ai={ai}
            />
          )}
        </div>
      )}

      <div className="mt-2.5">
        <Control field={field} inputId={inputId} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function Control({
  field,
  inputId,
  value,
  onChange,
}: Pick<Props, "field" | "inputId" | "value" | "onChange">) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={cn(inputClass, "field-sizing-content min-h-24 resize-y leading-relaxed")}
        />
      );
    case "text":
      return (
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
    case "number":
      return (
        <div className="flex items-center gap-3">
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={field.min}
            max={field.max}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "max-w-36")}
          />
          {field.unit && <span className="text-ink-muted">{field.unit}</span>}
        </div>
      );
    case "date":
    case "time":
      return (
        <input
          id={inputId}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, "max-w-56")}
        />
      );
    case "scale":
      return <ScaleInput field={field} inputId={inputId} value={value} onChange={onChange} />;
  }
}

function ScaleInput({
  field,
  inputId,
  value,
  onChange,
}: {
  field: ScaleField;
  inputId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isSet = value !== "";
  const numeric = isSet ? Number(value) : field.min;
  const percent = ((numeric - field.min) / (field.max - field.min)) * 100;
  const fewSteps = (field.max - field.min) / field.step <= 10;

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <span
          className={cn(
            "min-w-16 rounded-xl px-3 py-1.5 text-center font-display text-2xl font-semibold tabular-nums",
            isSet ? "bg-brand-500 text-ink" : "bg-sand text-ink-muted"
          )}
          aria-hidden
        >
          {isSet ? `${value}${field.unit ?? ""}` : "–"}
        </span>
        {isSet ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-ink-muted underline-offset-4 hover:underline"
          >
            Rensa
          </button>
        ) : (
          <span className="text-sm text-ink-muted">Dra eller tryck för att välja</span>
        )}
      </div>

      {fewSteps ? (
        <div className="mt-4 flex gap-1.5" role="group" aria-labelledby={`${inputId}-etikett`}>
          <span id={`${inputId}-etikett`} className="sr-only">
            {field.label}
          </span>
          {Array.from({ length: (field.max - field.min) / field.step + 1 }, (_, i) => {
            const v = String(field.min + i * field.step);
            const selected = value === v;
            return (
              <button
                key={v}
                id={i === 0 ? inputId : undefined}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(v)}
                className={cn(
                  "h-11 flex-1 rounded-xl text-sm font-medium tabular-nums transition",
                  selected
                    ? "bg-ink text-paper"
                    : "bg-sand text-ink-soft hover:bg-brand-100 hover:text-ink"
                )}
              >
                {v}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          id={inputId}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={numeric}
          aria-valuetext={isSet ? `${value}${field.unit ?? ""}` : "Inte vald"}
          onChange={(e) => onChange(e.target.value)}
          onPointerDown={(e) => !isSet && onChange((e.target as HTMLInputElement).value)}
          className={cn(
            "mt-5 h-2 w-full cursor-pointer appearance-none rounded-full",
            !isSet && "opacity-60"
          )}
          style={{
            background: `linear-gradient(to right, var(--color-brand-500) ${isSet ? percent : 0}%, var(--color-sand) ${isSet ? percent : 0}%)`,
            accentColor: "var(--color-ink)",
          }}
        />
      )}

      <div className="mt-2 flex justify-between text-xs text-ink-muted">
        <span>
          {field.min} – {field.minLabel}
        </span>
        <span className="text-right">
          {field.max} – {field.maxLabel}
        </span>
      </div>
    </div>
  );
}
