"""
SRH Accessibility Services — an INDEPENDENT microservice (proposal §3.4 / §3.9,
Layer 3). Separate deployable unit; not bolted into srh-backend-api.

Endpoints
  GET  /health            liveness + readiness of each capability
  POST /v1/simplify       simplified-language transformation (works today)
  POST /v1/tts            text-to-speech (Coqui/Mozilla TTS; 503 until model present)
  POST /v1/alt-text       image-captioning alt text (BLIP; 503 until model present)

Graceful degradation: /simplify and /health work with only the light core deps.
/tts and /alt-text return 503 until the heavy ML deps + models are installed
(requirements-ml.txt), at which point the frontend automatically upgrades from
its Web Speech / authored-alt fallbacks to this service.
"""
from __future__ import annotations
import os

from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import tts, alt_text
from .simplify import simplify_text, readability

app = FastAPI(title="SRH Accessibility Services", version="0.1.0")

# The frontend calls this from the browser, so CORS must allow its origin(s).
_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins if o.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class SimplifyIn(BaseModel):
    text: str
    lang: str = Field(default="en", pattern="^(en|rw)$")


class TTSIn(BaseModel):
    text: str
    lang: str = Field(default="en", pattern="^(en|rw)$")


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "simplify": True,  # always available (pure stdlib)
        "tts": tts.status(),
        "alt_text": alt_text.status(),
    }


@app.post("/v1/simplify")
def post_simplify(body: SimplifyIn) -> dict:
    simplified = simplify_text(body.text, body.lang)
    return {
        "lang": body.lang,
        "original": body.text,
        "simplified": simplified,
        "readability_before": readability(body.text),
        "readability_after": readability(simplified),
    }


@app.post("/v1/tts")
def post_tts(body: TTSIn) -> Response:
    try:
        audio = tts.synthesize(body.text, body.lang)
    except tts.TTSUnavailable as exc:
        # 503 → frontend falls back to Web Speech API.
        raise HTTPException(status_code=503, detail=str(exc))
    headers = {}
    if body.lang == "rw" and not tts.KINYARWANDA_VOICE_AVAILABLE:
        # Be explicit that this is NOT a real Kinyarwanda voice.
        headers["X-Voice-Caveat"] = "no-kinyarwanda-voice; pronunciation-approximate"
    return Response(content=audio, media_type="audio/wav", headers=headers)


@app.post("/v1/alt-text")
async def post_alt_text(image: UploadFile = File(...), lang: str = "en") -> dict:
    data = await image.read()
    try:
        text = alt_text.generate_alt_text(data)
    except alt_text.AltTextUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return {"alt_text": text, "lang": lang, "generated": True}
