export type Mode = "genz_to_adult" | "adult_to_genz";
export type VisualMode = "genz" | "classic";
export type Page = "home" | "bridge";
export type ToneLabel = "formal" | "slang" | "emotional" | "neutral";

export type TranslationResult = {
  translated: string;
  explanation: string[];
  tone: string;
  readability: number;
  confidence: number;
  source?: "llm" | "fallback";
  extractedText?: string;
  screenshotSummary?: string;
  emotions?: string[];
  feeling?: string;
  inputType?: string;
  isValidInput?: boolean;
  validationMessage?: string;
};

export type Example = {
  id: string;
  mode: Mode;
  label: string;
  text: string;
};

export type DictionaryEntry = {
  term: string;
  classic: string;
  genz: string;
  definition: string;
  usageExample: string;
  tone: ToneLabel;
  synonyms: string[];
  category: "slang" | "formal" | "emotion" | "culture";
};
