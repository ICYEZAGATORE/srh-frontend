"""
Evaluation + unit tests for the rule-based simplifier.

Runnable with pytest OR directly:  python tests/test_simplify.py
(so it works even before FastAPI/Coqui deps are installed).

These provide the "evidence it actually changes output quality" the proposal
asks for: for each case we assert the simplified text is measurably easier
(shorter sentences and/or fewer complex words) than the original.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.simplify import simplify_text, readability  # noqa: E402

# (input, lang) cases representative of SRH answers.
CASES = [
    (
        "It is important to note that adolescents are able to obtain contraception "
        "at a health facility, and they should utilize a method that is sufficient "
        "for their needs, however they must consult a physician prior to commencing.",
        "en",
    ),
    (
        "Approximately half of individuals will experience additional symptoms, "
        "therefore it is worth noting that you should assist them regarding testing.",
        "en",
    ),
]


def test_simplify_reduces_complexity():
    for text, lang in CASES:
        simple = simplify_text(text, lang)
        before = readability(text)
        after = readability(simple)
        # Shorter average sentence length AND no more complex words than before.
        assert after["avg_sentence_len"] <= before["avg_sentence_len"], (before, after)
        assert after["complex_words"] <= before["complex_words"]
        # At least one dimension strictly improved (proves it changed the output).
        assert (
            after["avg_sentence_len"] < before["avg_sentence_len"]
            or after["complex_words"] < before["complex_words"]
        ), f"no measurable improvement:\n{text}\n-> {simple}"


def test_preserves_clinical_terms():
    # We must NOT rewrite domain-critical vocabulary.
    out = simplify_text("Use contraception and get an HIV test.", "en")
    assert "contraception" in out.lower()
    assert "hiv" in out.lower()


def test_empty_and_whitespace():
    assert simplify_text("", "en") == ""
    assert simplify_text("   ", "en").strip() == ""


def test_kinyarwanda_structural_only():
    # Kinyarwanda: we only split long sentences; we do not substitute words.
    rw = "Iyi ni interuro ndende cyane kandi igomba kugabanywamo ibice bibiri kugira ngo yoroshye."
    out = simplify_text(rw, "rw", max_words=8)
    assert out  # returns something, does not crash
    assert "interuro" in out  # vocabulary untouched


if __name__ == "__main__":
    # Minimal runner so this works without pytest installed.
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"PASS {name}")
    print("\n--- before/after demo ---")
    for text, lang in CASES:
        simple = simplify_text(text, lang)
        print(f"\n[{lang}] BEFORE: {text}\n      {readability(text)}")
        print(f"[{lang}] AFTER : {simple}\n      {readability(simple)}")
