import { lowerFirst, sum } from "./scoring";
import type { ScaleDefinition, Severity } from "./types";

function classify(total: number): { interpretation: string; finding: string; severity: Severity } {
  if (total <= 4)
    return {
      interpretation: "Minimal ångest",
      finding: "inga kliniskt signifikanta ångestbesvär",
      severity: "none",
    };
  if (total <= 9)
    return { interpretation: "Mild ångest", finding: "lindriga ångestbesvär", severity: "mild" };
  if (total <= 14)
    return {
      interpretation: "Måttlig ångest",
      finding: "måttliga ångestbesvär",
      severity: "moderate",
    };
  return { interpretation: "Svår ångest", finding: "uttalade ångestbesvär", severity: "severe" };
}

export const gad7: ScaleDefinition = {
  slug: "gad-7",
  name: "GAD-7",
  fullName: "Generalized Anxiety Disorder 7-item scale",
  purpose: "Skattning av generaliserad ångest de senaste två veckorna",
  description:
    "Markera hur ofta patienten besvärats av respektive problem de senaste två veckorna.",
  reference:
    "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med 2006;166:1092–1097.",
  options: [
    { label: "Inte alls", value: 0 },
    { label: "Flera dagar", value: 1 },
    { label: "Mer än hälften av dagarna", short: "Över hälften", value: 2 },
    { label: "Nästan varje dag", value: 3 },
  ],
  items: [
    { n: 1, label: "Känt sig nervös, ängslig eller väldigt stressad" },
    { n: 2, label: "Inte kunnat sluta oroa sig eller kontrollera oron" },
    { n: 3, label: "Oroat sig för mycket för olika saker" },
    { n: 4, label: "Haft svårt att slappna av" },
    { n: 5, label: "Varit så rastlös att det varit svårt att sitta still" },
    { n: 6, label: "Blivit lätt irriterad eller retlig" },
    { n: 7, label: "Känt sig rädd, som om något hemskt skulle hända" },
  ],
  maxTotal: 21,
  norms: ["0–4 minimal", "5–9 mild", "10–14 måttlig", "15–21 svår ångest"],
  compute(scores) {
    const total = sum(scores);
    const { interpretation, finding, severity } = classify(total);
    return {
      total,
      maxTotal: 21,
      subscales: [],
      interpretation,
      severity,
      journalText: `Självskattning med GAD-7 visar en totalpoäng på ${total} poäng, motsvarande ${lowerFirst(interpretation)}. Resultatet talar för ${finding}.`,
      flags: [],
    };
  },
};
