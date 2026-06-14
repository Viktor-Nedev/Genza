export type Mode = "genz_to_adult" | "adult_to_genz";

export type TranslationResult = {
  translated: string;
  explanation: string[];
  tone: string;
  readability: number;
  confidence: number;
  source?: "llm" | "fallback";
};

export type Example = {
  id: string;
  mode: Mode;
  label: string;
  text: string;
};

export type DictionaryEntry = {
  term: string;
  adult: string;
  genz: string;
};
