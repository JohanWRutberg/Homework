import { describe, expect, it } from "vitest";
import { scales } from "./index";
import { gad7 } from "./gad7";
import { madrss } from "./madrss";
import { ocir } from "./ocir";
import { raads14 } from "./raads14";
import { evaluate, scoreItem } from "./scoring";
import type { ScaleDefinition } from "./types";

/** Välj det alternativ som ger önskad råpoäng (före ev. omvändning). */
function optionFor(scale: ScaleDefinition, value: number): number {
  const index = scale.options.findIndex((o) => o.value === value);
  if (index < 0) throw new Error(`Inget alternativ med värde ${value}`);
  return index;
}

function answersFromScores(scale: ScaleDefinition, scores: number[]) {
  return scale.items.map((item, i) => {
    const max = Math.max(...scale.options.map((o) => o.value));
    const raw = item.reversed ? max - scores[i] : scores[i];
    return optionFor(scale, raw);
  });
}

describe("alla skattningar", () => {
  it.each(scales.map((s) => [s.name, s]))("%s har numrerade items och unik slug", (_, scale) => {
    const s = scale as ScaleDefinition;
    expect(s.items.map((i) => i.n)).toEqual(s.items.map((_, i) => i + 1));
    expect(scales.filter((x) => x.slug === s.slug)).toHaveLength(1);
  });

  it.each(scales.map((s) => [s.name, s]))("%s ger maxpoäng vid högsta svar", (_, scale) => {
    const s = scale as ScaleDefinition;
    const top = Math.max(...s.options.map((o) => o.value));
    const result = evaluate(
      s,
      answersFromScores(
        s,
        s.items.map(() => top)
      )
    )!;
    expect(result.total).toBe(s.maxTotal);
  });

  it("ger inget resultat förrän alla items är besvarade", () => {
    const answers = gad7.items.map(() => 0 as number | null);
    answers[3] = null;
    expect(evaluate(gad7, answers)).toBeNull();
  });
});

