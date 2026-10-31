import "server-only";
import { resolveAiConfig, type AiClientConfig } from "./models";

/** Läser miljövariablerna. null betyder att AI-hjälpen är avstängd och döljs. */
export function getAiConfig(): AiClientConfig | null {
  return resolveAiConfig({
    AI_ENABLED: process.env.AI_ENABLED,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AI_MODEL_SWITCHER: process.env.AI_MODEL_SWITCHER,
    NODE_ENV: process.env.NODE_ENV,
  });
}
