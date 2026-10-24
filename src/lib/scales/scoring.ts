import type { Answers, ScaleDefinition, ScaleItem, ScaleResult } from "./types";

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

/** Poäng för ett item givet valt svarsalternativ, med hänsyn till omvänd skattning. */
export function scoreItem(scale: ScaleDefinition, item: ScaleItem, optionIndex: number): number {
  const option = scale.options[optionIndex];
  if (!option) throw new Error(`Ogiltigt svarsalternativ ${optionIndex} för item ${item.n}`);
  if (!item.reversed) return option.value;
  const max = Math.max(...scale.options.map((o) => o.value));
  const min = Math.min(...scale.options.map((o) => o.value));
  return max + min - option.value;
}

export function answeredCount(answers: Answers): number {
  return answers.filter((a) => a !== null).length;
}

/** Returnerar resultat först när alla items är besvarade – en halv skattning ska aldrig journalföras. */
export function evaluate(scale: ScaleDefinition, answers: Answers): ScaleResult | null {
  if (answers.length !== scale.items.length) return null;
  if (answers.some((a) => a === null)) return null;
  const scores = scale.items.map((item, i) => scoreItem(scale, item, answers[i] as number));
  return scale.compute(scores);
}

/** Summerar poäng för angivna itemnummer (1-indexerade, som i formulären). */
export function sumItems(scores: number[], itemNumbers: number[]): number {
  return sum(itemNumbers.map((n) => scores[n - 1]));
}

export function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
