import type { DictionaryEntry, Example } from "./types";

export const examples: Example[] = [
  {
    id: "project-cooked",
    mode: "genz_to_adult",
    label: "Group chat",
    text: "This group project is lowkey cooked fr, nobody replied in the chat."
  },
  {
    id: "assignment-cooked",
    mode: "genz_to_adult",
    label: "Demo story",
    text: "This assignment is cooked bro."
  },
  {
    id: "homework-sus",
    mode: "genz_to_adult",
    label: "Homework",
    text: "This homework is kinda sus and the deadline is giving chaos."
  },
  {
    id: "teacher-plan",
    mode: "adult_to_genz",
    label: "Teacher note",
    text: "I am concerned that this plan is unrealistic and may become very difficult to finish on time."
  },
  {
    id: "office-feedback",
    mode: "adult_to_genz",
    label: "Feedback",
    text: "Your presentation was excellent, but the final section needs a clearer conclusion."
  },
  {
    id: "parent-message",
    mode: "adult_to_genz",
    label: "Family text",
    text: "Please respond when you have time. I am worried because your message sounded upset."
  }
];

export const dictionary: DictionaryEntry[] = [
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
    term: "ate and left no crumbs",
    classic: "did exceptionally well",
    genz: "ate and left no crumbs",
    definition: "A dramatic compliment meaning something was done extremely well.",
    usageExample: "That final slide ate and left no crumbs.",
    tone: "slang",
    synonyms: ["excelled", "nailed it", "impressed"],
    category: "culture"
  },
  {
    term: "old school",
    classic: "traditional or outdated in a familiar way",
    genz: "old school",
    definition: "An older style or attitude that remains recognizable and sometimes respected.",
    usageExample: "That expression is old school and still shows up with older speakers.",
    tone: "formal",
    synonyms: ["traditional", "classic", "dated"],
    category: "formal"
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

export const architecture = [
  "React + Vite client with a page-based SPA shell",
  "Express API with POST /translate and local fallback NLP rules",
  "LLM prompt layer for tone transformation when OPENAI_API_KEY is present",
  "Slang dictionary, readability scoring, and sentiment normalization",
  "Animated dual design system with Gen Z and Classic visual modes"
];

export const pitchPoints = [
  "Problem: families, teachers, students, and teams misread tone across generations.",
  "Solution: Genza translates meaning, tone, culture, and clarity instead of only replacing words.",
  "Demo: show a slang-heavy message, explain why it changed, then flip the UI into the other generation's visual language.",
  "Impact: fewer misunderstandings in education, family communication, and online collaboration."
];
