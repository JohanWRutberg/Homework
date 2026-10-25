import Anthropic from "@anthropic-ai/sdk";
import { getAiConfig } from "@/lib/ai/config";
import { CRISIS_MARKER, containsCrisisSignal } from "@/lib/ai/crisis";
import { mockReply, streamWords } from "@/lib/ai/mock";
import { hasServerFallback, pickModel, type LiveModelId } from "@/lib/ai/models";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { rateLimit } from "@/lib/ai/rate-limit";
import { helpRequestSchema, type ChatMessage } from "@/lib/ai/schema";
import { getTemplate } from "@/lib/templates";

export const maxDuration = 60;

const MAX_BODY_BYTES = 24_000;
const PER_CLIENT = { limit: 20, windowMs: 10 * 60_000 };
const PER_INSTANCE = { limit: 600, windowMs: 60 * 60_000 };

const REFUSAL_TEXT =
  "\n\nJag kan tyvärr inte svara på det här. Fråga gärna din behandlare vid nästa tillfälle.";
const ERROR_TEXT =
  "\n\nNågot gick fel och svaret blev inte klart. Försök igen om en stund – eller läs förklaringen ovanför fältet.";

const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic({ maxRetries: 1, timeout: 45_000 });
  return client;
}

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "okänd";
}

function textResponse(text: string) {
  return new Response(text, { headers: STREAM_HEADERS });
}

export async function POST(request: Request) {
  const config = getAiConfig();
  if (!config) return jsonError(503, "AI-hjälpen är inte aktiverad.");

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return jsonError(403, "Otillåten källa.");
  }

  for (const [key, opts] of [
    [clientKey(request), PER_CLIENT],
    ["instans", PER_INSTANCE],
  ] as const) {
    const limited = rateLimit(key, opts);
    if (!limited.ok) {
      return jsonError(
        429,
        "Du har ställt många frågor på kort tid. Vänta en stund och försök igen.",
        { "Retry-After": String(limited.retryAfterSeconds) }
      );
    }
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return jsonError(413, "Frågan är för lång.");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(400, "Ogiltig förfrågan.");
  }

  const parsed = helpRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Ogiltig förfrågan.");
  const { templateSlug, sectionId, fieldId, messages } = parsed.data;

  const template = getTemplate(templateSlug);
  const section = template?.sections.find((s) => s.id === sectionId);
  const field = section?.fields.find((f) => f.id === fieldId);
  if (!template || !section || !field) return jsonError(404, "Okänt fält.");

  // Krisscreening före AI-anropet – inget skickas vidare om det finns tecken på kris.
  if (messages.some((m) => m.role === "user" && containsCrisisSignal(m.content))) {
    return textResponse(CRISIS_MARKER);
  }

  const model = pickModel(config, parsed.data.model);

  if (model === "mock") {
    let reply: string;
    try {
      reply = mockReply(template, section, field, messages);
    } catch {
      reply = ERROR_TEXT.trim();
    }
    return new Response(streamWords(reply, request.signal), { headers: STREAM_HEADERS });
  }

  return liveResponse(request, model, buildSystemPrompt(template, section, field), messages);
}

function liveResponse(
  request: Request,
  model: LiveModelId,
  system: string,
  messages: ChatMessage[]
) {
  const stream = getClient().beta.messages.stream(
    {
      model,
      max_tokens: 4096,
      output_config: { effort: "low" },
      ...(hasServerFallback(model)
        ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
        : {}),
      system,
      messages,
    },
    { signal: request.signal }
  );

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(encoder.encode(REFUSAL_TEXT));
        // Endast metadata – för att kunna följa kostnaden per modell. Aldrig innehåll.
        console.info("AI-hjälp", {
          model: final.model,
          input_tokens: final.usage.input_tokens,
          output_tokens: final.usage.output_tokens,
        });
      } catch (error) {
        // Logga aldrig innehåll – bara feltyp och status.
        if (!request.signal.aborted) {
          const status = error instanceof Anthropic.APIError ? error.status : undefined;
          console.error("AI-hjälp misslyckades", { model, type: (error as Error)?.name, status });
          controller.enqueue(encoder.encode(ERROR_TEXT));
        }
      } finally {
        try {
          controller.close();
        } catch {
          // redan stängd (klienten avbröt)
        }
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, { headers: STREAM_HEADERS });
}
