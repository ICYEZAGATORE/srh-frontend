"""
Automatic alt-text generation for educational/illustrative images the platform
serves (proposal Layer 3 — currently entirely absent).

Uses an image-captioning model (default: BLIP, `Salesforce/blip-image-captioning-base`)
behind a lazy loader. If transformers/torch or the model weights are absent,
generate_alt_text() raises AltTextUnavailable and the API returns 503; the
frontend then falls back to any human-authored alt text it already has.

Note: captions are generated in English. Translating alt-text to Kinyarwanda
should reuse the platform's translation path — not done here (follow-up).
"""
from __future__ import annotations
import io

_CAPTIONER = None
_LOAD_ERROR: str | None = None


class AltTextUnavailable(RuntimeError):
    pass


def _load() -> None:
    global _CAPTIONER, _LOAD_ERROR
    if _CAPTIONER is not None or _LOAD_ERROR is not None:
        return
    try:
        from transformers import pipeline  # heavy; see requirements-ml.txt

        _CAPTIONER = pipeline(
            "image-to-text", model="Salesforce/blip-image-captioning-base"
        )
    except Exception as exc:  # noqa: BLE001
        _LOAD_ERROR = f"{type(exc).__name__}: {exc}"


def is_ready() -> bool:
    _load()
    return _CAPTIONER is not None


def status() -> dict:
    _load()
    return {"ready": _CAPTIONER is not None, "load_error": _LOAD_ERROR}


def generate_alt_text(image_bytes: bytes) -> str:
    _load()
    if _CAPTIONER is None:
        raise AltTextUnavailable(_LOAD_ERROR or "caption model not loaded")

    from PIL import Image

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    result = _CAPTIONER(image)
    caption = (result[0].get("generated_text") if result else "") or ""
    caption = caption.strip()
    # Keep it concise and sentence-cased for use as an alt attribute.
    if caption:
        caption = caption[0].upper() + caption[1:]
    return caption
