"use client";

import { Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { CRISIS_MARKER, containsCrisisSignal } from "@/lib/ai/crisis";
import {
  FIRST_QUESTION,
  MAX_ASSISTANT_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES,
  type ChatMessage,
} from "@/lib/ai/schema";
import { cn } from "@/lib/utils";
import { CrisisPanel } from "./CrisisPanel";

const QUICK_QUESTIONS = [
  FIRST_QUESTION,
  "Jag vet inte vad jag ska skriva. Kan du ställa frågor som hjälper mig?",
  "Kan du förklara det med ännu enklare ord?",
];

interface Props {
  templateSlug: string;
  sectionId: string;
  fieldId: string;
}

export function AiChat({ templateSlug, sectionId, fieldId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const limitReached = messages.length >= MAX_MESSAGES - 1;

  async function ask(question: string) {
    const content = question.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!content || pending) return;
    setError(null);

    if (containsCrisisSignal(content)) {
      setCrisis(true);
      return;
    }

    const history: ChatMessage[] = [
      ...messages.map((m) => ({ ...m, content: m.content.slice(0, MAX_ASSISTANT_LENGTH) })),
      { role: "user", content },
    ];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/hjalp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug, sectionId, fieldId, messages: history }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "AI-hjälpen svarar inte just nu. Försök igen om en stund.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        if (answer.trimStart().startsWith(CRISIS_MARKER)) {
          controller.abort();
          setCrisis(true);
          setMessages(messages);
          return;
        }
        // Visa inget som kan vara början på krismarkören.
        const visible = CRISIS_MARKER.startsWith(answer.trimStart()) ? "" : answer;
        setMessages([...history, { role: "assistant", content: visible }]);
      }
      if (!answer.trim()) throw new Error("Inget svar kom. Försök igen.");
    } catch (e) {
      if (controller.signal.aborted) return;
      setMessages(messages);
      setDraft(content);
      setError(e instanceof Error ? e.message : "Något gick fel.");
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  if (crisis) return <CrisisPanel />;

  return (
    <div className="mt-4 border-t border-ink/10 pt-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Sparkles className="size-4 text-brand-700" aria-hidden />
        Fråga AI-hjälpen
      </p>

      {messages.length > 0 && (
        <ol className="mt-3 space-y-3" aria-live="polite">
          {messages.map((m, i) => (
            <li
              key={i}
              className={cn(
                "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                m.role === "user"
                  ? "ml-auto rounded-br-md bg-ink text-paper"
                  : "rounded-bl-md bg-white text-ink ring-1 ring-line"
              )}
            >
              {m.content || <TypingDots />}
            </li>
          ))}
        </ol>
      )}

      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              disabled={pending}
              className="rounded-full border border-brand-300 bg-white px-3 py-1.5 text-left text-sm text-ink transition hover:border-brand-500 hover:bg-brand-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {limitReached ? (
        <p className="mt-3 text-sm text-ink-muted">
          Du har ställt många frågor om det här fältet. Ta gärna upp resten med din behandlare.
        </p>
      ) : (
        <form
          className="mt-3 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <label className="sr-only" htmlFor={`fraga-${sectionId}-${fieldId}`}>
            Din fråga
          </label>
          <textarea
            id={`fraga-${sectionId}-${fieldId}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(draft);
              }
            }}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={1}
            placeholder="Skriv en egen fråga …"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            aria-label="Skicka fråga"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition hover:bg-ink/85 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}

      <p className="mt-2 text-xs text-ink-muted">
        Skriv inte namn eller andra personuppgifter. AI-hjälpen förklarar – den fyller inte i åt dig
        och ersätter inte din behandlare. Svaren kan innehålla fel.
      </p>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Skriver …">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-ink-muted"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
