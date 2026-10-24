import { describe, expect, it } from "vitest";
import { getTemplate } from "@/lib/templates";
import { containsCrisisSignal } from "./crisis";
import { buildSystemPrompt } from "./prompt";
import { rateLimit } from "./rate-limit";
import { helpRequestSchema } from "./schema";

describe("krisscreening", () => {
  it.each([
    "Jag vill inte leva längre",
    "ibland tänker jag på självmord",
    "Jag orkar inte mer",
    "jag har tänkt skada mig",
    "Jag vill  DÖ",
  ])("fångar: %s", (text) => {
    expect(containsCrisisSignal(text)).toBe(true);
  });

  it.each([
    "Vad menas med automatisk tanke?",
    "Jag förstår inte skillnaden mellan känsla och tanke",
    "Hur stark ska känslan vara?",
  ])("släpper igenom: %s", (text) => {
    expect(containsCrisisSignal(text)).toBe(false);
  });
});

describe("systemprompt", () => {
  it("innehåller mallens och fältets text men inga patientsvar", () => {
    const template = getTemplate("tankedagbok")!;
    const section = template.sections[0];
    const field = section.fields.find((f) => f.id === "tanke")!;
    const prompt = buildSystemPrompt(template, section, field);
    expect(prompt).toContain("Automatisk tanke");
    expect(prompt).toContain(template.aiContext);
    expect(prompt).toContain("[KRIS]");
    expect(prompt).not.toContain(template.example.situationer[0].tanke);
  });
});

describe("förfrågningsschema", () => {
  const base = { templateSlug: "tankedagbok", sectionId: "situationer", fieldId: "tanke" };

  it("godtar en normal fråga", () => {
    const result = helpRequestSchema.safeParse({
      ...base,
      messages: [{ role: "user", content: "Vad menas?" }],
    });
    expect(result.success).toBe(true);
  });

  it("avvisar för långa frågor och fel ordning", () => {
    expect(
      helpRequestSchema.safeParse({
        ...base,
        messages: [{ role: "user", content: "a".repeat(601) }],
      }).success
    ).toBe(false);
    expect(
      helpRequestSchema.safeParse({ ...base, messages: [{ role: "assistant", content: "Hej" }] })
        .success
    ).toBe(false);
  });
});

describe("rate limit", () => {
  it("stoppar efter gränsen och släpper när fönstret gått", () => {
    const opts = { limit: 2, windowMs: 1000 };
    expect(rateLimit("ip-test", opts, 0).ok).toBe(true);
    expect(rateLimit("ip-test", opts, 10).ok).toBe(true);
    const blocked = rateLimit("ip-test", opts, 20);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
    expect(rateLimit("ip-test", opts, 1001).ok).toBe(true);
  });
});
