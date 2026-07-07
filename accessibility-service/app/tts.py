"""
Text-to-speech via Coqui TTS (the maintained successor to Mozilla TTS), matching
proposal §3.9's "Mozilla TTS, self-hosted" requirement.

Design:
- Lazy-loads the model so the service starts instantly; TTS becomes ready only
  once the (large) model + deps are present.
- If the model / deps are absent, synthesize() raises TTSUnavailable and the API
  returns 503 — the FRONTEND then falls back to the browser Web Speech API, so
  users are never left without audio.

HONEST KINYARWANDA CAVEAT:
There is currently NO trained/fine-tuned Kinyarwanda voice wired here. With
lang="rw" and only an English model available, an English voice would mispronounce
Kinyarwanda text — that is NOT equivalent to a real Kinyarwanda voice. We surface
this via `kinyarwanda_voice_available = False` and a caveat flag on the response.
Follow-up: obtain/train a Kinyarwanda voice (see README — Digital Umuganda / Mbaza
NLP open resources).
"""
from __future__ import annotations
import io
import os
import wave

_MODEL = None
_LOAD_ERROR: str | None = None

# Flip to True only once a real Kinyarwanda voice model is integrated + validated.
KINYARWANDA_VOICE_AVAILABLE = False


class TTSUnavailable(RuntimeError):
    pass


def _load() -> None:
    global _MODEL, _LOAD_ERROR
    if _MODEL is not None or _LOAD_ERROR is not None:
        return
    try:
        from TTS.api import TTS  # Coqui TTS (heavy; see requirements-ml.txt)

        model_name = os.getenv("COQUI_MODEL", "tts_models/en/ljspeech/tacotron2-DDC")
        _MODEL = TTS(model_name)
    except Exception as exc:  # noqa: BLE001 — any failure means "not available"
        _LOAD_ERROR = f"{type(exc).__name__}: {exc}"


def is_ready() -> bool:
    _load()
    return _MODEL is not None


def status() -> dict:
    _load()
    return {
        "ready": _MODEL is not None,
        "load_error": _LOAD_ERROR,
        "kinyarwanda_voice_available": KINYARWANDA_VOICE_AVAILABLE,
    }


def synthesize(text: str, lang: str = "en") -> bytes:
    """Return WAV audio bytes for `text`. Raises TTSUnavailable if no model."""
    _load()
    if _MODEL is None:
        raise TTSUnavailable(_LOAD_ERROR or "TTS model not loaded")

    import numpy as np  # provided with Coqui TTS

    wav = _MODEL.tts(text=text)  # list[float] PCM at model.synthesizer.output_sample_rate
    sample_rate = getattr(_MODEL.synthesizer, "output_sample_rate", 22050)
    pcm16 = (np.clip(np.array(wav), -1.0, 1.0) * 32767).astype("<i2").tobytes()

    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        w.writeframes(pcm16)
    return buf.getvalue()
