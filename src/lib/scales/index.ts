import { gad7 } from "./gad7";
import { madrss } from "./madrss";
import { ocir } from "./ocir";
import { raads14 } from "./raads14";
import type { ScaleDefinition } from "./types";

/** Lägg till nya skattningar här – sidor och statiska rutter skapas automatiskt. */
export const scales: ScaleDefinition[] = [raads14, gad7, madrss, ocir];

export function getScale(slug: string): ScaleDefinition | undefined {
  return scales.find((s) => s.slug === slug);
}

export type { ScaleDefinition, ScaleResult, Answers } from "./types";
