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
  FileText,
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
import * as THREE from "three";
import { getClientFallback, translateMessage } from "./api";
import { architecture, dictionary, examples, pitchPoints } from "./data";
import { masterPrompt } from "./masterPrompt";
import type { DictionaryEntry, Example, Mode, Page, TranslationResult, VisualMode } from "./types";
import "./App.css";

const defaultText = "This assignment is cooked bro.";
const optionalSplineScene = import.meta.env.VITE_SPLINE_SCENE?.trim() || "";
const Spline = lazy(() => import("@splinetool/react-spline"));

function modeLabel(mode: Mode) {
  return mode === "genz_to_adult" ? "Gen Z to Classic" : "Classic to Gen Z";
}

function targetLabel(mode: Mode) {
  return mode === "genz_to_adult" ? "Clear adult-ready message" : "Casual Gen Z message";
}

function getMatchedEntries(text: string, result: TranslationResult | null) {
  const haystack = `${text} ${result?.translated || ""}`.toLowerCase();
  return dictionary.filter((entry) => haystack.includes(entry.term.toLowerCase())).slice(0, 6);
}

function ThreeSignalField({ visualMode }: { visualMode: VisualMode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }
    const canvas = canvasElement;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
    camera.position.z = 16;

    // Constellation setup
    const pointsCount = visualMode === "genz" ? 65 : 45;
    const particlePositions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < pointsCount; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 16;
      particlePositions.push(new THREE.Vector3(x, y, z));
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015
      ));
    }

    const geometry = new THREE.BufferGeometry();
    const positionsArray = new Float32Array(pointsCount * 3);
    
    const updatePositions = () => {
      for (let i = 0; i < pointsCount; i++) {
        positionsArray[i * 3] = particlePositions[i].x;
        positionsArray[i * 3 + 1] = particlePositions[i].y;
        positionsArray[i * 3 + 2] = particlePositions[i].z;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
      geometry.attributes.position.needsUpdate = true;
    };
    updatePositions();

    const material = new THREE.PointsMaterial({
      color: visualMode === "genz" ? 0x00edf5 : 0xcaa654,
      size: visualMode === "genz" ? 0.22 : 0.16,
      transparent: true,
      opacity: visualMode === "genz" ? 0.9 : 0.7
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Connecting lines
    const maxConnections = 90;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: visualMode === "genz" ? 0xff33b0 : 0x866327,
      transparent: true,
      opacity: visualMode === "genz" ? 0.25 : 0.22,
      linewidth: 1
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    function resize() {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0025;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0025;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameId = 0;
    function render() {
      // Float particles
      for (let i = 0; i < pointsCount; i++) {
        particlePositions[i].add(velocities[i]);
        if (Math.abs(particlePositions[i].x) > 10) velocities[i].x *= -1;
        if (Math.abs(particlePositions[i].y) > 6) velocities[i].y *= -1;
        if (Math.abs(particlePositions[i].z) > 10) velocities[i].z *= -1;
      }
      updatePositions();

      // Recalculate connections
      let lineIndex = 0;
      for (let i = 0; i < pointsCount; i++) {
        for (let j = i + 1; j < pointsCount; j++) {
          const dist = particlePositions[i].distanceTo(particlePositions[j]);
          if (dist < 4.2 && lineIndex < maxConnections) {
            const stride = lineIndex * 6;
            linePositions[stride] = particlePositions[i].x;
            linePositions[stride + 1] = particlePositions[i].y;
            linePositions[stride + 2] = particlePositions[i].z;
            linePositions[stride + 3] = particlePositions[j].x;
            linePositions[stride + 4] = particlePositions[j].y;
            linePositions[stride + 5] = particlePositions[j].z;
            lineIndex++;
          }
        }
      }
      for (let i = lineIndex; i < maxConnections; i++) {
        const stride = i * 6;
        linePositions[stride] = 0;
        linePositions[stride + 1] = 0;
        linePositions[stride + 2] = 0;
        linePositions[stride + 3] = 0;
        linePositions[stride + 4] = 0;
        linePositions[stride + 5] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // Mouse camera drift
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [visualMode]);

  return <canvas className="three-field" ref={canvasRef} aria-hidden="true" />;
}

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

function HomePage({
  visualMode,
  onStart,
  onPrompt,
  onSwitchVisual,
  barbaLabel
}: {
  visualMode: VisualMode;
  onStart: () => void;
  onPrompt: () => void;
  onSwitchVisual: (mode: VisualMode) => void;
  barbaLabel: string;
}) {
  // Reveal elements on mount with GSAP and IntersectionObserver
  useEffect(() => {
    // Initial hero load
    gsap.fromTo(
      ".hero-copy h1",
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" }
    );
    gsap.fromTo(
      ".hero-copy .hero-text",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.25, ease: "power4.out" }
    );
    gsap.fromTo(
      ".hero-copy .hero-actions button",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.45, stagger: 0.12, ease: "power3.out" }
    );

    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 35, scale: 0.97 },
              { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".bento-tile, .showcase-tile, .mode-showcase").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-page">
      {/* VibeUI tech lines background */}
      <div className="vibe-grid-lines" aria-hidden="true">
        <div className="vibe-line horizontal top" />
        <div className="vibe-line vertical left" />
        <div className="vibe-crosshair top-left">+</div>
        <div className="vibe-crosshair top-right">+</div>
        <div className="vibe-crosshair bottom-left">+</div>
        <div className="vibe-crosshair bottom-right">+</div>
      </div>

      {/* VibeUI floating badges */}
      <div className="vibe-tech-info" aria-hidden="true">
        <span className="vibe-dot pulsing" />
        <span className="vibe-badge">NEXUS STATUS: ACTIVE</span>
        <span className="vibe-badge">LATENCY: 14MS</span>
        <span className="vibe-badge">LENIS: ACTIVE</span>
        <span className="vibe-badge">GSAP: RENDERING</span>
      </div>

      <div className="hero-band">
        <div className="hero-copy">
          <p className="section-kicker">Genza Intergenerational Bridge</p>
          <h1>Connecting Generations with Translation and Explanations.</h1>
          <p className="hero-text">
            Genza transforms slang, tone, and cultural contexts between Gen Z and adults. The translation engine explains each change so both sides can learn the other's language.
          </p>
          <div className="hero-actions">
            <button className="primary-action bounce-action" type="button" onClick={onStart}>
              <Wand2 size={18} />
              Open language bridge
            </button>
            <button className="secondary-action" type="button" onClick={onPrompt}>
              <FileText size={18} />
              Edit master prompt
            </button>
          </div>
        </div>

        <div className="hero-stage" aria-label="Generation bridge preview">
          {optionalSplineScene ? (
            <Suspense fallback={<div className="spline-fallback">Loading 3D bridge</div>}>
              <Spline scene={optionalSplineScene} className="spline-scene" />
            </Suspense>
          ) : (
            <div className="signal-map">
              <div className="signal-node node-left">Gen Z</div>
              <div className="signal-beam" />
              <div className="signal-node node-right">Classic</div>
              <div className="floating-phrase phrase-one">slang conversion</div>
              <div className="floating-phrase phrase-two">tone normalization</div>
              <div className="floating-phrase phrase-three">cultural context</div>
            </div>
          )}
        </div>
      </div>

      <div className="mode-showcase">
        <button
          className={visualMode === "genz" ? "showcase-tile active" : "showcase-tile"}
          type="button"
          onClick={() => onSwitchVisual("genz")}
        >
          <Sparkles size={19} />
          <strong>Gen Z mode</strong>
          <span>Vibrant light background, bouncing cards, emojis, slang tags, neon effects.</span>
        </button>
        <button
          className={visualMode === "classic" ? "showcase-tile active classic-tile" : "showcase-tile classic-tile"}
          type="button"
          onClick={() => onSwitchVisual("classic")}
        >
          <Library size={19} />
          <strong>Classic mode</strong>
          <span>Moving aristocratic wallpaper, serif typography, page flipping book.</span>
        </button>
      </div>

      <section className="bento-grid" aria-label="Genza product overview">
        <article className="bento-tile large">
          <Brain size={21} />
          <h2>Deep Translation System</h2>
          <p>
            The translation uses LLM prompt engineering, sentiment scoring, and context adaptation. Rather than simple word replacing, it shifts entire tones.
          </p>
          <div className="bento-glow" />
        </article>
        <article className="bento-tile">
          <ArrowRightLeft size={20} />
          <h2>Dual Directional Engine</h2>
          <p>Translate from Gen Z slang to Classic adult tone, or turn formal announcements into casual slang.</p>
        </article>
        <article className="bento-tile">
          <BookOpen size={20} />
          <h2>Interactive Lexicon Book</h2>
          <p>A navbar-accessible 3D dictionary with animated page turns, definitions, tone labels, and synonyms.</p>
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
          <h2>Advanced Visual stack</h2>
          <p>Integrated with GSAP, Anime.js, Lenis, and Three.js, with vibeui.online interactive blueprints.</p>
        </article>
      </section>
    </section>
  );
}

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
              <option value="genz_to_adult">Gen Z to Adult</option>
              <option value="adult_to_genz">Adult to Gen Z</option>
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
            <button className="primary-action bounce-action" type="button" onClick={onTranslate} disabled={isTranslating || isPending}>
              <Wand2 size={18} />
              {isTranslating ? "Translating" : "Translate"}
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
              {copied ? <Clipboard size={17} /> : <Copy size={17} />}
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
      const userExists = existingUsers.some((u: any) => u.email === email);
      if (userExists) {
        setErrorMsg("A user with this email already exists.");
        return;
      }
      const newUser = { name, email, password, role };
      existingUsers.push(newUser);
      localStorage.setItem("genza-users", JSON.stringify(existingUsers));
      localStorage.setItem("genza-current-user", JSON.stringify(newUser));

      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1200);
    } else {
      const existingUsers = JSON.parse(localStorage.getItem("genza-users") || "[]");
      
      // Default hackathon admin account
      if (email === "demo@genza.app" && password === "password123") {
        const demoUser = { name: "Demo User", email, role: "mentor" };
        localStorage.setItem("genza-current-user", JSON.stringify(demoUser));
        setSuccessMsg("Success! Accessing language bridge...");
        setTimeout(() => {
          onLoginSuccess(demoUser);
        }, 1200);
        return;
      }

      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setErrorMsg("Invalid credentials. Try registering or use: demo@genza.app / password123");
        return;
      }

      localStorage.setItem("genza-current-user", JSON.stringify(user));
      setSuccessMsg("Welcome back! Loading session...");
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1200);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-copy">
        <p className="section-kicker">Genza workspace</p>
        <h1>{isRegister ? "Join the Genza workspace." : "Log in to your translator workspace."}</h1>
        <p>
          Gain access to advanced intergenerational translations, customize slang settings, save translation logs, and test demo-ready dialogues.
        </p>
        <div className="auth-preview">
          <span>Custom slang parameters</span>
          <span>Dictionary contributions</span>
          <span>14ms AI response</span>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button className={!isRegister ? "active" : ""} type="button" onClick={() => setAuthMode("login")}>
            <LogIn size={17} />
            Login
          </button>
          <button className={isRegister ? "active" : ""} type="button" onClick={() => setAuthMode("register")}>
            <UserPlus size={17} />
            Register
          </button>
        </div>

        {errorMsg ? <div className="error-line">{errorMsg}</div> : null}
        {successMsg ? <div className="success-line" style={{ padding: "12px", background: "rgba(15, 174, 155, 0.15)", border: "1px solid var(--accent)", borderRadius: "8px", color: "var(--accent)", fontWeight: "bold" }}>{successMsg}</div> : null}

        {isRegister ? (
          <label className="field">
            <span>Name</span>
            <div>
              <User size={17} />
              <input
                placeholder="Alex Rivera"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </label>
        ) : null}

        <label className="field">
          <span>Email Address</span>
          <div>
            <Mail size={17} />
            <input
              placeholder="you@genza.app"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div>
            <Lock size={17} />
            <input
              placeholder="Minimum 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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

        <button className="primary-action full" type="submit">
          <KeyRound size={18} />
          {isRegister ? "Register profile" : "Log in"}
        </button>
      </form>
    </section>
  );
}

