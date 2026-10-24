import { sum } from "./scoring";
import type { ScaleDefinition, Severity } from "./types";

const LIFE_ITEM = 9;

function classify(total: number): { interpretation: string; finding: string; severity: Severity } {
  if (total <= 12)
    return {
      interpretation: "Ingen eller mycket lindrig depression",
      finding: "inga tydliga depressiva",
      severity: "none",
    };
  if (total <= 19)
    return {
      interpretation: "Inom ramen för lindrig depression",
      finding: "lindriga",
      severity: "mild",
    };
  if (total <= 34)
    return {
      interpretation: "Inom ramen för måttlig depression",
      finding: "måttliga",
      severity: "moderate",
    };
  return {
    interpretation: "Kan tolkas som svår depression",
    finding: "uttalade",
    severity: "severe",
  };
}

function lifeFinding(score: number): string {
  if (score <= 2) return "bevarad livslust";
  if (score <= 4) return "viss minskning av livslust";
  if (score <= 6) return "tydlig minskning av livslust";
  return "avsaknad av livslust";
}

export const madrss: ScaleDefinition = {
  slug: "madrs-s",
  name: "MADRS-S",
  fullName: "Montgomery-Åsberg Depression Rating Scale – självskattning",
  purpose: "Skattning av depressiva symtom senaste tre dygnen",
  description:
    "Ange den poäng (0–6) patienten markerat för respektive område. Mellanlägen (1, 3, 5) används när patienten kryssat mellan två påståenden.",
  reference:
    "Svanborg P, Åsberg M. A new self-rating scale for depression and anxiety states based on the Comprehensive Psychopathological Rating Scale. Acta Psychiatr Scand 1994;89:21–28.",
  options: [0, 1, 2, 3, 4, 5, 6].map((v) => ({ label: String(v), value: v })),
  items: [
    { n: 1, label: "Sinnesstämning" },
    { n: 2, label: "Oroskänslor" },
    { n: 3, label: "Sömn" },
    { n: 4, label: "Matlust" },
    { n: 5, label: "Koncentrationsförmåga" },
    { n: 6, label: "Initiativförmåga" },
    { n: 7, label: "Känslomässigt engagemang" },
    { n: 8, label: "Pessimism" },
    { n: 9, label: "Livslust" },
  ],
  maxTotal: 54,
  norms: ["0–12 ingen/mycket lindrig", "13–19 lindrig", "20–34 måttlig", "35–54 svår depression"],
  compute(scores) {
    const total = sum(scores);
    const { interpretation, finding, severity } = classify(total);
    const life = scores[LIFE_ITEM - 1];

    const journalText =
      `MADRS-S: total ${total} poäng (${interpretation}), förenligt med ${finding} symtom. ` +
      `Delpoäng: [${scores.join("; ")}]. ` +
      `Fråga 9 (livslust) = ${life} poäng, vilket indikerar ${lifeFinding(life)}.`;

    const flags =
      life >= 4
        ? [
            `Fråga 9 (livslust) = ${life}. Överväg strukturerad bedömning av suicidrisk i samband med besöket.`,
          ]
        : [];

    return { total, maxTotal: 54, subscales: [], interpretation, severity, journalText, flags };
  },
};
