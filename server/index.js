import cors from "cors";
import "dotenv/config";
import express from "express";
import { dictionary, fallbackTranslate, translateWithOpenAI } from "./translator.js";

const app = express();
const port = Number(process.env.PORT || 8787);
const modes = new Set(["genz_to_adult", "adult_to_genz"]);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "genza-api" });
});

app.get(["/api/dictionary", "/dictionary"], (_req, res) => {
  res.json({ entries: dictionary });
});

async function handleTranslate(req, res) {
  const text = String(req.body?.text || "");
  const mode = String(req.body?.mode || "genz_to_adult");

  if (!modes.has(mode)) {
    return res.status(400).json({ error: "Unsupported translation mode." });
  }

  if (text.length > 1200) {
    return res.status(400).json({ error: "Message is too long for the hackathon demo endpoint." });
  }

  try {
    const llmResult = await translateWithOpenAI(text, mode);
    if (llmResult) {
      return res.json({ ...llmResult, source: "llm" });
    }
  } catch (error) {
    console.warn("[nexus] Falling back to local translator:", error.message);
  }

  res.json({ ...fallbackTranslate(text, mode), source: "fallback" });
}

app.post(["/api/translate", "/translate"], handleTranslate);

app.listen(port, () => {
  console.log(`Genza API listening on http://localhost:${port}`);
});
