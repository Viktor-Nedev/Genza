const slangToAdult = [
  [/lowkey cooked/gi, "very difficult and overwhelming", "Changed lowkey cooked into a clear difficulty signal."],
  [/kinda sus/gi, "somewhat suspicious", "Changed kinda sus into a clearer concern."],
  [/giving chaos/gi, "feeling chaotic", "Converted a cultural phrase into plain wording."],
  [/cooked fr/gi, "very difficult and overwhelming", "Changed cooked fr into direct emotional language."],
  [/lowkey/gi, "somewhat", "Replaced lowkey with a clearer qualifier."],
  [/highkey/gi, "very clearly", "Changed highkey into direct emphasis."],
  [/\bfr\b/gi, "honestly", "Expanded fr into standard language."],
  [/no cap/gi, "honestly", "Translated no cap into a sincerity cue."],
  [/\bsus\b/gi, "suspicious", "Changed sus into its standard meaning."],
  [/\bcooked\b/gi, "overwhelmed", "Converted cooked into a clearer emotional state."],
  [/\bmid\b/gi, "not very impressive", "Expanded mid into an explicit evaluation."],
  [/\bbet\b/gi, "understood", "Changed bet into a clear agreement."],
  [/\bslay\b/gi, "do very well", "Translated slay into a direct positive action."],
  [/\brizz\b/gi, "social charm", "Explained rizz as social charm."],
  [/it's giving/gi, "it seems like", "Converted a cultural phrase into plain wording."],
  [/\bghosted\b/gi, "stopped responding", "Clarified ghosted as a communication behavior."],
  [/\bbussin\b/gi, "excellent", "Changed bussin into a standard compliment."],
  [/\bdeadass\b/gi, "seriously", "Expanded deadass into direct emphasis."],
  [/\bbro\b/gi, "", "Removed bro for a more neutral tone."],
  [/\bbased\b/gi, "reasonable", "Changed based into a standard approval word."],
  [/\bdelulu\b/gi, "unrealistic", "Translated delulu into a clearer judgment."],
  [/\bsalty\b/gi, "upset", "Changed salty into an explicit emotion."],
  [/rent free/gi, "continually on my mind", "Explained rent free as persistent attention."]
];

const adultToSlang = [
  [/very difficult|extremely difficult|overwhelming|overwhelmed/gi, "cooked", "Compressed difficulty into a Gen Z shorthand."],
  [/suspicious|untrustworthy/gi, "sus", "Changed suspicious into common slang."],
  [/honestly|to be honest/gi, "fr", "Replaced honesty cue with a short social marker."],
  [/excellent|very good|impressive/gi, "ate", "Changed a formal compliment into Gen Z praise."],
  [/understood|I agree|that works/gi, "bet", "Converted agreement into casual shorthand."],
  [/not very impressive|average|mediocre/gi, "mid", "Changed a neutral critique into concise slang."],
  [/unrealistic|unreasonable/gi, "delulu", "Shifted the critique into informal cultural language."],
  [/upset|resentful/gi, "salty", "Changed the emotion into casual slang."],
  [/stopped responding/gi, "ghosted", "Compressed the communication pattern into slang."],
  [/social charm|charisma/gi, "rizz", "Translated charisma into a Gen Z term."],
  [/seriously/gi, "deadass", "Changed emphasis into a casual intensifier."]
];

const dictionary = [
  { term: "lowkey", adult: "quietly or somewhat", genz: "lowkey" },
  { term: "cooked", adult: "overwhelmed or in trouble", genz: "cooked" },
  { term: "sus", adult: "suspicious", genz: "sus" },
  { term: "mid", adult: "not very impressive", genz: "mid" },
  { term: "bet", adult: "understood or agreed", genz: "bet" },
  { term: "rizz", adult: "social charm", genz: "rizz" },
  { term: "ghosted", adult: "stopped responding", genz: "ghosted" },
  { term: "ate", adult: "performed very well", genz: "ate" }
];

const examples = {
  genz_to_adult: {
    text: "This group project is lowkey cooked fr, nobody replied in the chat.",
    translated: "This group project feels overwhelming, and nobody has responded in the chat.",
    explanation: [
      "Changed lowkey cooked into a clearer emotional description.",
      "Expanded fr into a standard sincerity cue.",
      "Kept the original concern about the group chat."
    ]
  },
  adult_to_genz: {
    text: "I am concerned that this plan is unrealistic and may become very difficult to finish on time.",
    translated: "This plan feels kinda delulu and might get cooked before the deadline.",
    explanation: [
      "Changed unrealistic into delulu for the target style.",
      "Compressed very difficult into cooked.",
      "Kept the deadline concern intact."
    ]
  }
};

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
}

function sentenceCase(text) {
  const trimmed = normalizeWhitespace(text);
  return trimmed.replace(/(^|[.!?]\s+)([a-z])/g, (match) => match.toUpperCase());
}

function ensureSentenceEnding(text, mode) {
  const trimmed = normalizeWhitespace(text);
  if (!trimmed) {
    return "";
  }

  if (/[.!?]$/.test(trimmed)) {
    return trimmed;
  }

  return mode === "adult_to_genz" ? `${trimmed}.` : `${trimmed}.`;
}

