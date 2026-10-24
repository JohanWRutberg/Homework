import type { ScaleField } from "./types";

/** Återkommande 0–100-skala för känslointensitet och trovärdighet. */
export function percentScale(
  id: string,
  label: string,
  help: string,
  minLabel = "Inte alls",
  maxLabel = "Maximalt"
): ScaleField {
  return {
    id,
    label,
    help,
    type: "scale",
    min: 0,
    max: 100,
    step: 5,
    minLabel,
    maxLabel,
    unit: "%",
  };
}

export function tenScale(
  id: string,
  label: string,
  help: string,
  minLabel: string,
  maxLabel: string
): ScaleField {
  return { id, label, help, type: "scale", min: 0, max: 10, step: 1, minLabel, maxLabel };
}
