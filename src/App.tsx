import barba from "@barba/core";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import Lenis from "lenis";
import {
  ArrowRightLeft,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Copy,
  Home,
  Layers,
  Library,
  MessageSquareText,
  PenLine,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Wand2,
  X
} from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { getClientFallback, translateMessage, translateScreenshot } from "./api";
import { architecture, dictionary, examples, pitchPoints } from "./data";
import type { DictionaryEntry, Example, Mode, Page, TranslationResult, VisualMode } from "./types";
import "./App.css";

const defaultText = "This assignment is cooked bro.";
const optionalSplineScene = import.meta.env.VITE_SPLINE_SCENE?.trim() || "";
const Spline = lazy(() => import("@splinetool/react-spline"));
const genzLogo = new URL("../images/young_people_logo.png", import.meta.url).href;
const classicLogo = new URL("../images/oldpeople_logo.png", import.meta.url).href;

function modeLabel(mode: Mode) {
  return mode === "genz_to_adult" ? "Gen Z → Classic" : "Classic → Gen Z";
}

function targetLabel(mode: Mode) {
  return mode === "genz_to_adult" ? "Clear adult-ready message" : "Casual Gen Z message";
}

function getMatchedEntries(text: string, result: TranslationResult | null) {
  const haystack = `${text} ${result?.translated || ""}`.toLowerCase();
  return dictionary.filter((entry) => haystack.includes(entry.term.toLowerCase())).slice(0, 6);
}

/* ── Navbar icon-only button for the Lexicon ── */
function LexiconIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="lexicon-icon-btn"
      type="button"
      onClick={onClick}
      aria-label="Open Live Lexicon"
      title="Live Lexicon"
    >
      <BookOpen size={19} />
    </button>
  );
}

