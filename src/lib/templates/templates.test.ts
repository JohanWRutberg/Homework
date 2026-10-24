import { describe, expect, it } from "vitest";
import { emptyValues, getTemplate, hasAnyValue, templates } from "./index";

describe("hemuppgiftsmallar", () => {
  it("har unika slugs", () => {
    const slugs = templates.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(templates.map((t) => [t.slug, t]))(
    "%s har unika sektions- och fält-id",
    (_, template) => {
      const t = template as (typeof templates)[number];
      const sectionIds = t.sections.map((s) => s.id);
      expect(new Set(sectionIds).size).toBe(sectionIds.length);
      for (const section of t.sections) {
        const fieldIds = section.fields.map((f) => f.id);
        expect(new Set(fieldIds).size).toBe(fieldIds.length);
        for (const field of section.fields) expect(field.help.length).toBeGreaterThan(20);
      }
    }
  );

  it.each(templates.map((t) => [t.slug, t]))(
    "%s har ett exempel som passar mallen",
    (_, template) => {
      const t = template as (typeof templates)[number];
      for (const [sectionId, entries] of Object.entries(t.example)) {
        const section = t.sections.find((s) => s.id === sectionId);
        expect(section, `okänd sektion ${sectionId}`).toBeDefined();
        for (const entry of entries) {
          for (const [fieldId, value] of Object.entries(entry)) {
            const field = section!.fields.find((f) => f.id === fieldId);
            expect(field, `okänt fält ${sectionId}.${fieldId}`).toBeDefined();
            if (field!.type === "scale" || field!.type === "number") {
              const n = Number(value);
              expect(n).toBeGreaterThanOrEqual(field!.min);
              expect(n).toBeLessThanOrEqual(field!.max);
            }
          }
        }
      }
    }
  );

  it("skapar tomma värden med rätt antal poster", () => {
    const values = emptyValues(getTemplate("exponeringstrappa")!);
    expect(values.steg).toHaveLength(3);
    expect(values.mal).toHaveLength(1);
    expect(hasAnyValue(values)).toBe(false);
    values.mal[0].mal = "Åka buss";
    expect(hasAnyValue(values)).toBe(true);
  });
});
