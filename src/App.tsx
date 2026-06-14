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
  KeyRound,
  Layers,
  Library,
  Lock,
  LogIn,
  Mail,
  MessageSquareText,
  PenLine,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Wand2,
  X
} from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { getClientFallback, translateMessage } from "./api";
import { architecture, dictionary, examples, pitchPoints } from "./data";
import type { DictionaryEntry, Example, Mode, Page, TranslationResult, VisualMode } from "./types";
import "./App.css";

const defaultText = "This assignment is cooked bro.";
const optionalSplineScene = import.meta.env.VITE_SPLINE_SCENE?.trim() || "";
const Spline = lazy(() => import("@splinetool/react-spline"));

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
      gsap.fromTo(".hero-copy h1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" });
      gsap.fromTo(".hero-copy .hero-text", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.22, ease: "power4.out" });
      gsap.fromTo(".hero-actions .btn", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.44, stagger: 0.14, ease: "power3.out" });
      gsap.fromTo(".hero-photos", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.1, delay: 0.3, ease: "power3.out" });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(entry.target, { opacity: 0, y: 38, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.07 }
      );
      document.querySelectorAll(".bento-tile, .showcase-tile, .mode-showcase").forEach((el) => observer.observe(el));
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
      <div className="vibe-tech-info" aria-hidden="true">
        <span className="vibe-dot pulsing" />
        <span className="vibe-badge">NEXUS: ACTIVE</span>
        <span className="vibe-badge">LATENCY: 14MS</span>
        <span className="vibe-badge">GSAP: RENDERING</span>
      </div>

      {/* Hero Section */}
      <div className="hero-band">
        <div className="hero-copy">
          <p className="section-kicker">Genza Intergenerational Bridge</p>
          <h1>Connecting Generations Through Language.</h1>
          <p className="hero-text">
            Genza translates slang, tone, and cultural context between Gen Z and adults. The engine explains every change so both sides can learn each other's language.
          </p>
          <div className="hero-actions">
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
        <div className="hero-photos" aria-label="Generation bridge preview">
          {optionalSplineScene ? (
            <Suspense fallback={<div className="spline-fallback">Loading…</div>}>
              <Spline scene={optionalSplineScene} className="spline-scene" />
            </Suspense>
          ) : (
            <div className="photo-collage">
              <div className="photo-card photo-card--main">
                <img src="/Generation-Z.jpg" alt="Generation Z group" loading="lazy" />
                <div className="photo-badge">Gen Z</div>
              </div>
              <div className="photo-card photo-card--secondary">
                <img src="/old_people.jpg" alt="Classic generation adults" loading="lazy" />
                <div className="photo-badge classic-badge">Classic</div>
              </div>
              <div className="photo-card photo-card--accent">
                <img src="/old_people_with_a_kid.webp" alt="Generations together" loading="lazy" />
              </div>
              <div className="bridge-pill">
                <ArrowRightLeft size={16} />
                <span>Language Bridge</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode Switch Cards */}
      <div className="mode-showcase">
        <button
          className={visualMode === "genz" ? "showcase-tile active" : "showcase-tile"}
          type="button"
          onClick={() => onSwitchVisual("genz")}
        >
          <div className="showcase-tile-img">
            <img src="/Gen-Z-.jpeg" alt="Gen Z style" loading="lazy" />
          </div>
          <div className="showcase-tile-info">
            <Sparkles size={19} />
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
        <article className="bento-tile large">
          <Brain size={22} />
          <h2>Deep Translation System</h2>
          <p>The engine uses LLM prompt engineering, sentiment scoring, and context adaptation. Rather than simple word swapping, it shifts entire tones and registers.</p>
          <div className="bento-glow" />
          <div className="bento-img-bg">
            <img src="/genz_swang_sticker.png" alt="" aria-hidden="true" loading="lazy" />
          </div>
        </article>
        <article className="bento-tile">
          <ArrowRightLeft size={20} />
          <h2>Dual Direction Engine</h2>
          <p>Translate Gen Z slang to classic adult tone, or turn formal language into casual slang.</p>
        </article>
        <article className="bento-tile">
          <BookOpen size={20} />
          <h2>Interactive Lexicon</h2>
          <p>A 3D dictionary with animated page turns, definitions, tone labels, and synonym navigation.</p>
        </article>
        <article className="bento-tile wide">
          <Layers size={20} />
          <h2>Genza Architecture</h2>
          <ul>
            {architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="bento-tile">
          <ShieldCheck size={20} />
          <h2>Hackathon Pitch Focus</h2>
          <p>{pitchPoints[0]} Solution: Genza offers social bridges across age demographics.</p>
        </article>
        <article className="bento-tile">
          <PenLine size={20} />
          <h2>Advanced Visual Stack</h2>
          <p>Integrated with GSAP, Anime.js, Lenis, and Barba.js with VibeUI interactive blueprints.</p>
        </article>
      </section>

      {/* People sticker row */}
      <div className="sticker-row" aria-hidden="true">
        <img src="/old_people_sticker.png" alt="" className="sticker sticker-old" loading="lazy" />
        <div className="sticker-divider" />
        <img src="/kid.webp" alt="" className="sticker sticker-kid" loading="lazy" />
        <div className="sticker-divider" />
        <img src="/old_people_sticker2.png" alt="" className="sticker sticker-old2" loading="lazy" />
      </div>
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
  onOpenLexicon
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

/* ── AuthPage ── */
function AuthPage({
  authMode,
  setAuthMode,
  onLoginSuccess
}: {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}) {
  const isRegister = authMode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password || (isRegister && !name)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (isRegister) {
      const existingUsers = JSON.parse(localStorage.getItem("genza-users") || "[]");
      if (existingUsers.some((u: any) => u.email === email)) {
        setErrorMsg("A user with this email already exists.");
        return;
      }
      const newUser = { name, email, password, role };
      existingUsers.push(newUser);
      localStorage.setItem("genza-users", JSON.stringify(existingUsers));
      localStorage.setItem("genza-current-user", JSON.stringify(newUser));
      setSuccessMsg("Account created! Redirecting…");
      setTimeout(() => onLoginSuccess(newUser), 1200);
    } else {
      if (email === "demo@genza.app" && password === "password123") {
        const demoUser = { name: "Demo User", email, role: "mentor" };
        localStorage.setItem("genza-current-user", JSON.stringify(demoUser));
        setSuccessMsg("Success! Accessing language bridge…");
        setTimeout(() => onLoginSuccess(demoUser), 1200);
        return;
      }
      const existingUsers = JSON.parse(localStorage.getItem("genza-users") || "[]");
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setErrorMsg("Invalid credentials. Try: demo@genza.app / password123");
        return;
      }
      localStorage.setItem("genza-current-user", JSON.stringify(user));
      setSuccessMsg("Welcome back! Loading session…");
      setTimeout(() => onLoginSuccess(user), 1200);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-copy">
        <div className="auth-copy-img">
          <img src="/old_people_with_a_kid.webp" alt="Generations together" loading="lazy" />
        </div>
        <p className="section-kicker">Genza workspace</p>
        <h1>{isRegister ? "Join the Genza workspace." : "Log in to your translator workspace."}</h1>
        <p>Gain access to advanced intergenerational translations, slang settings, and demo-ready dialogues.</p>
        <div className="auth-preview">
          <span>Custom slang parameters</span>
          <span>Dictionary contributions</span>
          <span>14ms AI response</span>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button className={!isRegister ? "active" : ""} type="button" onClick={() => setAuthMode("login")}>
            <LogIn size={16} />
            Login
          </button>
          <button className={isRegister ? "active" : ""} type="button" onClick={() => setAuthMode("register")}>
            <UserPlus size={16} />
            Register
          </button>
        </div>

        {errorMsg ? <div className="error-line">{errorMsg}</div> : null}
        {successMsg ? <div className="success-line">{successMsg}</div> : null}

        {isRegister ? (
          <label className="field">
            <span>Name</span>
            <div>
              <User size={16} />
              <input placeholder="Alex Rivera" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </label>
        ) : null}

        <label className="field">
          <span>Email Address</span>
          <div>
            <Mail size={16} />
            <input placeholder="you@genza.app" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div>
            <Lock size={16} />
            <input placeholder="Minimum 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </label>

        {isRegister ? (
          <label className="field">
            <span>My Generation Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student (Gen Z)</option>
              <option value="teacher">Teacher (Boomer/Millennial)</option>
              <option value="parent">Parent</option>
              <option value="mentor">Hackathon Mentor</option>
            </select>
          </label>
        ) : null}

        <button className="btn btn-primary btn-full" type="submit">
          <KeyRound size={17} />
          {isRegister ? "Register profile" : "Log in"}
        </button>
      </form>
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
            <h2>{visualMode === "classic" ? "The Classical Encyclopedia" : "📖 DECODING CYBER LEXICON"}</h2>
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
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [lexiconOpen, setLexiconOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const bridgeFlashRef = useRef<HTMLDivElement | null>(null);

  const barbaLabel = useMemo(() => {
    const core = barba as { version?: string };
    return `Barba ${core.version || "2"}`;
  }, []);

  const activeExamples = useMemo(() => examples.filter((example) => example.mode === mode), [mode]);
  const matchedEntries = useMemo(() => getMatchedEntries(text, result), [text, result]);
  const activeEntry = dictionary[bookPage] || dictionary[0];

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem("genza-current-user");
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

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
    if (!result?.translated) return;
    await navigator.clipboard.writeText(result.translated);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function selectBookPage(index: number) {
    setBookPage((index + dictionary.length) % dictionary.length);
  }

  const handleLoginSuccess = (user: { name: string; email: string; role: string }) => {
    setCurrentUser(user);
    setPage("bridge");
  };

  const handleLogout = () => {
    localStorage.removeItem("genza-current-user");
    setCurrentUser(null);
    setPage("home");
  };

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
          <span className="brand-mark">
            <ArrowRightLeft size={20} />
          </span>
          <span>
            <strong>Genza</strong>
            <small>Language Bridge</small>
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

          {currentUser ? (
            <div className="user-profile-chip">
              <div className="avatar-circle" title={`${currentUser.name} (${currentUser.role})`}>
                {currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div className="user-meta-info">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.role}</small>
              </div>
              <button className="logout-btn" type="button" onClick={handleLogout} title="Log out">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => setPage("auth")}>
              <LogIn size={16} />
              Login
            </button>
          )}
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
          />
        ) : null}

        {page === "auth" ? (
          <AuthPage authMode={authMode} setAuthMode={setAuthMode} onLoginSuccess={handleLoginSuccess} />
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
