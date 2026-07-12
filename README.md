# SRH-FRONTEND

**AI-Powered Sexual & Reproductive Health Education Platform — Frontend**
Rwanda | Kinyarwanda–English | Disability-Inclusive PWA

---

## Project Context

This is the frontend repository for an inclusive, AI-powered SRH education platform designed for Rwandan teenagers (ages 13–19) and persons with disabilities (PWDs). The platform delivers bilingual (Kinyarwanda/English) conversational AI for SRH education with full accessibility support.

This repo works in tandem with two sibling repositories:
- **[SRH-BACKEND-API](https://github.com/ICYEZAGATORE/srh-backend-api)** — FastAPI backend, RAG pipeline, model serving (**the main submission repo; system-wide testing/V&V lives there**)
- **[SRH-ML-MODEL](https://github.com/ICYEZAGATORE/srh-ml-model)** — safety, topic & language classifiers + knowledge-base ingestion

> **Current status: live & deployed.** The frontend is a Vite + React PWA deployed on
> Vercel and wired to the live backend (models integrated, not mocked). The mock client
> remains available for offline development.
>
> **Live app:** https://srh-frontend.vercel.app · **Backend health:**
> https://srh-backend-api.onrender.com/api/v1/health · **Demo video:** _add link here_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework / build | React 18 + **Vite** (Progressive Web App, service worker) |
| Styling | Tailwind CSS |
| Accessibility | ARIA, WCAG 2.1 AA target |
| Language | JavaScript (JSX) |
| Voice I/O | **TTS** (Web Speech API; optional Mozilla-TTS microservice) · **Voice input / STT** (Web Speech Recognition, English) |
| Testing | **Vitest + Testing Library + jest-axe** (automated a11y); manual NVDA/TalkBack audit checklist |
| Hosting | **Vercel** (production) |
| Version Control | GitHub |

---

## Architecture Overview

```
SRH-FRONTEND (React PWA)
│
├── User Interface Layer
│   ├── Chat interface (bilingual: Kinyarwanda / English)
│   ├── Accessibility controls (font size, high contrast, TTS toggle)
│   ├── Language selector (Kinyarwanda / English)
│   └── Onboarding / consent screen
│
├── API Client Layer
│   ├── Connects to SRH-BACKEND-API via REST
│   ├── Handles session tokens, conversation history
│   └── Graceful fallback if ML models are unavailable
│
└── Accessibility Services (client-side)
    ├── Text-to-speech toggle (Web Speech API → backend TTS)
    ├── Screen reader compatible markup (ARIA roles, live regions)
    ├── High contrast mode
    └── Adjustable text size
```

---

## Key Features (delivered)

> All features below are **implemented and live**. The optional Mozilla-TTS/alt-text/
> simplify microservice (`accessibility-service/`) is built but **not wired in production**
> (`VITE_ACCESSIBILITY_API_URL` unset) — TTS runs on the Web Speech fallback. The
> Assessment module (§6) is a placeholder.

### 0. Voice input (speech-to-text) — accessibility, additive
- Microphone button in the chat input row; transcribes speech into the field for review
  before sending (never auto-sends). English via the Web Speech API; in Kinyarwanda the mic
  is shown disabled with an honest message (browser STT has no reliable Kinyarwanda support).

### 1. Chat Interface
- Mobile-first conversation UI optimised for Android smartphones
- Bilingual input/output — user can type or receive responses in Kinyarwanda or English
- Message bubbles showing: user query → loading indicator → AI response
- Safe fallback message displayed when the backend safety classifier flags a query as UNSAFE
- Referral card displayed alongside fallback (links to health worker / helpline)

### 2. Accessibility Features
- **Text-to-speech (TTS):** Play button on every AI response; calls backend `/tts` endpoint; falls back to Web Speech API
- **Screen reader support:** Full ARIA labelling, landmark roles, live regions for dynamic chat updates
- **High contrast mode:** Toggle in settings; persists via localStorage
- **Adjustable text size:** Three size levels (default, large, extra-large)
- **Simplified language mode:** UI label toggle — passes a `simplified=true` param to the backend so the LLM adjusts reading level

### 3. Language Selector
- Toggle between Kinyarwanda and English at any point in the conversation
- Passes `lang` parameter (`rw` or `en`) with every API request
- UI labels, placeholder text, and system messages switch language dynamically

### 4. Onboarding / Consent Screen
- Brief explanation of what the platform is and who operates it
- Age gate (confirm user is 13+)
- Data privacy notice (no PII stored; anonymous sessions)
- Accessibility preference setup (language, font size, TTS on/off)

### 5. Assessment Module (future)
- Pre/post SRH knowledge quiz (for research purposes)
- Results stored via backend `/assessment` endpoint
- **Not required for MVP; stub the route and leave the component placeholder**

---

## API Integration Points

All requests go to the `SRH-BACKEND-API` base URL (configured via environment variable).

### Environment Variables

```env
# Vite env vars (must be prefixed VITE_)
VITE_API_BASE_URL=https://srh-backend-api.onrender.com
VITE_ACCESSIBILITY_API_URL=            # optional; unset → Web Speech / authored-alt fallback
```

### Endpoints the Frontend Calls

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/chat` | Send user query; receive AI response |
| `POST` | `/api/v1/tts` | Convert response text to audio |
| `GET` | `/api/v1/health` | Backend health check (show offline banner if down) |
| `POST` | `/api/v1/session/start` | Start anonymous session |
| `POST` | `/api/v1/assessment/submit` | Submit pre/post quiz (stub for now) |

### Chat Request/Response Shape

**Request (`POST /api/v1/chat`):**
```json
{
  "session_id": "uuid-string",
  "message": "Uburwayi bw'ibyongerwa ni iki?",
  "lang": "rw",
  "simplified": false
}
```

**Response:**
```json
{
  "response": "Uburwayi bw'ibyongerwa...",
  "safe": true,
  "topic": "sti_hiv",
  "lang": "rw",
  "fallback": false
}
```

If `safe: false` or `fallback: true`, show the safe fallback message instead of `response` and render the referral card.

### Fallback / Offline Handling
- If the backend is unreachable, show a banner: "Service temporarily unavailable. Please try again later."
- Do not show an error that might discourage a vulnerable user from seeking help
- Always show static helpline numbers regardless of backend status

---

## Folder Structure (Suggested)

```
srh-frontend/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── api/
│   │   ├── client.js          # Axios/fetch wrapper for all backend calls
│   │   └── mockClient.js      # Stub responses for ML-not-ready phase
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── InputBar.jsx
│   │   │   └── FallbackCard.jsx
│   │   ├── Accessibility/
│   │   │   ├── TTSButton.jsx
│   │   │   ├── FontSizeControl.jsx
│   │   │   └── ContrastToggle.jsx
│   │   ├── Onboarding/
│   │   │   └── ConsentScreen.jsx
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       └── OfflineBanner.jsx
│   ├── contexts/
│   │   ├── LanguageContext.js  # Global lang state (rw / en)
│   │   └── SessionContext.js   # session_id, accessibility prefs
│   ├── hooks/
│   │   ├── useChat.js
│   │   └── useTTS.js
│   ├── i18n/
│   │   ├── en.json             # English UI strings
│   │   └── rw.json             # Kinyarwanda UI strings
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Assessment.jsx      # Stub placeholder
│   ├── App.jsx
│   └── index.js
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- Docker (optional, for containerised dev)

### Local Development (Vite)

```bash
git clone https://github.com/ICYEZAGATORE/srh-frontend.git
cd srh-frontend
cp .env.example .env          # set VITE_API_BASE_URL
npm install
npm run dev                   # Vite dev server (http://localhost:5173)
npm run build                 # production build → dist/
npm run preview               # preview the production build
```

### Testing

```bash
npx vitest run                # unit + integration + a11y (Vitest)
npx vitest run src/test       # accessibility-focused subset (jest-axe)
```
Current suite: **31 tests passing**, incl. **9 `jest-axe` assertions (0 violations)** across
landing, chat, consent, settings, and the voice-input mic states. System-wide V&V (e2e,
performance, low-bandwidth, load, ML eval) lives in the backend repo:
[`SRH-BACKEND-API/testing/`](https://github.com/ICYEZAGATORE/srh-backend-api/tree/main/testing).

### Running with Docker

```bash
docker build -t srh-frontend .
docker run -p 3000:3000 srh-frontend
```

### Running with Docker Compose (Frontend + Backend together)

```bash
# From a shared docker-compose.yml at the project root
docker-compose up
```

---

## ML Model Integration Notes

> The ML models (safety, topic, language classifiers + RAG conversational agent) are trained
> in **SRH-ML-MODEL**, served through **SRH-BACKEND-API**, and **live in production**. The
> frontend does NOT call the models directly — it talks to the backend REST API. A mock
> client (`src/api/mockClient.js`) is retained for offline UI development.

How model outputs surface in the UI:
- Safety classifier → `safe` / `fallback` flags → the safe fallback message + referral card.
- Topic classifier → `topic` field (analytics / display).
- TTS: Web Speech API today; swaps to the Mozilla-TTS microservice automatically if
  `VITE_ACCESSIBILITY_API_URL` is set.

---

## Accessibility Standards

Target: **WCAG 2.1 Level AA**

- All interactive elements keyboard-navigable
- Colour contrast ratio ≥ 4.5:1 for normal text
- All images and icons have `alt` text or `aria-label`
- Chat messages announced via `aria-live="polite"`
- All form inputs have associated `<label>` elements
- No information conveyed by colour alone

Testing tools: NVDA (desktop screen reader), TalkBack (Android), Lighthouse accessibility audit.

---

## Deployment

**Deployed on Vercel** (production): https://srh-frontend.vercel.app

- Config in `vercel.json` (framework `vite`, `buildCommand npm run build`, `outputDirectory dist`,
  SPA rewrite to `/index.html`).
- Deploy: `vercel --prod` (CLI) or push to `main` (Git integration).
- Set `VITE_API_BASE_URL` in the Vercel project env.
- **PWA:** `public/manifest.json` + `public/sw.js` (registered in production) cache the app
  shell for offline/low-bandwidth use; HTTPS is provided by Vercel.

Full cross-repo deployment plan (backend + frontend + services):
[`SRH-BACKEND-API/docs/DEPLOYMENT.md`](https://github.com/ICYEZAGATORE/srh-backend-api/blob/main/docs/DEPLOYMENT.md).

---

## Contributing

This project is part of an ALU BSc Software Engineering capstone. Open a PR with a clear description. For accessibility changes, include a Lighthouse accessibility score screenshot.