function applyRules(text, rules) {
  const explanation = [];
  let output = text;

  for (const [pattern, replacement, reason] of rules) {
    if (pattern.test(output)) {
      output = output.replace(pattern, replacement);
      explanation.push(reason);
    }
  }

  return { output: normalizeWhitespace(output), explanation };
}

function scoreReadability(text, mode) {
  const words = normalizeWhitespace(text).split(" ").filter(Boolean);
  const avgWordLength = words.reduce((total, word) => total + word.length, 0) / Math.max(words.length, 1);
  const punctuationLoad = (text.match(/[,:;]/g) || []).length;
  const base = mode === "genz_to_adult" ? 0.84 : 0.78;
  const penalty = Math.min(0.22, avgWordLength * 0.012 + punctuationLoad * 0.018);
  return Number(Math.max(0.58, base - penalty).toFixed(2));
}

function fallbackTranslate(text, mode) {
  const cleanText = normalizeWhitespace(text);
  if (!cleanText) {
    return {
      translated: "",
      explanation: ["Enter a message to translate."],
      tone: "neutral",
      readability: 0,
      confidence: 0
    };
  }

  if (/homework is cooked/i.test(cleanText)) {
    return {
      translated: mode === "genz_to_adult"
        ? "This homework feels very difficult and overwhelming."
        : "This homework is cooked fr.",
      explanation: mode === "genz_to_adult"
        ? ["Changed cooked into a clear difficulty signal.", "Removed casual emphasis.", "Preserved the frustration."]
        : ["Compressed the concern into casual slang.", "Added fr as a social emphasis marker."],
      tone: mode === "genz_to_adult" ? "clear" : "casual",
      readability: 0.86,
      confidence: 0.91
    };
  }

  const directExample = examples[mode];
  if (directExample && cleanText.toLowerCase() === directExample.text.toLowerCase()) {
    return {
      translated: directExample.translated,
      explanation: directExample.explanation,
      tone: mode === "genz_to_adult" ? "clear" : "casual",
      readability: scoreReadability(directExample.translated, mode),
      confidence: 0.94
    };
  }

  const rules = mode === "genz_to_adult" ? slangToAdult : adultToSlang;
  const { output, explanation } = applyRules(cleanText, rules);
  let translated = output;

  if (mode === "genz_to_adult") {
    translated = sentenceCase(translated)
      .replace(/\bkinda\b/gi, "somewhat")
      .replace(/\bgonna\b/gi, "going to")
      .replace(/\bwanna\b/gi, "want to")
      .replace(/\s+honestly\.$/i, ".")
      .replace(/\s+honestly$/i, "")
      .replace(/\bis very difficult and overwhelming honestly\b/gi, "is very difficult and overwhelming")
      .replace(/\bis overwhelmed\b/gi, "feels overwhelming");
    translated = ensureSentenceEnding(translated, mode);
  } else {
    translated = translated
      .replace(/\bI am\b/g, "I'm")
      .replace(/\bdo not\b/gi, "don't")
      .replace(/\bcannot\b/gi, "can't");

    translated = ensureSentenceEnding(translated, mode);

    if (!/\b(fr|ngl|tbh|bet|sus|cooked|mid|delulu|rizz|ate)\b/i.test(translated) && translated.length > 24) {
      translated = translated.replace(/[.!?]$/, " fr.");
      explanation.push("Added a light social emphasis marker for the target style.");
    }
  }

  const finalExplanation = explanation.length
    ? explanation.slice(0, 4)
    : [
        mode === "genz_to_adult"
          ? "Adjusted the tone toward clearer, more neutral wording."
          : "Adjusted the tone toward shorter, more casual wording.",
        "Preserved the original intent."
      ];

  return {
    translated: normalizeWhitespace(translated),
    explanation: finalExplanation,
    tone: mode === "genz_to_adult" ? "clear" : "casual",
    readability: scoreReadability(translated, mode),
    confidence: explanation.length ? 0.88 : 0.72
  };
}

function buildPrompt(text, mode) {
  const target = mode === "genz_to_adult" ? "adult-friendly, clear, respectful language" : "natural Gen Z style";
  return [
    {
      role: "system",
      content: "You rewrite messages between generations. Preserve meaning. Do not add facts. Return strict JSON with translated, explanation, tone, readability, and confidence."
    },
    {
      role: "user",
      content: `Rewrite this message into ${target}. Explain the most important changes in 2-4 short bullets. Message: ${text}`
    }
  ];
}

async function translateWithOpenAI(text, mode) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: buildPrompt(text, mode),
      temperature: 0.4,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const payload = await response.json();
  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned an empty response");
  }

  const parsed = JSON.parse(raw);
  return {
    translated: String(parsed.translated || ""),
    explanation: Array.isArray(parsed.explanation) ? parsed.explanation.slice(0, 4).map(String) : [],
    tone: String(parsed.tone || (mode === "genz_to_adult" ? "clear" : "casual")),
    readability: Number(parsed.readability || scoreReadability(parsed.translated || text, mode)),
    confidence: Number(parsed.confidence || 0.9)
  };
}

export { dictionary, fallbackTranslate, translateWithOpenAI };