/* ── NavButton ── */
function NavButton({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button className={active ? "nav-link active" : "nav-link"} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ── HomePage ── */
function HomePage({
  visualMode,
  onStart,
  onSwitchVisual
}: {
  visualMode: VisualMode;
  onStart: () => void;
  onSwitchVisual: (mode: VisualMode) => void;
}) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.78, stagger: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(".hero-photos", { opacity: 0, x: 36, scale: 0.98 }, { opacity: 1, x: 0, scale: 1, duration: 1.05, ease: "power3.out" });
      gsap.fromTo(".hero-actions .btn", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.62, delay: 0.18, stagger: 0.12, ease: "power3.out" });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            gsap.to(entry.target, {
              opacity: entry.isIntersecting ? 1 : 0,
              y: entry.isIntersecting ? 0 : 24,
              scale: entry.isIntersecting ? 1 : 0.985,
              duration: 0.5,
              ease: "power2.out"
            });
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
      );
      document.querySelectorAll(".reveal-item, .hero-copy > *, .hero-photos, .mode-showcase, .showcase-tile, .bento-tile, .sticker").forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="home-page" ref={heroRef}>
      {/* Subtle VibeUI marker lines */}
      <div className="vibe-grid-lines" aria-hidden="true">
        <div className="vibe-line horizontal top" />
        <div className="vibe-line vertical left" />
        <div className="vibe-crosshair top-left">+</div>
        <div className="vibe-crosshair top-right">+</div>
      </div>

      {/* Status badges */}
      {/* Hero Section */}
      <div className="hero-band">
        <div className="hero-copy">
          <p className="section-kicker reveal-item">Genza Intergenerational Bridge</p>
          <h1 className="reveal-item">Connecting Generations Through Language.</h1>
          <p className="hero-text reveal-item">
            Genza translates slang, tone, and cultural context between Gen Z and adults. The engine explains every change so both sides can learn each other's language.
          </p>
          <div className="hero-actions reveal-item">
            <button className="btn btn-primary" type="button" onClick={onStart}>
              <Wand2 size={18} />
              Open Language Bridge
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => onSwitchVisual(visualMode === "genz" ? "classic" : "genz")}>
              <Library size={18} />
              Switch Mode
            </button>
          </div>
        </div>

        {/* Real photos section */}
        <div className="hero-photos reveal-item" aria-label="Generation bridge preview">
          {optionalSplineScene ? (
            <Suspense fallback={<div className="spline-fallback">Loading…</div>}>
              <Spline scene={optionalSplineScene} className="spline-scene" />
            </Suspense>
          ) : (
            <div className="photo-collage">
              <div className="photo-card photo-card--main reveal-item">
                <img src="/Generation-Z.jpg" alt="Generation Z group" loading="lazy" />

              </div>
              <div className="photo-card photo-card--secondary reveal-item">
                <img src="/old_people.jpg" alt="Classic generation adults" loading="lazy" />

              </div>

            </div>
          )}
        </div>
      </div>

      {/* Mode Switch Cards */}
      <div className="mode-showcase reveal-item">
        <button
          className={visualMode === "genz" ? "showcase-tile active genz-tile" : "showcase-tile genz-tile"}
          type="button"
          onClick={() => onSwitchVisual("genz")}
        >
          <div className="showcase-tile-img">
            <img src="/Gen-Z-.jpeg" alt="Gen Z style" loading="lazy" />
          </div>
          <div className="showcase-tile-info">
            <Sparkles size={40} />
            <strong>Gen Z Mode</strong>
            <span>Vibrant light background, neon effects, bouncing cards, slang tags.</span>
          </div>
        </button>
        <button
          className={visualMode === "classic" ? "showcase-tile active classic-tile" : "showcase-tile classic-tile"}
          type="button"
          onClick={() => onSwitchVisual("classic")}
        >
          <div className="showcase-tile-img">
            <img src="/old_people2.avif" alt="Classic style" loading="lazy" />
          </div>
          <div className="showcase-tile-info">
            <Library size={19} />
            <strong>Classic Mode</strong>
            <span>Moving aristocratic wallpaper, serif typography, page-flipping dictionary.</span>
          </div>
        </button>
      </div>

      {/* Bento Cards */}
      <section className="bento-grid" aria-label="Genza product overview">
        <article className="bento-tile wide reveal-item deep-translation-tile">
          <Brain size={22} />
          <h2>Deep Translation System</h2>
          <p>The engine uses LLM prompt engineering, sentiment scoring, and context adaptation. Rather than simple word swapping, it shifts entire tones and registers.</p>
          <div className="bento-glow" />
        </article>
        <article className="bento-tile reveal-item direction-tile">
          <ArrowRightLeft size={20} />
          <h2>Dual Direction Engine</h2>
          <p>Translate Gen Z slang to classic adult tone, or turn formal language into casual slang.</p>
          <div className="section-sticker-strip" aria-hidden="true">
            <img src="/kid.webp" alt="" className="section-sticker section-sticker--small" loading="lazy" />
          </div>
        </article>
        <article className="bento-tile reveal-item lexicon-tile">
          <BookOpen size={20} />
          <h2>Interactive Lexicon</h2>
          <p>A 3D dictionary with animated page turns, definitions, tone labels, and synonym navigation.</p>
          <div className="section-sticker-strip" aria-hidden="true">
            <img src="/old_people_sticker2.png" alt="" className="section-sticker section-sticker--tall" loading="lazy" />
          </div>
        </article>
        <article className="bento-tile wide reveal-item architecture-tile">
          <Layers size={20} />
          <h2>Genza Architecture</h2>
          <ul>
            {architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

        </article>
        <article className="bento-tile reveal-item pitch-tile">
          <ShieldCheck size={20} />
          <h2>Hackathon Pitch Focus</h2>
          <p>{pitchPoints[0]} Solution: Genza offers social bridges across age demographics.</p>
          <div className="section-sticker-strip" aria-hidden="true">
            <img src="/old_people_sticker.png" alt="" className="section-sticker section-sticker--soft" loading="lazy" />
          </div>
        </article>
        <article className="bento-tile reveal-item stack-tile">
          <PenLine size={20} />
          <h2>Advanced Visual Stack</h2>
          <p>Integrated with GSAP, Anime.js, Lenis, and Barba.js with VibeUI interactive blueprints.</p>
          <div className="section-sticker-strip" aria-hidden="true">
            <img src="/genz_swang_sticker.png" alt="" className="section-sticker section-sticker--small" loading="lazy" />
          </div>
        </article>
      </section>
    </section>
  );
}

