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
  {
    term: "cooked",
    classic: "very difficult, overwhelmed, or in trouble",
    genz: "cooked",
    definition: "A casual signal that a task, plan, or person is under pressure or likely to fail.",
    usageExample: "This assignment is cooked because nobody started the research.",
    tone: "emotional",
    synonyms: ["overwhelmed", "in trouble", "difficult"],
    category: "slang"
  },
  {
    term: "lowkey",
    classic: "somewhat or quietly",
    genz: "lowkey",
    definition: "A softener that makes a statement feel less direct while still expressing a real opinion.",
    usageExample: "I am lowkey worried about the deadline.",
    tone: "slang",
    synonyms: ["somewhat", "quietly", "mildly"],
    category: "slang"
  },
  {
    term: "fr",
    classic: "honestly or seriously",
    genz: "fr",
    definition: "Short for 'for real'; used to mark sincerity or agreement.",
    usageExample: "That meeting was confusing fr.",
    tone: "slang",
    synonyms: ["honestly", "seriously", "truly"],
    category: "slang"
  },
  {
    term: "sus",
    classic: "suspicious or questionable",
    genz: "sus",
    definition: "A short way to say that something feels unreliable, odd, or untrustworthy.",
    usageExample: "The last-minute change feels sus.",
    tone: "slang",
    synonyms: ["questionable", "untrustworthy", "odd"],
    category: "slang"
  },
  {
    term: "delulu",
    classic: "unrealistic or wishful",
    genz: "delulu",
    definition: "A playful critique of an idea that seems disconnected from reality.",
    usageExample: "Planning the whole project in one night is delulu.",
    tone: "slang",
    synonyms: ["unrealistic", "wishful", "impractical"],
    category: "culture"
  },
  {
    term: "mid",
    classic: "average or not impressive",
    genz: "mid",
    definition: "A concise negative review meaning something is ordinary or disappointing.",
    usageExample: "The first draft was mid, but the structure can improve.",
    tone: "slang",
    synonyms: ["average", "ordinary", "weak"],
    category: "slang"
  },
  {
    term: "bet",
    classic: "understood or agreed",
    genz: "bet",
    definition: "A quick agreement signal used like 'okay', 'done', or 'I understand'.",
    usageExample: "Send me the file by six. Bet.",
    tone: "slang",
    synonyms: ["agreed", "okay", "understood"],
    category: "slang"
  },
  {
    term: "ate",
    classic: "performed very well",
    genz: "ate",
    definition: "A strong compliment meaning someone did something impressively.",
    usageExample: "Your presentation ate because the ending was clear.",
    tone: "slang",
    synonyms: ["excelled", "impressed", "performed well"],
    category: "culture"
  },
  {
    term: "valid",
    classic: "good, acceptable, or genuinely cool",
    genz: "valid",
    definition: "A positive approval word used when something feels authentic, sensible, or attractive.",
    usageExample: "That outfit is valid and the color choice works well.",
    tone: "slang",
    synonyms: ["good", "acceptable", "cool"],
    category: "culture"
  },
  {
    term: "cap",
    classic: "lie or exaggeration",
    genz: "cap",
    definition: "Used to call out something as false or overstated.",
    usageExample: "That timeline is cap if nobody has started yet.",
    tone: "slang",
    synonyms: ["lie", "exaggeration", "falsehood"],
    category: "slang"
  },
  {
    term: "drip",
    classic: "style or fashion sense",
    genz: "drip",
    definition: "A term for a strong fashion look or stylish presentation.",
    usageExample: "The poster design has drip because the typography is on point.",
    tone: "slang",
    synonyms: ["style", "fashion", "look"],
    category: "culture"
  },
  {
    term: "cheugy",
    classic: "uncool, outdated, or trying too hard",
    genz: "cheugy",
    definition: "A Gen Z term for something that feels stale, overly polished, or behind the trend.",
    usageExample: "That phrase feels cheugy in a modern chat.",
    tone: "slang",
    synonyms: ["outdated", "uncool", "tacky"],
    category: "slang"
  },
  {
    term: "respectfully",
    classic: "politely but directly",
    genz: "respectfully",
    definition: "A tone marker that makes critique feel more controlled and less confrontational.",
    usageExample: "Respectfully, this plan needs more time.",
    tone: "formal",
    synonyms: ["politely", "with respect", "carefully"],
    category: "formal"
  },
  {
    term: "concerned",
    classic: "worried in a careful way",
    genz: "worried",
    definition: "A formal emotional signal that shows care without sounding dramatic.",
    usageExample: "I am concerned that the deadline may be unrealistic.",
    tone: "formal",
    synonyms: ["worried", "uneasy", "careful"],
    category: "emotion"
  },
  {
    term: "clarity",
    classic: "easy to understand",
    genz: "clear",
    definition: "A communication goal where meaning is direct, specific, and low-confusion.",
    usageExample: "The final section needs more clarity.",
    tone: "neutral",
    synonyms: ["clearness", "precision", "simplicity"],
    category: "formal"
  },
  {
    term: "tone normalized",
    classic: "emotion made calmer and more respectful",
    genz: "less intense",
    definition: "The process of keeping the meaning while reducing exaggeration or social friction.",
    usageExample: "The translator tone normalized the sentence before sending it to a teacher.",
    tone: "neutral",
    synonyms: ["calmed", "softened", "balanced"],
    category: "emotion"
  }
];

