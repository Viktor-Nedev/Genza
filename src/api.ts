import type { Mode, TranslationResult } from "./types";

const localFallbacks: Record<Mode, TranslationResult> = {
  genz_to_adult: {
    translated: "This message has been rewritten in a clearer, more neutral tone.",
    explanation: [
      "Slang conversion: adjusted casual wording into standard language.",
      "Tone shift: reduced emotional exaggeration while preserving the concern.",
      "Simplification: kept the sentence direct and readable."
    ],
    tone: "clear",
    readability: 0.78,
    confidence: 0.62,
    source: "fallback"
  },
  adult_to_genz: {
    translated: "This message is now shorter and more casual fr.",
    explanation: [
      "Tone shift: shortened the phrasing for a casual audience.",
      "Cultural adaptation: added a light Gen Z emphasis marker.",
      "Simplification: reduced formal structure."
    ],
    tone: "casual",
    readability: 0.74,
    confidence: 0.62,
    source: "fallback"
  }
};

export async function translateMessage(text: string, mode: Mode): Promise<TranslationResult> {
  const response = await fetch("/translate", {
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

export async function translateScreenshot(
  imageDataUrl: string,
  mode: Mode,
  text = ""
): Promise<TranslationResult & { extractedText?: string; screenshotSummary?: string }> {
  const response = await fetch("/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageDataUrl, text, mode })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Screenshot analysis failed.");
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
