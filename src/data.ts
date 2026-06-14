import type { DictionaryEntry, Example } from "./types";

export const examples: Example[] = [
  {
    id: "project-cooked",
    mode: "genz_to_adult",
    label: "Group chat",
    text: "This group project is lowkey cooked fr, nobody replied in the chat."
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
    label: "Workplace",
    text: "Your presentation was excellent, but the final section needs a clearer conclusion."
  }
];

export const dictionary: DictionaryEntry[] = [
  { term: "cooked", adult: "overwhelmed, in trouble, or too difficult", genz: "cooked" },
  { term: "sus", adult: "suspicious or questionable", genz: "sus" },
  { term: "lowkey", adult: "somewhat, quietly, or mildly", genz: "lowkey" },
  { term: "mid", adult: "average or not impressive", genz: "mid" },
  { term: "bet", adult: "agreed, understood, or okay", genz: "bet" },
  { term: "rizz", adult: "social charm or charisma", genz: "rizz" },
  { term: "ghosted", adult: "stopped responding", genz: "ghosted" },
  { term: "ate", adult: "performed very well", genz: "ate" }
];
