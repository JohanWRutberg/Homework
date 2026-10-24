/**
 * Enkel ordlistescreening som körs både i webbläsaren och på servern innan något skickas till AI:n.
 * Den är medvetet generös – hellre en hänvisning för mycket än en för lite.
 */
const CRISIS_PATTERNS: RegExp[] = [
  /självmord/,
  /suicid/,
  /ta\s+(livet\s+av\s+mig|mitt\s+(eget\s+)?liv)/,
  /vill\s+(inte\s+leva|dö)/,
  /orkar\s+inte\s+(leva|längre|mer)/,
  /inte\s+vill\s+leva/,
  /(skada|skära|döda)\s+mig/,
  /hänga\s+mig/,
  /överdos/,
  /avsluta\s+(allt|mitt\s+liv)/,
  /vara\s+död/,
  /inte\s+finnas\s+(till|kvar)/,
  /kill\s+myself/,
  /want\s+to\s+die/,
];

export function containsCrisisSignal(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  return CRISIS_PATTERNS.some((pattern) => pattern.test(normalized));
}

/** Markör som modellen instrueras att svara med om den ser tecken på kris. */
export const CRISIS_MARKER = "[KRIS]";
