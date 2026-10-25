import { describe, expect, it } from "vitest";
import { getTemplate } from "@/lib/templates";
import { CRISIS_MARKER } from "./crisis";
import { MockError, mockReply } from "./mock";
import { pickModel, resolveAiConfig } from "./models";
import { FIRST_QUESTION } from "./schema";

describe("resolveAiConfig", () => {
  it("är avstängd i produktion utan nyckel", () => {
    expect(resolveAiConfig({ NODE_ENV: "production" })).toBeNull();
  });

  it("använder testläge automatiskt i utveckling utan nyckel", () => {
    const config = resolveAiConfig({ NODE_ENV: "development" })!;
    expect(config.defaultModel).toBe("mock");
    expect(config.options.map((o) => o.id)).toEqual(["mock"]);
  });

  it("använder Sonnet 5.5 som standard när nyckel finns", () => {
    const config = resolveAiConfig({ NODE_ENV: "production", ANTHROPIC_API_KEY: "x" })!;
    expect(config.defaultModel).toBe("claude-sonnet-5-5");
    expect(config.options).toEqual([]);
  });

  it("följer AI_MODEL och visar väljaren när AI_MODEL_SWITCHER=1", () => {
    const config = resolveAiConfig({
      NODE_ENV: "production",
      ANTHROPIC_API_KEY: "x",
      AI_MODEL: "claude-haiku-5-5",
      AI_MODEL_SWITCHER: "1",
    })!;
    expect(config.defaultModel).toBe("claude-haiku-5-5");
    expect(config.options.map((o) => o.id)).toEqual([
      "mock",
      "claude-haiku-5-5",
      "claude-sonnet-5-5",
      "claude-opus-5-5",
    ]);
  });

  it("tillåter testläge i produktion utan nyckel", () => {
    expect(resolveAiConfig({ NODE_ENV: "production", AI_MODEL: "mock" })!.defaultModel).toBe(
      "mock"
    );
  });

  it("stoppar felstavade modellnamn direkt", () => {
    expect(() => resolveAiConfig({ ANTHROPIC_API_KEY: "x", AI_MODEL: "claude-haiku" })).toThrow(
      /Okänt AI_MODEL/
    );
  });
});

describe("pickModel", () => {
  it("ignorerar klientens val när väljaren är avstängd", () => {
    const config = resolveAiConfig({ NODE_ENV: "production", ANTHROPIC_API_KEY: "x" })!;
    expect(pickModel(config, "claude-opus-5-5")).toBe("claude-sonnet-5-5");
  });

  it("godtar bara modeller som finns i väljaren", () => {
    const config = resolveAiConfig({ NODE_ENV: "development", ANTHROPIC_API_KEY: "x" })!;
    expect(pickModel(config, "claude-haiku-5-5")).toBe("claude-haiku-5-5");
    expect(pickModel(config, "gpt-5")).toBe(config.defaultModel);
  });
});

describe("testläge", () => {
  const template = getTemplate("tankedagbok")!;
  const section = template.sections[0];
  const field = section.fields.find((f) => f.id === "tanke")!;
  const ask = (content: string) => mockReply(template, section, field, [{ role: "user", content }]);

  it("förklarar fältet och visar mallens exempel", () => {
    const reply = ask(FIRST_QUESTION);
    expect(reply).toContain(field.help);
    expect(reply).toContain("”Jag har gjort något fel och kommer att få sparken”.");
    expect(reply).not.toContain(".”.");
  });

  it("ställer en guidande fråga när patienten inte vet vad hen ska skriva", () => {
    expect(ask("Jag vet inte vad jag ska skriva")).toMatch(/steg för steg/);
  });

  it("kan simulera kris och fel", () => {
    expect(ask("test #kris")).toBe(CRISIS_MARKER);
    expect(() => ask("test #fel")).toThrow(MockError);
  });
});
