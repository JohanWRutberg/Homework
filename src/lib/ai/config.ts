import "server-only";

export const AI_MODEL = "claude-opus-5-5";

/** AI-hjälpen visas bara när en API-nyckel är konfigurerad. */
export function isAiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
