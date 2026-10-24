interface BaseField {
  id: string;
  label: string;
  /** Förklaring på enkel svenska – visas direkt under "Vad menas här?", utan AI. */
  help: string;
  placeholder?: string;
}

export interface TextField extends BaseField {
  type: "text" | "textarea";
}

export interface ScaleField extends BaseField {
  type: "scale";
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  unit?: string;
}

export interface NumberField extends BaseField {
  type: "number";
  min: number;
  max: number;
  unit?: string;
}

export interface DateTimeField extends BaseField {
  type: "date" | "time";
}

export type Field = TextField | ScaleField | NumberField | DateTimeField;

export interface Section {
  id: string;
  title: string;
  description?: string;
  /** Sektioner som kan fyllas i flera gånger, t.ex. en rad per dag eller per situation. */
  repeatable?: {
    itemLabel: string;
    addLabel: string;
    min: number;
    max: number;
  };
  fields: Field[];
}

export type EntryValues = Record<string, string>;
/** sektions-id → lista av ifyllda poster (icke-repeterbara sektioner har exakt en). */
export type FormValues = Record<string, EntryValues[]>;

export const CATEGORIES = [
  "Tankar och känslor",
  "Beteende",
  "Ångest och exponering",
  "Sömn och vardag",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface HomeworkTemplate {
  slug: string;
  title: string;
  category: Category;
  /** En mening för biblioteket. */
  summary: string;
  /** Varför man gör övningen – till patienten. */
  intro: string;
  /** Konkreta instruktioner till patienten. */
  howTo: string[];
  minutes: string;
  sections: Section[];
  example: FormValues;
  /** Behandlarens instruktioner till AI-hjälpen för just denna mall. */
  aiContext: string;
}
