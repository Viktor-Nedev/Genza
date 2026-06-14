export const masterPrompt = `MASTER PROMPT (HACKATHON PROJECT GENERATOR)

PROJECT INSTRUCTION PROMPT

You are a senior full-stack engineer, AI/NLP researcher, and hackathon mentor.

I want you to design and generate a complete hackathon project called:

Genza - The Intergenerational Language Bridge

CORE IDEA

Build an AI-powered platform that translates and adapts language between generations:

Gen Z to older generation: clear, formal, respectful, simple
Older generation to Gen Z: modern slang, casual tone, simplified meaning

But not just rephrasing.

The system must also perform:

tone transformation
slang decoding
readability simplification
cultural/context adaptation
emotional tone normalization

PRODUCT REQUIREMENTS

1. MAIN FEATURE: AI TRANSLATION ENGINE

Create an endpoint:

POST /translate

Input:

{
  "text": "string",
  "mode": "genz_to_adult | adult_to_genz"
}

Output:

{
  "translated": "string",
  "explanation": [
    "why changes were made"
  ]
}

2. WHY IT CHANGED EXPLAINER

For every transformation, include explanations for:

slang conversion
tone shift
simplification
cultural reinterpretation

Example:

lowkey insane -> very difficult
Reason: slang exaggeration removed for clarity

3. AI LOGIC

Combine:

LLM prompt engineering as the primary intelligence layer
slang dictionary mapping
readability simplification logic
sentiment normalization

Optional:

Flesch readability score adjustment
phrase-level decomposition

4. FRONTEND

Build a modern React frontend.

Layout:

Split-screen interface:
Left: input text
Right: translated output

Controls:

dropdown:
Gen Z to Adult
Adult to Gen Z

Translate button
Toggle Explain changes

5. DUAL DESIGN SYSTEM

The app must have two visual modes:

GEN Z MODE (SOCIAL / CHAOTIC STYLE)

Design:

neon gradients in purple, cyan, pink, lime, and yellow
animated cards
glitch transitions
floating UI elements
playful interaction style

Micro-interactions:

bouncing buttons
meme-like reaction popups after translation
animated slang tags

CLASSIC MODE (ACADEMIC / LIBRARY STYLE)

Design:

parchment background
gold borders
serif typography
calm symmetrical layout
book-like UI
aristocratic wallpaper motion

Interactions:

page flip animations
soft fade transitions
dictionary-style entries

6. SIGNATURE FEATURE: BRIDGE TRANSITION

When switching modes:

Gen Z to Classic: chaotic UI collapses into a calm academic interface
Classic to Gen Z: structured layout breaks into a neon dynamic UI

This is a key differentiator.

7. DICTIONARY FEATURE

Add interactive dictionary.

For slang or formal expressions include:

definition
usage example
tone label: formal, slang, emotional, or neutral
synonyms

Display modes:

Gen Z: card-based popups
Classic: encyclopedia-style book entries

8. TECH STACK

Frontend:

React with Vite

Backend:

Node.js with Express

AI:

OpenAI or equivalent LLM API

Motion and interaction:

GSAP for bridge transitions
Anime.js for micro-interactions
Lenis for smooth scrolling
Three.js for animated background depth
Spline-ready scene slot for 3D hero work
Barba.js-inspired page transition layer

Optional:

Redis caching
slang dataset JSON

9. DEMO FLOW

Problem:

People from different generations misunderstand each other online.

Example input:

This assignment is cooked bro

AI output:

This assignment is very difficult.

Explanation of changes:

slang removed
tone normalized
clarity improved

UI WOW MOMENT:

Switch between Gen Z and Classic mode.

10. OUTPUT REQUIREMENTS

Generate:

Full architecture overview
Backend code, complete and not partial
React frontend structure
AI prompt system
UI description
Folder structure
Example API responses
Hackathon pitch, Devpost-ready

FINAL GOAL

The project must feel like a real startup product:

polished UX
strong NLP reasoning
clear social impact
production-level structure`;