describe("RAADS-14", () => {
  it("vänder fråga 6", () => {
    const item6 = raads14.items[5];
    expect(item6.reversed).toBe(true);
    // "Stämmer nu och när jag var ung" på "Jag är bra på att småprata" = 0 poäng
    expect(scoreItem(raads14, item6, 0)).toBe(0);
    expect(scoreItem(raads14, item6, 3)).toBe(3);
  });

  it("räknar delskalor enligt Eriksson et al. 2013", () => {
    // Bara mentaliseringsitems = 3, resten 0
    const scores = raads14.items.map((i) => (i.subscale === "Mentaliseringssvårigheter" ? 3 : 0));
    const result = evaluate(raads14, answersFromScores(raads14, scores))!;
    expect(result.subscales.map((s) => s.score)).toEqual([21, 0, 0]);
    expect(result.total).toBe(21);
  });

  it("13 poäng ligger under cut-off – Excel-mallen sa felaktigt alltid över", () => {
    const scores = [3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = evaluate(raads14, answersFromScores(raads14, scores))!;
    expect(result.total).toBe(13);
    expect(result.journalText).toBe(
      "RAADS-14 genomfördes. Resultat: Mentaliseringssvårigheter = 6, Social ångest = 4, Sensorisk reaktivitet = 3. Totalpoäng = 13. Resultatet ligger under cut-off (14 poäng) och talar inte för tydliga autismspektrumdrag enligt detta instrument. Resultatet bör tolkas i relation till övrig anamnes och klinisk bedömning."
    );
  });

  it("14 poäng ligger på cut-off och ger rekommendation om utredning", () => {
    const scores = [3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = evaluate(raads14, answersFromScores(raads14, scores))!;
    expect(result.total).toBe(14);
    expect(result.journalText).toContain("över cut-off (≥14)");
  });
});

describe("GAD-7", () => {
  it.each([
    [4, "Minimal ångest", "inga kliniskt signifikanta ångestbesvär"],
    [5, "Mild ångest", "lindriga ångestbesvär"],
    [9, "Mild ångest", "lindriga ångestbesvär"],
    [10, "Måttlig ångest", "måttliga ångestbesvär"],
    [14, "Måttlig ångest", "måttliga ångestbesvär"],
    [15, "Svår ångest", "uttalade ångestbesvär"],
  ])("%i poäng → %s", (total, interpretation, finding) => {
    const scores = [0, 0, 0, 0, 0, 0, 0];
    let left = total;
    for (let i = 0; i < scores.length && left > 0; i++) {
      scores[i] = Math.min(3, left);
      left -= scores[i];
    }
    const result = evaluate(gad7, answersFromScores(gad7, scores))!;
    expect(result.interpretation).toBe(interpretation);
    expect(result.journalText).toBe(
      `Självskattning med GAD-7 visar en totalpoäng på ${total} poäng, motsvarande ${interpretation.toLowerCase()}. Resultatet talar för ${finding}.`
    );
  });
});

describe("OCI-R", () => {
  it("fördelar poäng på rätt delskala", () => {
    // fråga 5, 11, 17 = tvätt
    const scores = Array(18).fill(0);
    scores[4] = 4;
    scores[10] = 4;
    scores[16] = 4;
    const result = evaluate(ocir, answersFromScores(ocir, scores))!;
    expect(result.subscales.find((s) => s.name === "Tvätt")!.score).toBe(12);
    expect(result.total).toBe(12);
    expect(result.journalText).toBe(
      "Självskattning med OCI-R visar en totalpoäng på 12 poäng (maxpoäng 72), vilket ligger under klinisk gräns. Resultatet indikerar inga tydliga kliniskt signifikanta tvångssymtom. Symtombilden fördelar sig inom undersökta områden enligt följande: tvätt 12, kontroll 0, ordning 0, samlande 0, tvångstankar 0 samt neutralisering 0."
    );
  });

  it("21 poäng är över klinisk gräns", () => {
    const scores = [4, 4, 4, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = evaluate(ocir, answersFromScores(ocir, scores))!;
    expect(result.total).toBe(21);
    expect(result.journalText).toContain(
      "vilket ligger över klinisk gräns (indikerar möjligen tvångssymtom). Resultatet indikerar möjligen förekomst av kliniskt relevanta tvångssymtom."
    );
  });
});

describe("MADRS-S", () => {
  it("listar delpoäng för fråga 1–9 och tolkar livslust", () => {
    const scores = [2, 3, 4, 1, 2, 2, 1, 2, 3];
    const result = evaluate(madrss, answersFromScores(madrss, scores))!;
    expect(result.total).toBe(20);
    expect(result.journalText).toBe(
      "MADRS-S: total 20 poäng (Inom ramen för måttlig depression), förenligt med måttliga symtom. Delpoäng: [2; 3; 4; 1; 2; 2; 1; 2; 3]. Fråga 9 (livslust) = 3 poäng, vilket indikerar viss minskning av livslust."
    );
    expect(result.flags).toEqual([]);
  });

  it("skriver inte 'symtom symtom' vid låga poäng", () => {
    const result = evaluate(madrss, answersFromScores(madrss, Array(9).fill(0)))!;
    expect(result.journalText).toContain("förenligt med inga tydliga depressiva symtom.");
    expect(result.journalText).not.toContain("symtom symtom");
  });

  it.each([
    [12, "Ingen eller mycket lindrig depression"],
    [13, "Inom ramen för lindrig depression"],
    [19, "Inom ramen för lindrig depression"],
    [20, "Inom ramen för måttlig depression"],
    [34, "Inom ramen för måttlig depression"],
    [35, "Kan tolkas som svår depression"],
  ])("%i poäng → %s", (total, interpretation) => {
    const scores = Array(9).fill(0);
    let left = total;
    for (let i = 0; i < 8 && left > 0; i++) {
      scores[i] = Math.min(6, left);
      left -= scores[i];
    }
    scores[8] = left;
    const result = evaluate(madrss, answersFromScores(madrss, scores))!;
    expect(result.total).toBe(total);
    expect(result.interpretation).toBe(interpretation);
  });

  it("flaggar förhöjd poäng på livslust", () => {
    const four = evaluate(madrss, answersFromScores(madrss, [0, 0, 0, 0, 0, 0, 0, 0, 4]))!;
    expect(four.flags).toHaveLength(1);
    expect(four.journalText).toContain("indikerar viss minskning av livslust");
    const five = evaluate(madrss, answersFromScores(madrss, [0, 0, 0, 0, 0, 0, 0, 0, 5]))!;
    expect(five.journalText).toContain("indikerar tydlig minskning av livslust");
  });
});