/* ── BridgePage ── */
function BridgePage({
  mode,
  setMode,
  text,
  setText,
  result,
  copied,
  error,
  showExplain,
  setShowExplain,
  activeExamples,
  matchedEntries,
  isTranslating,
  isPending,
  onTranslate,
  onCopy,
  onLoadExample,
  onOpenLexicon,
  screenshotName,
  analysisText,
  onScreenshotUpload
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  text: string;
  setText: (text: string) => void;
  result: TranslationResult | null;
  copied: boolean;
  error: string;
  showExplain: boolean;
  setShowExplain: (value: boolean) => void;
  activeExamples: Example[];
  matchedEntries: DictionaryEntry[];
  isTranslating: boolean;
  isPending: boolean;
  onTranslate: () => void;
  onCopy: () => void;
  onLoadExample: (example: Example) => void;
  onOpenLexicon: () => void;
  screenshotName: string;
  analysisText: string;
  onScreenshotUpload: (file: File | null) => void;
}) {
  return (
    <section className="bridge-page">
      <div className="bridge-header">
        <div>
          <p className="section-kicker">Translation engine</p>
          <h1>Bridge the sentence, then show the reasoning.</h1>
        </div>
        <div className="control-strip">
          <label>
            <span>Direction</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
              <option value="genz_to_adult">Gen Z → Adult</option>
              <option value="adult_to_genz">Adult → Gen Z</option>
            </select>
          </label>
          <label className="explain-toggle">
            <input checked={showExplain} type="checkbox" onChange={(event) => setShowExplain(event.target.checked)} />
            <span />
            Explain changes
          </label>
        </div>
      </div>

      <div className="translation-grid">
        <section className="editor-pane input-pane" aria-label="Input message">
          <div className="pane-head">
            <div>
              <p>Source</p>
              <h2>{mode === "genz_to_adult" ? "Social message" : "Formal message"}</h2>
            </div>
            <button type="button" className="icon-button" onClick={() => setText("")} aria-label="Clear input">
              <RefreshCcw size={16} />
            </button>
          </div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={1200}
            placeholder="Write a message…"
          />
          <label className="screenshot-upload">
            <span>Upload screenshot</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onScreenshotUpload(event.target.files?.[0] || null)}
            />
          </label>
          {screenshotName ? <div className="screenshot-name">{screenshotName}</div> : null}
          <div className="pane-foot">
            <span>{text.length}/1200</span>
            <button className="btn btn-primary" type="button" onClick={onTranslate} disabled={isTranslating || isPending}>
              <Wand2 size={17} />
              {isTranslating ? "Translating…" : "Translate"}
            </button>
          </div>
        </section>

        <section className="editor-pane output-pane" aria-label="Translated message">
          <div className="pane-head">
            <div>
              <p>{modeLabel(mode)}</p>
              <h2>{targetLabel(mode)}</h2>
            </div>
            <button type="button" className="icon-button" onClick={onCopy} aria-label="Copy output">
              {copied ? <Clipboard size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className={`result-box ${result ? "filled" : ""}`}>
            {result?.translated || "Your translated message will appear here."}
          </div>
          {analysisText ? <div className="screenshot-analysis">{analysisText}</div> : null}
          {result ? <div className="reaction-pop">Translation ready</div> : null}
          <div className="metric-row" aria-label="Translation metrics">
            <span>Tone: {result?.tone || "waiting"}</span>
            <span>Readability: {Math.round((result?.readability || 0) * 100)}%</span>
            <span>Confidence: {Math.round((result?.confidence || 0) * 100)}%</span>
          </div>
        </section>
      </div>

      {error ? <p className="error-line">{error} Local fallback is showing.</p> : null}

      {matchedEntries.length ? (
        <div className="slang-row" aria-label="Matched lexicon terms">
          {matchedEntries.map((entry) => (
            <button className="slang-chip" type="button" key={entry.term} onClick={onOpenLexicon}>
              {entry.term}
            </button>
          ))}
        </div>
      ) : null}

      {showExplain ? (
        <section className="explanation-panel" aria-label="Explanation">
          <div className="panel-heading">
            <Sparkles size={18} />
            <h2>Why It Changed</h2>
          </div>
          <div className="explanation-list">
            {(result?.explanation || ["Run a translation to see slang conversion, tone shift, simplification, and cultural context."]).map(
              (item, index) => (
                <div className="explanation-item" key={`${item}-${index}`}>
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </div>
              )
            )}
          </div>
        </section>
      ) : null}

      <section className="demo-prompts-section" aria-label="Demo Prompts">
        <div className="panel-heading compact">
          <MessageSquareText size={18} />
          <h2>Demo Prompts</h2>
        </div>
        <div className="example-list">
          {activeExamples.map((example) => (
            <button key={example.id} type="button" className="example-card" onClick={() => onLoadExample(example)}>
              <span>{example.label}</span>
              <strong>{example.text}</strong>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

/* ── LexiconBook ── */
function LexiconBook({
  open,
  visualMode,
  entry,
  pageIndex,
  onClose,
  onPrev,
  onNext,
  onSelect
}: {
  open: boolean;
  visualMode: VisualMode;
  entry: DictionaryEntry;
  pageIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const [localPageIndex, setLocalPageIndex] = useState(pageIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");
  const bookRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pageIndex === localPageIndex) return;
    const direction = pageIndex > localPageIndex ? "forward" : "backward";
    setFlipDirection(direction);
    setIsFlipping(true);
    const timer = setTimeout(() => {
      setLocalPageIndex(pageIndex);
      setIsFlipping(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [pageIndex, localPageIndex]);

  useEffect(() => {
    if (!open || !bookRef.current) return;
    gsap.fromTo(
      bookRef.current,
      { opacity: 0, scale: 0.93, rotateX: 12 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 0.48, ease: "back.out(1.4)" }
    );
  }, [open]);

  if (!open) return null;

  const currentEntry = dictionary[localPageIndex] || entry;
  const targetEntryForFlip = dictionary[pageIndex] || entry;

  const handleSynonymClick = (synonym: string) => {
    const matchedIdx = dictionary.findIndex(
      (item) =>
        item.term.toLowerCase() === synonym.toLowerCase() ||
        item.synonyms.some((s) => s.toLowerCase() === synonym.toLowerCase())
    );
    if (matchedIdx !== -1) onSelect(matchedIdx);
  };

  return (
    <div className={`lexicon-overlay ${visualMode}`} role="dialog" aria-modal="true" aria-label="Live Lexicon">
      <button className="lexicon-scrim" type="button" aria-label="Close lexicon" onClick={onClose} />
      <div className="lexicon-book" ref={bookRef}>
        <div className="book-spine-line" />
        <div className="book-toolbar">
          <div>
            <span className="vibe-badge">SYSTEM DICTIONARY</span>
            <h2>{visualMode === "classic" ? "The Classical Encyclopedia" : "Decoding Cyber Lexicon"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close lexicon">
            <X size={18} />
          </button>
        </div>

        <div className="book-spread">
          {/* Index page */}
          <section className="book-page book-left">
            <h3>Vocabulary Index</h3>
            <div className="lexicon-index">
              {dictionary.map((item, index) => (
                <button
                  className={index === pageIndex ? "active" : ""}
                  type="button"
                  key={item.term}
                  onClick={() => onSelect(index)}
                >
                  <span>{item.term}</span>
                  <small>{item.category}</small>
                </button>
              ))}
            </div>
          </section>

          {/* Entry detail page */}
          <section className="book-page book-right">
            <div className="entry-header">
              <span className={`tone-label ${entry.tone}`}>{entry.tone}</span>
              <span className="entry-count">Page {pageIndex + 1} of {dictionary.length}</span>
            </div>
            <h3>{entry.term}</h3>
            <div className="lexicon-divider" />
            <p className="entry-definition">{entry.definition}</p>
            <div className="entry-details">
              <div>
                <dt>Classic definition</dt>
                <dd>{entry.classic}</dd>
              </div>
              <div>
                <dt>Gen Z counterpart</dt>
                <dd>{entry.genz}</dd>
              </div>
              <div>
                <dt>Usage example</dt>
                <dd>"{entry.usageExample}"</dd>
              </div>
              <div>
                <dt>Interactive Synonyms (click to flip)</dt>
                <dd className="synonym-tags">
                  {entry.synonyms.map((syn) => (
                    <button key={syn} type="button" className="synonym-tag-btn" onClick={() => handleSynonymClick(syn)}>
                      {syn}
                    </button>
                  ))}
                </dd>
              </div>
            </div>
          </section>

          {/* Flip animation overlay */}
          {isFlipping && (
            <div className={`book-page-flipping flip-${flipDirection}`}>
              <div className="flipping-face front">
                <div className="entry-header">
                  <span className={`tone-label ${currentEntry.tone}`}>{currentEntry.tone}</span>
                </div>
                <h3>{currentEntry.term}</h3>
                <div className="lexicon-divider" />
                <p className="entry-definition">{currentEntry.definition}</p>
              </div>
              <div className="flipping-face back">
                <div className="entry-header">
                  <span className={`tone-label ${targetEntryForFlip.tone}`}>{targetEntryForFlip.tone}</span>
                </div>
                <h3>{targetEntryForFlip.term}</h3>
                <div className="lexicon-divider" />
                <p className="entry-definition">{targetEntryForFlip.definition}</p>
              </div>
            </div>
          )}
        </div>

        <div className="book-controls">
          <button className="btn btn-ghost" type="button" onClick={onPrev}>
            <ChevronLeft size={17} />
            Prev Page
          </button>
          <button className="btn btn-ghost" type="button" onClick={onNext}>
            Next Page
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Root App ── */
function App() {
  const [page, setPage] = useState<Page>("home");
  const [mode, setMode] = useState<Mode>("genz_to_adult");
  const [visualMode, setVisualMode] = useState<VisualMode>("genz");
  const [text, setText] = useState(defaultText);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("");
  const [screenshotName, setScreenshotName] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [analysisText, setAnalysisText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [lexiconOpen, setLexiconOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const bridgeFlashRef = useRef<HTMLDivElement | null>(null);

  const barbaLabel = useMemo(() => {
    const core = barba as { version?: string };
    return `Barba ${core.version || "2"}`;
  }, []);

  const activeExamples = useMemo(() => examples.filter((example) => example.mode === mode), [mode]);
  const matchedEntries = useMemo(() => getMatchedEntries(text, result), [text, result]);
  const activeEntry = dictionary[bookPage] || dictionary[0];

  // Smooth scroll via Lenis
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frameId = 0;
    function raf(time: number) { lenis.raf(time); frameId = requestAnimationFrame(raf); }
    frameId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frameId); lenis.destroy(); };
  }, []);

  // Barba-style page transition on page change
  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(
      pageRef.current,
      { autoAlpha: 0, y: 28, filter: "blur(6px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power4.out" }
    );
  }, [page]);

  // Anime.js for translation result pop
  useEffect(() => {
    if (!result) return;
    animate(".reaction-pop", { opacity: [0, 1], y: [14, 0], scale: [0.92, 1], duration: 520, ease: "outBack" });
    animate(".slang-chip", { opacity: [0, 1], y: [12, 0], delay: stagger(65), duration: 420, ease: "outCubic" });
  }, [result]);

  function switchVisualMode(nextMode: VisualMode) {
    if (nextMode === visualMode) return;
    const flash = bridgeFlashRef.current;
    if (flash) {
      gsap.set(flash, {
        opacity: 1,
        scaleX: nextMode === "classic" ? 1.08 : 0.72,
        background: nextMode === "classic"
          ? "linear-gradient(90deg, rgba(42,28,12,0), rgba(217,184,99,0.72), rgba(42,28,12,0))"
          : "linear-gradient(90deg, rgba(0,245,255,0), rgba(255,51,176,0.8), rgba(197,255,54,0))"
      });
      gsap.to(flash, { opacity: 0, scaleX: nextMode === "classic" ? 0.2 : 1.26, duration: 0.78, ease: "power3.out" });
    }
    gsap.fromTo(
      ".nav-shell, .page-shell",
      { filter: nextMode === "classic" ? "saturate(1.7) blur(1px)" : "sepia(0.7) blur(1px)" },
      { filter: "saturate(1) blur(0px)", duration: 0.72, ease: "power2.out" }
    );
    setVisualMode(nextMode);
  }

  async function handleTranslate() {
    setError("");
    setCopied(false);
    setIsTranslating(true);
    try {
      const nextResult = screenshotDataUrl
        ? await translateScreenshot(screenshotDataUrl, mode, text)
        : await translateMessage(text, mode);
      const extra = [nextResult.extractedText, nextResult.screenshotSummary].filter(Boolean).join(" ").trim();
      setAnalysisText(extra);
      startTransition(() => setResult(nextResult));
    } catch (translationError) {
      const fallback = getClientFallback(mode, text);
      startTransition(() => setResult(fallback));
      setAnalysisText("");
      setError(translationError instanceof Error ? translationError.message : "Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  }

  function loadExample(example: Example) {
    setText(example.text);
    setMode(example.mode);
    setResult(null);
    setAnalysisText("");
    setScreenshotDataUrl("");
    setScreenshotName("");
    setError("");
  }

  function handleScreenshotUpload(file: File | null) {
    if (!file) {
      setScreenshotDataUrl("");
      setScreenshotName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotDataUrl(String(reader.result || ""));
      setScreenshotName(file.name);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  async function copyOutput() {
    if (!result?.translated) return;
    await navigator.clipboard.writeText(result.translated);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function selectBookPage(index: number) {
    setBookPage((index + dictionary.length) % dictionary.length);
  }

  // Suppress unused var warning for barbaLabel
  void barbaLabel;

  return (
    <main className={`app-shell ${visualMode}`} data-barba="wrapper">
      {/* Background layers */}
      <div className="grid-backdrop" aria-hidden="true" />
      <div className="wallpaper-motion" aria-hidden="true" />
      <div className="bridge-flash" ref={bridgeFlashRef} aria-hidden="true" />

      {/* Navigation */}
      <nav className="nav-shell" aria-label="Main navigation">
        <button className="brand-lockup" type="button" onClick={() => setPage("home")}>
          <span className={`brand-mark ${visualMode === "genz" ? "brand-mark--genz" : "brand-mark--classic"}`}>
            <img src={visualMode === "genz" ? genzLogo : classicLogo} alt="" aria-hidden="true" loading="eager" />
          </span>
        </button>

        <div className="nav-links">
          <NavButton icon={<Home size={16} />} label="Home" active={page === "home"} onClick={() => setPage("home")} />
          <NavButton icon={<Wand2 size={16} />} label="Bridge" active={page === "bridge"} onClick={() => setPage("bridge")} />
          <LexiconIconButton onClick={() => setLexiconOpen(true)} />
        </div>

        <div className="nav-actions">
          <div className="visual-switch" aria-label="Visual mode">
            <button className={visualMode === "genz" ? "active" : ""} type="button" onClick={() => switchVisualMode("genz")}>
              <Sparkles size={15} />
              Gen Z
            </button>
            <button className={visualMode === "classic" ? "active" : ""} type="button" onClick={() => switchVisualMode("classic")}>
              <Library size={15} />
              Classic
            </button>
          </div>

        </div>
      </nav>

      {/* Page content */}
      <div className="page-shell" ref={pageRef} data-barba="container" data-barba-namespace={page}>
        {page === "home" ? (
          <HomePage visualMode={visualMode} onStart={() => setPage("bridge")} onSwitchVisual={switchVisualMode} />
        ) : null}

        {page === "bridge" ? (
          <BridgePage
            mode={mode}
            setMode={setMode}
            text={text}
            setText={setText}
            result={result}
            copied={copied}
            error={error}
            showExplain={showExplain}
            setShowExplain={setShowExplain}
            activeExamples={activeExamples}
            matchedEntries={matchedEntries}
            isTranslating={isTranslating}
            isPending={isPending}
            onTranslate={handleTranslate}
            onCopy={copyOutput}
            onLoadExample={loadExample}
            onOpenLexicon={() => setLexiconOpen(true)}
            screenshotName={screenshotName}
            analysisText={analysisText}
            onScreenshotUpload={handleScreenshotUpload}
          />
        ) : null}

      </div>

      {/* Lexicon book overlay */}
      <LexiconBook
        open={lexiconOpen}
        visualMode={visualMode}
        entry={activeEntry}
        pageIndex={bookPage}
        onClose={() => setLexiconOpen(false)}
        onPrev={() => selectBookPage(bookPage - 1)}
        onNext={() => selectBookPage(bookPage + 1)}
        onSelect={selectBookPage}
      />
    </main>
  );
}

export default App;
