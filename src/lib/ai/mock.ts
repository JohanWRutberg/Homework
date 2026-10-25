import type { Field, HomeworkTemplate, Section } from "@/lib/templates/types";
import { CRISIS_MARKER } from "./crisis";
import { FIRST_QUESTION, type ChatMessage } from "./schema";

/** Skriv någon av dessa i en fråga i testläget för att prova flödena. */
export const MOCK_TRIGGERS = { crisis: "#kris", error: "#fel" } as const;

export class MockError extends Error {
  name = "MockError";
}

function exampleValue(template: HomeworkTemplate, section: Section, field: Field) {
  return template.example[section.id]?.find((entry) => entry[field.id])?.[field.id];
}

function guidingQuestion(field: Field): string {
  switch (field.type) {
    case "scale":
      return `Tänk dig en linje där ${field.min} betyder ”${field.minLabel.toLowerCase()}” och ${field.max} betyder ”${field.maxLabel.toLowerCase()}”. Hamnar du närmare början, mitten eller slutet? Börja där och justera sedan lite åt något håll.`;
    case "date":
    case "time":
    case "number":
      return "Det räcker med en ungefärlig uppskattning – ingen behöver exakta siffror. Ungefär hur var det, om du tänker efter en stund?";
    default:
      return "Vi tar det steg för steg. Tänk tillbaka på tillfället: var var du, och vad hände precis innan? Skriv gärna några ord – det behöver inte vara perfekt.";
  }
}

/**
 * Förutsägbara svar för att testa gränssnittet utan att anropa någon AI.
 * Bygger på mallens egna texter så att svaren ser realistiska ut.
 */
export function mockReply(
  template: HomeworkTemplate,
  section: Section,
  field: Field,
  messages: ChatMessage[]
): string {
  const question = messages.at(-1)!.content;
  const lower = question.toLowerCase();

  if (lower.includes(MOCK_TRIGGERS.crisis)) return CRISIS_MARKER;
  if (lower.includes(MOCK_TRIGGERS.error)) throw new MockError("Simulerat fel i testläget");

  if (question === FIRST_QUESTION) {
    const example = exampleValue(template, section, field);
    return example
      ? `${field.help}\n\nI exemplet för ${template.title.toLowerCase()} skrev någon: ”${example.replace(/[.!?]$/, "")}”. Ditt svar blir ditt eget – det finns inget rätt eller fel.`
      : field.help;
  }
  if (lower.includes("vet inte")) return guidingQuestion(field);
  if (lower.includes("enklare")) {
    const firstSentence = field.help.split(/(?<=[.!?])\s/)[0];
    return `Enkelt sagt: ${firstSentence} Skriv med dina egna ord – det finns inget rätt eller fel.`;
  }
  return `Bra fråga! ${field.help}\n\nBerätta gärna vad som känns svårt, så försöker jag förklara på ett annat sätt.`;
}

/** Strömmar text ord för ord, ungefär som en riktig modell. */
export function streamWords(
  text: string,
  signal: AbortSignal,
  delayMs = 30
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = text.split(/(?<=\s)/);
  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        if (signal.aborted) break;
        controller.enqueue(encoder.encode(word));
        await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.close();
    },
  });
}
