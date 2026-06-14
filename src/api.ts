import type { Mode, TranslationResult } from "./types";

const localFallbacks: Record<Mode, TranslationResult> = {
  genz_to_adult: {
    translated: "This message has been rewritten in a clearer, more neutral tone.",
    explanation: ["Adjusted slang into standard language.", "Preserved the original meaning."],
    tone: "clear",
    readability: 0.78,
    confidence: 0.62,
    source: "fallback"
  },
  adult_to_genz: {
    translated: "This message is now shorter and more casual fr.",
    explanation: ["Shortened the phrasing.", "Adjusted the tone for a casual audience."],
    tone: "casual",
    readability: 0.74,
    confidence: 0.62,
    source: "fallback"
  }
};

export async function translateMessage(text: string, mode: Mode): Promise<TranslationResult> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Translation failed.");
  }

  return response.json();
}

export function getClientFallback(mode: Mode, text: string): TranslationResult {
  if (!text.trim()) {
    return {
      translated: "",
      explanation: ["Enter a message to translate."],
      tone: "neutral",
      readability: 0,
      confidence: 0,
      source: "fallback"
    };
  }

  return localFallbacks[mode];
}
