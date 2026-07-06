# SRH-FRONTEND

**AI-Powered Sexual & Reproductive Health Education Platform — Frontend**
Rwanda | Kinyarwanda–English | Disability-Inclusive PWA

---

## Project Context

This is the frontend repository for an inclusive, AI-powered SRH education platform designed for Rwandan teenagers (ages 13–19) and persons with disabilities (PWDs). The platform delivers bilingual (Kinyarwanda/English) conversational AI for SRH education with full accessibility support.

This repo works in tandem with two sibling repositories:
- **SRH-BACKEND-API** — FastAPI backend, RAG pipeline, model serving
- **SRH-ML-MODEL** — Safety classifier, topic classifier, and bilingual conversational agent (in development)

> **Current status:** The ML models are still being trained. The frontend should be built with mock/stubbed API responses and clear integration points so it can be wired to the real backend with minimal changes once the models are ready.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Progressive Web App) |
| Styling | Tailwind CSS |
| Accessibility | ARIA compliance libraries, WCAG 2.1 AA target |
| Language | JavaScript / TypeScript |
| TTS (client-side) | Web Speech API (stub); will connect to backend TTS microservice |
| Testing | React Testing Library, manual accessibility audits (NVDA + Android) |
| Containerisation | Docker |
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

## Key Features to Build

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
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_DEFAULT_LANG=en
REACT_APP_USE_MOCK=false
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

### Local Development

```bash
git clone https://github.com/<your-org>/SRH-FRONTEND.git
cd SRH-FRONTEND
cp .env.example .env          # Set REACT_APP_API_BASE_URL
npm install
npm start                     # Runs on http://localhost:3000
```

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

> The ML models (Safety Classifier, Topic Classifier, Conversational Agent) are being trained in **SRH-ML-MODEL** and will be served through **SRH-BACKEND-API**. The frontend does NOT call the models directly.

**While models are in development**, use mock responses:

```js
// src/api/mockClient.js — activated when REACT_APP_USE_MOCK=true
export const sendMessage = async (message, lang) => ({
  response: lang === 'rw'
    ? 'Ibi ni ikibazo cyiza. Contraception ni...'
    : 'That is a great question. Contraception refers to...',
  safe: true,
  topic: 'contraception',
  lang,
  fallback: false,
});
```

Switch from mock to real by flipping `REACT_APP_USE_MOCK=false` — no component changes needed.

**Planned model updates that will affect the frontend:**
- Safety classifier output → drives `safe` / `fallback` flags in the response
- Topic classifier output → drives `topic` field (used for analytics display)
- TTS microservice (Mozilla TTS, Kinyarwanda voice) → replaces Web Speech API fallback

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

Target: cloud hosting suited for low-bandwidth Rwanda (Railway, Render, or VPS with Nginx).

**Build for production:**
```bash
npm run build
```

**PWA requirements:**
- `manifest.json` with app name, icons, `display: standalone`
- Service worker for offline caching of the UI shell
- HTTPS required for PWA install prompt on Android

---

## Contributing

This project is part of an ALU BSc Software Engineering capstone. Open a PR with a clear description. For accessibility changes, include a Lighthouse accessibility score screenshot.