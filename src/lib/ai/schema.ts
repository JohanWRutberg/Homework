import { z } from "zod";

export const MAX_MESSAGE_LENGTH = 600;
export const MAX_MESSAGES = 10;
export const MAX_ASSISTANT_LENGTH = 2000;

export const FIRST_QUESTION = "Kan du förklara vad jag ska skriva här, med ett enkelt exempel?";

export const helpRequestSchema = z.object({
  templateSlug: z.string().min(1).max(64),
  sectionId: z.string().min(1).max(64),
  fieldId: z.string().min(1).max(64),
  /** Gäller bara i jämförelseläget – servern ignorerar modeller som inte är tillåtna. */
  model: z.string().max(40).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(MAX_ASSISTANT_LENGTH),
      })
    )
    .min(1)
    .max(MAX_MESSAGES)
    .refine((messages) => messages[0].role === "user", "Första meddelandet måste vara patientens.")
    .refine(
      (messages) => messages.at(-1)!.role === "user",
      "Sista meddelandet måste vara patientens."
    )
    .refine(
      (messages) =>
        messages.every((m) => m.role === "assistant" || m.content.length <= MAX_MESSAGE_LENGTH),
      "Frågan är för lång."
    ),
});

export type HelpRequest = z.infer<typeof helpRequestSchema>;
export type ChatMessage = HelpRequest["messages"][number];
