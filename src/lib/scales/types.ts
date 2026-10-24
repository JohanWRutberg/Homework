export interface ResponseOption {
  label: string;
  /** Kort etikett för knappar i rättningsvyn. */
  short?: string;
  /** Poäng för alternativet (för omvända items räknas poängen om i scoreItem). */
  value: number;
}

export interface ScaleItem {
  n: number;
  /** Kort beskrivning av itemet – inte hela frågetexten. */
  label: string;
  subscale?: string;
  reversed?: boolean;
}

export type Severity = "none" | "mild" | "moderate" | "severe";

export interface SubscaleScore {
  name: string;
  score: number;
  max: number;
}

export interface ScaleResult {
  total: number;
  maxTotal: number;
  subscales: SubscaleScore[];
  interpretation: string;
  severity: Severity;
  journalText: string;
  /** Kliniska observandum som visas för behandlaren men inte hamnar i journaltexten. */
  flags: string[];
}

/** Ett svar per item: index i `options`, eller null om obesvarat. */
export type Answers = (number | null)[];

export interface ScaleDefinition {
  slug: string;
  name: string;
  fullName: string;
  purpose: string;
  description: string;
  reference: string;
  options: ResponseOption[];
  items: ScaleItem[];
  maxTotal: number;
  /** Visas som hjälp vid tolkningen, t.ex. cut-off eller gränsvärden. */
  norms: string[];
  compute: (scores: number[]) => ScaleResult;
}
