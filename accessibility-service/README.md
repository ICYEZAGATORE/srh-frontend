# SRH Accessibility Services (microservice)

An **independent, self-hosted microservice** for the SRH platform's Layer 3
accessibility features (proposal §3.4 / §3.9). Deployed separately from
`srh-backend-api`.

| Capability | Endpoint | Status without ML deps |
|---|---|---|
| Simplified language | `POST /v1/simplify` | ✅ **works** (pure stdlib) |
| Text-to-speech (Coqui/Mozilla TTS) | `POST /v1/tts` | 🟡 `503` until model installed |
| Alt-text (image captioning) | `POST /v1/alt-text` | 🟡 `503` until model installed |
| Health / readiness | `GET /health` | ✅ works |

**Graceful degradation is the whole design:** the frontend calls this service but
falls back safely when a capability is unavailable (TTS → browser Web Speech API;
alt-text → human-authored alt). So the app works before and after the heavy models
are provisioned.

---

## Run it

```bash
cd accessibility-service
python -m venv .venv && source .venv/bin/activate     # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8080
# GET http://localhost:8080/health
```

Enable TTS + alt-text (large — hundreds of MB, downloads models on first call):

```bash
pip install -r requirements.txt -r requirements-ml.txt
```

### Docker
```bash
docker build -t srh-accessibility .
docker run -p 8080:8080 -e ALLOWED_ORIGINS=http://localhost:5173 srh-accessibility
```

### Tests (simplifier — no ML deps needed)
```bash
python tests/test_simplify.py     # or: pytest
```

---

## Wiring the frontend

Set in the frontend's env (`.env`, `.env.production`):
```
VITE_ACCESSIBILITY_API_URL=http://localhost:8080
```
- Empty/unset → the frontend uses its built-in fallbacks (Web Speech, authored
  alt) and never calls this service. This keeps the current mock demo clean.
- Set → the TTS button calls `POST /v1/tts`; `<AltImage>` calls `POST /v1/alt-text`;
  simplified-language mode can call `POST /v1/simplify`.

---

## ⚠️ Kinyarwanda TTS voice — honest status

There is **no trained/fine-tuned Kinyarwanda voice** wired here. The default Coqui
model is **English**. If `POST /v1/tts` is called with `lang=rw` while only the
English model is loaded, the audio is an **English voice approximating Kinyarwanda
text — this is NOT a real Kinyarwanda voice** and will mispronounce words. The
service signals this with:
- `health.tts.kinyarwanda_voice_available: false`
- response header `X-Voice-Caveat: no-kinyarwanda-voice; pronunciation-approximate`

**Follow-up required** — one of:
1. Integrate an existing open Kinyarwanda voice/TTS model. Check **Digital Umuganda**
   and **Mbaza NLP** (Rwandan NLP community; they maintain Kinyarwanda speech/NLP
   datasets and models), and Coqui/Common Voice Kinyarwanda data.
2. Fine-tune a Coqui VITS/Tacotron model on a Kinyarwanda speech corpus, then set
   `COQUI_MODEL` and flip `KINYARWANDA_VOICE_AVAILABLE` in `app/tts.py`.

Until then, Kinyarwanda TTS remains 🟡 and the frontend's Web Speech fallback (also
lacking a rw voice on most devices) applies. Do not present English-voice-reading-
Kinyarwanda as equivalent to a Kinyarwanda voice.

## Alt-text — status
Captioning uses BLIP (English captions). Wired end-to-end via the frontend
`<AltImage>` component, but returns `503` until `requirements-ml.txt` + weights are
installed. Kinyarwanda alt-text translation is a follow-up (reuse the platform's
translation path).

## Simplified language — status ✅
Real, deterministic, cacheable rule-based transformation in `app/simplify.py`
(filler removal, complex→simple word substitution, long-sentence splitting).
Domain-critical vocabulary (e.g. "contraception", "HIV") is preserved. Kinyarwanda
gets structural simplification only (sentence splitting) — lexical simplification
for Kinyarwanda is a follow-up needing a Kinyarwanda resource. Evidence it changes
output quality: see `tests/test_simplify.py` (asserts measurable readability gains).
```
[en] BEFORE avg_sentence_len 37.0, complex_words 5
[en] AFTER  avg_sentence_len 13.5, complex_words 0
```
