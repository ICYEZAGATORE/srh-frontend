"""
Rule-based text simplification (accessibility "simplified language" mode).

This is a REAL, deterministic post-processing transformation — the proposal
(§3.9, Layer 3) requires simplified-language mode to be an explicit, independently
testable and cacheable step, not just an LLM prompt suffix. This module has no
heavy dependencies (pure stdlib) so it is fast, cacheable by (text, lang), and
unit-testable without a model server.

Scope & honesty:
- English: filler removal + complex→simple word substitution + long-sentence
  splitting.
- Kinyarwanda ("rw"): STRUCTURAL simplification only (sentence splitting). We do
  NOT do Kinyarwanda lexical substitution here — doing it safely needs a
  Kinyarwanda-aware resource (see README / Digital Umuganda). Flagged as follow-up.
- This is a strong, testable baseline. It can later be swapped/augmented with an
  LLM- or model-based simplifier behind the same function signature.
"""

from __future__ import annotations
import re

# Conservative, domain-safe substitutions. Kept deliberately small and neutral so
# we never change clinical meaning (e.g. we do NOT rewrite "contraception").
COMPLEX_WORDS: dict[str, str] = {
    "utilize": "use",
    "utilise": "use",
    "approximately": "about",
    "assist": "help",
    "obtain": "get",
    "sufficient": "enough",
    "commence": "start",
    "individual": "person",
    "additional": "more",
    "regarding": "about",
    "however": "but",
    "therefore": "so",
    "purchase": "buy",
    "physician": "doctor",
    "adolescent": "teenager",
    "prior to": "before",
    "in order to": "to",
    "in the event that": "if",
    "a number of": "some",
    "is able to": "can",
    "are able to": "can",
}

FILLER_PHRASES = [
    "it is important to note that",
    "it should be noted that",
    "please be aware that",
    "as a matter of fact",
    "it is worth noting that",
]

_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")
_WORD = re.compile(r"[A-Za-zÀ-ɏ']+")
# Points at which an over-long sentence can be broken into two.
_CLAUSE_BREAKS = [", and ", ", but ", ", so ", "; ", " because ", " which means "]


def _match_case(replacement: str, original: str) -> str:
    if original[:1].isupper():
        return replacement[:1].upper() + replacement[1:]
    return replacement


def _remove_fillers(text: str) -> str:
    out = text
    for phrase in FILLER_PHRASES:
        out = re.sub(re.escape(phrase), "", out, flags=re.IGNORECASE)
        out = re.sub(re.escape(phrase[0].upper() + phrase[1:]), "", out)
    # Fix a lowercase sentence start left behind by removing a leading filler.
    out = re.sub(r"(^|[.!?]\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), out)
    return out


def _replace_words(text: str) -> str:
    # Multi-word phrases first (longest key first to avoid partial overlaps).
    for key in sorted(COMPLEX_WORDS, key=len, reverse=True):
        val = COMPLEX_WORDS[key]
        pattern = re.compile(rf"\b{re.escape(key)}\b", flags=re.IGNORECASE)
        text = pattern.sub(lambda m: _match_case(val, m.group(0)), text)
    return text


def _split_long_sentences(text: str, max_words: int) -> str:
    sentences = _SENTENCE_SPLIT.split(text.strip())
    result: list[str] = []
    for sent in sentences:
        if not sent:
            continue
        if len(_WORD.findall(sent)) <= max_words:
            result.append(sent)
            continue
        # Try to break at the first available clause boundary.
        broke = False
        for brk in _CLAUSE_BREAKS:
            idx = sent.lower().find(brk.strip() and brk)
            if idx > 0:
                left = sent[:idx].rstrip(" ,;")
                right = sent[idx + len(brk):].lstrip()
                if left and right:
                    left = left.rstrip(".") + "."
                    right = right[:1].upper() + right[1:]
                    result.append(left)
                    result.append(right)
                    broke = True
                    break
        if not broke:
            result.append(sent)
    return " ".join(result)


def _normalize_ws(text: str) -> str:
    text = re.sub(r"\s+([.,!?;:])", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def simplify_text(text: str, lang: str = "en", max_words: int = 16) -> str:
    """Return a simplified version of `text`. Deterministic and cache-friendly."""
    if not text or not text.strip():
        return text
    if lang == "rw":
        # Structural only — safe for Kinyarwanda without a lexical resource.
        return _normalize_ws(_split_long_sentences(text, max_words))
    out = _remove_fillers(text)
    out = _replace_words(out)
    out = _split_long_sentences(out, max_words)
    return _normalize_ws(out)


def readability(text: str) -> dict:
    """Lightweight readability proxy used by the evaluation tests."""
    sentences = [s for s in _SENTENCE_SPLIT.split(text.strip()) if s.strip()]
    words = _WORD.findall(text)
    n_sent = max(len(sentences), 1)
    long_words = [w for w in words if len(w) >= 10]
    complex_hits = [w for w in words if w.lower() in COMPLEX_WORDS]
    return {
        "sentences": len(sentences),
        "words": len(words),
        "avg_sentence_len": round(len(words) / n_sent, 2),
        "long_words": len(long_words),
        "complex_words": len(complex_hits),
    }