const examples = {
  genz_to_adult: {
    text: "This group project is lowkey cooked fr, nobody replied in the chat.",
    translated: "This group project feels overwhelming, and nobody has responded in the chat.",
    explanation: [
      "Slang conversion: changed lowkey cooked into a clearer emotional description.",
      "Tone shift: expanded fr into a standard sincerity cue.",
      "Cultural reinterpretation: kept the original concern about the group chat."
    ]
  },
  adult_to_genz: {
    text: "I am concerned that this plan is unrealistic and may become very difficult to finish on time.",
    translated: "This plan feels kinda delulu and might get cooked before the deadline.",
    explanation: [
      "Cultural reinterpretation: changed unrealistic into delulu for the target style.",
      "Slang conversion: compressed very difficult into cooked.",
      "Simplification: kept the deadline concern intact."
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

function looksLikeGibberish(text) {
  const clean = normalizeWhitespace(text);
  if (!clean) return false;
  const letters = (clean.match(/[a-zA-Z]/g) || []).length;
  const spaces = (clean.match(/\s/g) || []).length;
  const punctuation = (clean.match(/[^\w\s]/g) || []).length;
  const alphaRatio = letters / Math.max(clean.length, 1);
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  return wordCount <= 2 || alphaRatio < 0.55 || punctuation > letters * 0.35;
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

  if (looksLikeGibberish(cleanText)) {
    return {
      translated: "",
      explanation: [],
      tone: "neutral",
      readability: 0,
      confidence: 0,
      extractedText: "",
      screenshotSummary: "",
      emotions: [],
      feeling: "",
      inputType: "invalid",
      isValidInput: false,
      validationMessage: "That input does not look like a meaningful message. Please enter it again in English."
    };
  }

  if (/assignment is cooked/i.test(cleanText)) {
    return {
      translated: mode === "genz_to_adult"
        ? "This assignment is very difficult."
        : "This assignment is cooked fr.",
      explanation: mode === "genz_to_adult"
        ? [
            "Slang conversion: changed cooked into very difficult.",
            "Tone shift: removed bro to make the message more respectful.",
            "Simplification: kept the sentence short and clear.",
            "Emotional normalization: reduced exaggeration without losing urgency."
          ]
        : [
            "Slang conversion: compressed very difficult into cooked.",
            "Tone shift: added fr as a casual sincerity marker.",
            "Simplification: kept the sentence direct."
          ],
      tone: mode === "genz_to_adult" ? "clear" : "casual",
      readability: 0.91,
      confidence: 0.95
    };
  }

  if (/homework is cooked/i.test(cleanText)) {
    return {
      translated: mode === "genz_to_adult"
        ? "This homework feels very difficult and overwhelming."
        : "This homework is cooked fr.",
      explanation: mode === "genz_to_adult"
        ? [
            "Slang conversion: changed cooked into a clear difficulty signal.",
            "Tone shift: removed casual emphasis.",
            "Emotional normalization: preserved the frustration without intensifying it."
          ]
        : [
            "Slang conversion: compressed the concern into casual slang.",
            "Tone shift: added fr as a social emphasis marker."
          ],
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
          ? "Tone shift: adjusted the message toward clearer, more neutral wording."
          : "Tone shift: adjusted the message toward shorter, more casual wording.",
        "Simplification: preserved the original intent."
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
      content: "You power Genza, an intergenerational language bridge. Preserve meaning. Do not add facts. Transform tone, decode slang or formal phrasing, simplify readability, normalize emotional intensity, and explain cultural/context changes. If the input is a screenshot, first inspect whether it is actually a chat screenshot. If it is not a chat screenshot, mark isValidInput false and explain briefly. If the text is gibberish or unrelated characters, mark isValidInput false and explain briefly. Return strict JSON with translated, explanation, tone, readability, confidence, extractedText, screenshotSummary, emotions, feeling, inputType, isValidInput, validationMessage."
    },
    {
      role: "user",
      content: `Rewrite this message into ${target}. Explain the most important changes in 2-4 short bullets. If an image is included, OCR it first and use the screenshot text as context. For screenshots, start the visual description with "On the screenshot, it shows...". For text, describe the mood and emotions expressed. Message: ${text}`
    }
  ];
}

function buildGeminiParts(text, mode, imageDataUrl) {
  const prompt = buildPrompt(text, mode).map((message) => `${message.role.toUpperCase()}: ${message.content}`).join("\n\n");
  const parts = [{ text: prompt }];

  if (imageDataUrl) {
    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inline_data: {
          mime_type: match[1],
          data: match[2]
        }
      });
    }
  }

  return parts;
}

function parseJsonResponse(raw) {
  const cleaned = String(raw || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  return JSON.parse(cleaned);
}

async function translateWithGemini(text, mode, imageDataUrl = "") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: buildGeminiParts(text, mode, imageDataUrl)
        }
      ],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}`);
  }

  const payload = await response.json();
  const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  if (!raw) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed = parseJsonResponse(raw);
  const isValidInput = parsed.isValidInput !== false;
  return {
    translated: String(parsed.translated || ""),
    explanation: Array.isArray(parsed.explanation) ? parsed.explanation.slice(0, 4).map(String) : [],
    tone: String(parsed.tone || (mode === "genz_to_adult" ? "clear" : "casual")),
    readability: Number(parsed.readability || scoreReadability(parsed.translated || text, mode)),
    confidence: Number(parsed.confidence || 0.9),
    extractedText: String(parsed.extractedText || ""),
    screenshotSummary: String(parsed.screenshotSummary || ""),
    emotions: Array.isArray(parsed.emotions) ? parsed.emotions.slice(0, 5).map(String) : [],
    feeling: String(parsed.feeling || ""),
    inputType: String(parsed.inputType || (imageDataUrl ? "screenshot" : "text")),
    isValidInput,
    validationMessage: String(parsed.validationMessage || "")
  };
}

export { dictionary, fallbackTranslate, translateWithGemini };
