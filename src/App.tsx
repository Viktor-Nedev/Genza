import {
  ArrowRightLeft,
  BookOpen,
  Clipboard,
  Copy,
  Library,
  MessageSquareText,
  RefreshCcw,
  Sparkles,
  Wand2
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { getClientFallback, translateMessage } from "./api";
import { dictionary, examples } from "./data";
import type { Example, Mode, TranslationResult } from "./types";
import "./App.css";

const defaultText = "This group project is lowkey cooked fr, nobody replied in the chat.";

function modeLabel(mode: Mode) {
  return mode === "genz_to_adult" ? "Gen Z to Classic" : "Classic to Gen Z";
}

function App() {
  const [mode, setMode] = useState<Mode>("genz_to_adult");
  const [theme, setTheme] = useState<"genz" | "classic">("genz");
  const [text, setText] = useState(defaultText);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, setIsTranslating] = useState(false);

  const activeExamples = useMemo(() => examples.filter((example) => example.mode === mode), [mode]);

  useEffect(() => {
    setTheme(mode === "genz_to_adult" ? "classic" : "genz");
  }, [mode]);

  async function handleTranslate() {
    setError("");
    setCopied(false);
    setIsTranslating(true);

    try {
      const nextResult = await translateMessage(text, mode);
      startTransition(() => setResult(nextResult));
    } catch (translationError) {
      const fallback = getClientFallback(mode, text);
      startTransition(() => setResult(fallback));
      setError(translationError instanceof Error ? translationError.message : "Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  }

  function loadExample(example: Example) {
    setText(example.text);
    setMode(example.mode);
    setResult(null);
    setError("");
  }

  async function copyOutput() {
    if (!result?.translated) {
      return;
    }

    await navigator.clipboard.writeText(result.translated);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className={`app-shell ${theme}`}>
      <div className="atmosphere" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <ArrowRightLeft size={22} />
          </div>
          <div>
            <p className="eyebrow">Nexus</p>
            <h1>Generation Language Bridge</h1>
          </div>
        </div>

        <div className="mode-toggle" aria-label="Translation direction">
          <button
            className={mode === "genz_to_adult" ? "active" : ""}
            type="button"
            onClick={() => setMode("genz_to_adult")}
          >
            <Library size={17} />
            Gen Z to Classic
          </button>
          <button
            className={mode === "adult_to_genz" ? "active" : ""}
            type="button"
            onClick={() => setMode("adult_to_genz")}
          >
            <Sparkles size={17} />
            Classic to Gen Z
          </button>
        </div>
      </header>

      <section className="workspace" aria-label="Nexus translator">
        <aside className="rail rail-left">
          <div className="panel-heading">
            <MessageSquareText size={18} />
            <h2>Demo Prompts</h2>
          </div>
          <div className="example-list">
            {activeExamples.map((example) => (
              <button key={example.id} type="button" className="example-card" onClick={() => loadExample(example)}>
                <span>{example.label}</span>
                <strong>{example.text}</strong>
              </button>
            ))}
          </div>
        </aside>

        <section className="translator-panel">
          <div className="bridge-strip">
            <span>{mode === "genz_to_adult" ? "Social feed" : "Archive"}</span>
            <div className="bridge-line" />
            <span>{mode === "genz_to_adult" ? "Clear note" : "Chat reply"}</span>
          </div>

          <div className="translation-grid">
            <section className="editor-pane" aria-label="Input message">
              <div className="pane-head">
                <h2>Input</h2>
                <button type="button" className="icon-button" onClick={() => setText("")} aria-label="Clear input">
                  <RefreshCcw size={17} />
                </button>
              </div>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={1200}
                placeholder="Write a message..."
              />
              <div className="pane-foot">
                <span>{text.length}/1200</span>
                <button className="primary-action" type="button" onClick={handleTranslate} disabled={isTranslating || isPending}>
                  <Wand2 size={18} />
                  {isTranslating ? "Translating" : "Translate"}
                </button>
              </div>
            </section>

            <section className="editor-pane output-pane" aria-label="Translated message">
              <div className="pane-head">
                <h2>{modeLabel(mode)}</h2>
                <button type="button" className="icon-button" onClick={copyOutput} aria-label="Copy output">
                  {copied ? <Clipboard size={17} /> : <Copy size={17} />}
                </button>
              </div>
              <div className={`result-box ${result ? "filled" : ""}`}>
                {result?.translated || "Your translated message will appear here."}
              </div>
              <div className="metric-row" aria-label="Translation metrics">
                <span>Tone: {result?.tone || "waiting"}</span>
                <span>Readability: {Math.round((result?.readability || 0) * 100)}%</span>
                <span>Confidence: {Math.round((result?.confidence || 0) * 100)}%</span>
              </div>
            </section>
          </div>

          {error ? <p className="error-line">{error} Local fallback is showing.</p> : null}

          <section className="explanation-panel" aria-label="Explanation">
            <div className="panel-heading">
              <Sparkles size={18} />
              <h2>Why It Changed</h2>
            </div>
            <div className="explanation-list">
              {(result?.explanation || ["Translation notes will appear after the first run."]).map((item, index) => (
                <div className="explanation-item" key={`${item}-${index}`}>
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="rail rail-right">
          <div className="panel-heading">
            <BookOpen size={18} />
            <h2>Live Lexicon</h2>
          </div>
          <div className="dictionary-list">
            {dictionary.map((entry) => (
              <article className="dictionary-card" key={entry.term}>
                <strong>{entry.term}</strong>
                <span>{mode === "genz_to_adult" ? entry.adult : entry.genz}</span>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
