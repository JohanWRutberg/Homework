export const LIVE_MODELS = [
  // Haiku 5.5 saknar server-side fallback vid nekade svar.
  { id: "claude-haiku-5-5", label: "Haiku 5.5", serverFallback: false },
  { id: "claude-sonnet-5-5", label: "Sonnet 5.5", serverFallback: true },
  { id: "claude-opus-5-5", label: "Opus 5.5", serverFallback: true },
] as const;

export const MOCK_MODEL = { id: "mock", label: "Testläge (ingen AI)" } as const;

export type LiveModelId = (typeof LIVE_MODELS)[number]["id"];
export type ModelId = LiveModelId | typeof MOCK_MODEL.id;

export interface ModelOption {
  id: ModelId;
  label: string;
}

/** Det klienten behöver veta om AI-hjälpen. Innehåller aldrig nycklar. */
export interface AiClientConfig {
  defaultModel: ModelId;
  /** Valbara modeller i jämförelseläget – tom lista betyder att väljaren är dold. */
  options: ModelOption[];
}

export interface AiEnv {
  ANTHROPIC_API_KEY?: string;
  AI_MODEL?: string;
  AI_MODEL_SWITCHER?: string;
  NODE_ENV?: string;
}

const DEFAULT_LIVE_MODEL: LiveModelId = "claude-sonnet-5-5";

export function isLiveModel(id: string): id is LiveModelId {
  return LIVE_MODELS.some((m) => m.id === id);
}

export function modelLabel(id: ModelId): string {
  return id === MOCK_MODEL.id ? MOCK_MODEL.label : LIVE_MODELS.find((m) => m.id === id)!.label;
}

export function hasServerFallback(id: LiveModelId): boolean {
  return LIVE_MODELS.find((m) => m.id === id)!.serverFallback;
}

/**
 * Avgör om och hur AI-hjälpen är aktiv:
 * - AI_MODEL=mock → testläge utan nyckel och utan kostnad
 * - API-nyckel finns → AI_MODEL, annars Sonnet 5.5
 * - utvecklingsläge utan nyckel → testläge automatiskt
 * - AI_MODEL_SWITCHER=1 (alltid i utveckling) → modellväljare för jämförelser
 */
export function resolveAiConfig(env: AiEnv): AiClientConfig | null {
  const hasKey = Boolean(env.ANTHROPIC_API_KEY);
  const isDev = env.NODE_ENV === "development";
  const raw = env.AI_MODEL?.trim() || undefined;

  if (raw && raw !== MOCK_MODEL.id && !isLiveModel(raw)) {
    const valid = [MOCK_MODEL.id, ...LIVE_MODELS.map((m) => m.id)].join(", ");
    throw new Error(`Okänt AI_MODEL "${raw}". Giltiga värden: ${valid}`);
  }
  const requested = raw as ModelId | undefined;

  let defaultModel: ModelId;
  if (requested === MOCK_MODEL.id) defaultModel = MOCK_MODEL.id;
  else if (hasKey) defaultModel = requested ?? DEFAULT_LIVE_MODEL;
  else if (isDev) defaultModel = MOCK_MODEL.id;
  else return null;

  const switcher = env.AI_MODEL_SWITCHER === "1" || isDev;
  const options: ModelOption[] = switcher
    ? [MOCK_MODEL, ...(hasKey ? LIVE_MODELS.map(({ id, label }) => ({ id, label })) : [])]
    : [];

  return { defaultModel, options };
}

/** Klienten får bara välja bland modellerna i jämförelseläget – annars gäller standardmodellen. */
export function pickModel(config: AiClientConfig, requested?: string): ModelId {
  const option = config.options.find((o) => o.id === requested);
  return option ? option.id : config.defaultModel;
}