function MasterPromptPage({
  promptDraft,
  setPromptDraft,
  onReset,
  onCopy,
  copied
}: {
  promptDraft: string;
  setPromptDraft: (value: string) => void;
  onReset: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <section className="prompt-page">
      <div className="prompt-head">
        <div>
          <p className="section-kicker">Hackathon generator</p>
          <h1>Editable Master Prompt</h1>
          <p>The prompt is emoji-free, renamed for Genza, and includes the missing product requirements.</p>
        </div>
        <div className="prompt-actions">
          <button className="secondary-action" type="button" onClick={onReset}>
            <RefreshCcw size={17} />
            Reset
          </button>
          <button className="primary-action" type="button" onClick={onCopy}>
            {copied ? <Clipboard size={17} /> : <Copy size={17} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="prompt-layout">
        <textarea
          className="master-prompt-editor"
          value={promptDraft}
          onChange={(event) => setPromptDraft(event.target.value)}
          spellCheck={false}
        />
        <aside className="prompt-summary">
          <h2>Included</h2>
          <ul>
            <li>POST /translate contract</li>
            <li>Why It Changed explainer</li>
            <li>Dual Gen Z and Classic design systems</li>
            <li>Bridge transition requirement</li>
            <li>Interactive dictionary with synonyms</li>
            <li>React, Express, LLM, GSAP, Anime, Lenis, Three, Spline, Barba</li>
            <li>Devpost-ready pitch expectations</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

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

  // Trigger flipping sequence when target index changes
  useEffect(() => {
    if (pageIndex === localPageIndex) {
      return;
    }
    const direction = pageIndex > localPageIndex ? "forward" : "backward";
    setFlipDirection(direction);
    setIsFlipping(true);

    const timer = setTimeout(() => {
      setLocalPageIndex(pageIndex);
      setIsFlipping(false);
    }, 600); // sync with CSS animation time

    return () => clearTimeout(timer);
  }, [pageIndex, localPageIndex]);

  // Entrance zoom using GSAP
  useEffect(() => {
    if (!open || !bookRef.current) {
      return;
    }
    gsap.fromTo(
      bookRef.current,
      { opacity: 0, scale: 0.94, rotateX: 10 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 0.45, ease: "back.out(1.3)" }
    );
  }, [open]);

  if (!open) {
    return null;
  }

  const currentEntry = dictionary[localPageIndex] || entry;
  const targetEntryForFlip = dictionary[pageIndex] || entry;

  const handleSynonymClick = (synonym: string) => {
    const matchedIdx = dictionary.findIndex(
      (item) =>
        item.term.toLowerCase() === synonym.toLowerCase() ||
        item.synonyms.some((s) => s.toLowerCase() === synonym.toLowerCase())
    );
    if (matchedIdx !== -1) {
      onSelect(matchedIdx);
    }
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
          {/* Static Index Page on Left */}
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

          {/* Details Page on Right (shows destination details once flip is complete) */}
          <section className="book-page book-right">
            <div className="entry-header">
              <span className={`tone-label ${entry.tone}`}>{entry.tone}</span>
              <span className="entry-count">
                Page {pageIndex + 1} of {dictionary.length}
              </span>
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
                <dt>Interactive Synonyms (Click to turn page)</dt>
                <dd className="synonym-tags">
                  {entry.synonyms.map((syn) => (
                    <button
                      key={syn}
                      type="button"
                      className="synonym-tag-btn"
                      onClick={() => handleSynonymClick(syn)}
                    >
                      {syn}
                    </button>
                  ))}
                </dd>
              </div>
            </div>
          </section>

          {/* Flipping animation sheet overlay */}
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
          <button className="secondary-action" type="button" onClick={onPrev}>
            <ChevronLeft size={18} />
            Prev Page
          </button>
          <button className="secondary-action" type="button" onClick={onNext}>
            Next Page
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>("home");
  const [mode, setMode] = useState<Mode>("genz_to_adult");
  const [visualMode, setVisualMode] = useState<VisualMode>("genz");
  const [text, setText] = useState(defaultText);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [lexiconOpen, setLexiconOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [promptDraft, setPromptDraft] = useState(() => localStorage.getItem("genza-master-prompt") || masterPrompt);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const bridgeFlashRef = useRef<HTMLDivElement | null>(null);

  const activeExamples = useMemo(() => examples.filter((example) => example.mode === mode), [mode]);
  const matchedEntries = useMemo(() => getMatchedEntries(text, result), [text, result]);
  const activeEntry = dictionary[bookPage] || dictionary[0];
  const barbaLabel = useMemo(() => {
    const core = barba as { version?: string };
    return `Barba ${core.version || "2"} style`;
  }, []);

  // Check for active login session on mount
  useEffect(() => {
    const saved = localStorage.getItem("genza-current-user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to parse local session.");
      }
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frameId = 0;

    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  // Screen transition animate in (similar to Barba js)
  useEffect(() => {
    if (!pageRef.current) {
      return;
    }

    gsap.fromTo(
      pageRef.current,
      { autoAlpha: 0, y: 24, filter: "blur(5px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power4.out" }
    );
  }, [page]);

  useEffect(() => {
    localStorage.setItem("genza-master-prompt", promptDraft);
  }, [promptDraft]);

  useEffect(() => {
    if (!result) {
      return;
    }

    animate(".reaction-pop", {
      opacity: [0, 1],
      y: [14, 0],
      scale: [0.92, 1],
      duration: 520,
      ease: "outBack"
    });

    animate(".slang-chip", {
      opacity: [0, 1],
      y: [12, 0],
      delay: stagger(65),
      duration: 420,
      ease: "outCubic"
    });
  }, [result]);

  function switchVisualMode(nextMode: VisualMode) {
    if (nextMode === visualMode) {
      return;
    }

    const flash = bridgeFlashRef.current;
    if (flash) {
      gsap.set(flash, {
        opacity: 1,
        scaleX: nextMode === "classic" ? 1.08 : 0.72,
        background:
          nextMode === "classic"
            ? "linear-gradient(90deg, rgba(42, 28, 12, 0), rgba(217, 184, 99, 0.72), rgba(42, 28, 12, 0))"
            : "linear-gradient(90deg, rgba(0, 245, 255, 0), rgba(255, 51, 176, 0.8), rgba(197, 255, 54, 0))"
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
    if (!result?.translated) {
      return;
    }

    await navigator.clipboard.writeText(result.translated);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(promptDraft);
    setPromptCopied(true);
    window.setTimeout(() => setPromptCopied(false), 1400);
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

  return (
    <main className={`app-shell ${visualMode}`} data-barba="wrapper">
      {/* VibeUI background overlay */}
      <div className="grid-backdrop" aria-hidden="true" />
      <div className="wallpaper-motion" aria-hidden="true" />
      <ThreeSignalField visualMode={visualMode} />
      <div className="bridge-flash" ref={bridgeFlashRef} aria-hidden="true" />

      <nav className="nav-shell" aria-label="Main navigation">
        <button className="brand-lockup" type="button" onClick={() => setPage("home")}>
          <span className="brand-mark">
            <ArrowRightLeft size={21} />
          </span>
          <span>
            <strong>Genza</strong>
            <small>Language Bridge</small>
          </span>
        </button>

        <div className="nav-links">
          <NavButton icon={<Home size={17} />} label="Home" active={page === "home"} onClick={() => setPage("home")} />
          <NavButton
            icon={<Wand2 size={17} />}
            label="Bridge"
            active={page === "bridge"}
            onClick={() => setPage("bridge")}
          />
          <NavButton
            icon={<FileText size={17} />}
            label="Master Prompt"
            active={page === "prompt"}
            onClick={() => setPage("prompt")}
          />
          <button className="nav-link lexicon-nav" type="button" onClick={() => setLexiconOpen(true)}>
            <BookOpen size={17} />
            <span>Live Lexicon</span>
          </button>
        </div>

        <div className="nav-actions">
          <div className="visual-switch" aria-label="Visual mode">
            <button className={visualMode === "genz" ? "active" : ""} type="button" onClick={() => switchVisualMode("genz")}>
              <Sparkles size={16} />
              Gen Z
            </button>
            <button
              className={visualMode === "classic" ? "active" : ""}
              type="button"
              onClick={() => switchVisualMode("classic")}
            >
              <Library size={16} />
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
                <X size={15} />
              </button>
            </div>
          ) : (
            <button className="login-chip" type="button" onClick={() => setPage("auth")}>
              <LogIn size={17} />
              Login
            </button>
          )}
        </div>
      </nav>

      <div className="page-shell" ref={pageRef} data-barba="container" data-barba-namespace={page}>
        {page === "home" ? (
          <HomePage
            visualMode={visualMode}
            onStart={() => setPage("bridge")}
            onPrompt={() => setPage("prompt")}
            onSwitchVisual={switchVisualMode}
            barbaLabel={barbaLabel}
          />
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
          <AuthPage
            authMode={authMode}
            setAuthMode={setAuthMode}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : null}

        {page === "prompt" ? (
          <MasterPromptPage
            promptDraft={promptDraft}
            setPromptDraft={setPromptDraft}
            onReset={() => setPromptDraft(masterPrompt)}
            onCopy={copyPrompt}
            copied={promptCopied}
          />
        ) : null}
      </div>

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
