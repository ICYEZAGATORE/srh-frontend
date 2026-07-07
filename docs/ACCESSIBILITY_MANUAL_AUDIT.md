# Manual Accessibility Audit Checklist — SRH Frontend

**Purpose:** Automated tests (`npm test`, jest-axe) catch programmatic ARIA/contrast
issues but **cannot** verify the real screen-reader experience. This checklist is
for a **human tester** to execute with NVDA (desktop) and TalkBack (Android), as
required by proposal §3.9. It cannot be run by CI or by an AI agent.

**Target standard:** WCAG 2.1 Level AA.
**Audiences:** teenagers (13–19) and persons with disabilities in Rwanda; bilingual
(Kinyarwanda / English); lower-end Android; possibly low bandwidth.

---

## Test environments

| Tool | Platform | How to get it |
|---|---|---|
| **NVDA** | Windows desktop, Firefox + Chrome | Free — nvaccess.org |
| **TalkBack** | Android phone (test on a low/mid-range device, e.g. 2–3 GB RAM) | Built in: Settings → Accessibility → TalkBack |
| **Keyboard only** | Desktop, no mouse | Unplug/ignore mouse |
| **Browser zoom** | 200% and 400% | Ctrl/Cmd +, and mobile pinch-zoom |

Record: device, OS version, browser + version, screen-reader version, language (EN/RW).

### Universal keystrokes
- **NVDA:** `Tab`/`Shift+Tab` (focusables), `H` (headings), `D` (landmarks), `B` (buttons),
  `F` (form fields), `NVDA+Space` (forms/browse mode), `Insert+F7` (elements list).
- **TalkBack:** swipe right/left (next/previous), double-tap (activate), swipe-up-then-right
  (reading controls / headings navigation), two-finger swipe (scroll).

---

## Screen 1 — Onboarding / Consent (`ConsentScreen`)

### NVDA (desktop)
- [ ] On load, focus/reading order is logical: hero illustration → heading → subtext → the two checkboxes → Continue.
- [ ] The hero illustration is announced as an image with the name **"Two young people talking openly about health"** (it is meaningful, so it must be described — not skipped).
- [ ] Each checkbox announces its label ("I am 13 years or older" / "…anonymous") **and** its checked/unchecked state; state updates aloud when toggled with `Space`.
- [ ] The **Continue** button announces as **disabled** until both checkboxes are checked, then announces as enabled.
- [ ] Activating Continue with `Enter`/`Space` proceeds (does not require a mouse).
- [ ] Switch language (if reachable here) — confirm Kinyarwanda strings are read (note: NVDA may lack a Kinyarwanda voice; see "Language & pronunciation" below).

### TalkBack (Android)
- [ ] Swiping through reaches every element once, in order; nothing is skipped or double-announced.
- [ ] Checkboxes expose state ("checked"/"not checked") and the custom teal check box is operable by double-tap (the native input is the accessible target, not the decorative box).
- [ ] Continue announces "disabled" / "dimmed" until both are checked.
- [ ] Tap targets are ≥ 48×48 dp (checkbox rows and Continue are large — confirm they're easy to hit one-handed).

---

## Screen 2 — Chat (`Home` → `Header`, `ChatWindow`, `InputBar`, `QuestionPanel`)

### NVDA (desktop)
- [ ] Landmarks present and sensible: `banner` (header), `main` chat region, form. Use `D` to jump.
- [ ] Header: app name is read; **language toggle** button announces its action and the language it switches TO; **settings** button announces "Open accessibility settings" and that it opens a dialog.
- [ ] Empty state: the welcome illustration is **not** announced (decorative / `aria-hidden`), but the app name, tagline and "Tap a question below…" text ARE read.
- [ ] Chat input has an accessible name (placeholder/label); typing + `Enter` submits.
- [ ] After sending, the new user message and the AI reply are **announced automatically** via the `aria-live="polite"` region — without moving focus.
- [ ] The "typing" indicator is announced as busy/loading (status), not as decorative dots.
- [ ] **Browse Questions** toggle announces expanded/collapsed state.
- [ ] Category **tabs**: announced as tabs with selected state. (Known limitation: arrow-key roving between tabs is not yet implemented — verify Tab still reaches each; log if this blocks a user.)
- [ ] Each question **card** announces "Ask: <question>"; the **speaker** button announces "Read aloud and ask: <question>" — the two are distinct, adjacent controls.
- [ ] Read-aloud (TTS) button on each AI answer announces "Listen to this answer" / "Stop listening" and toggles.

### TalkBack (Android)
- [ ] New messages are announced via live region without stealing focus.
- [ ] The single-column question cards are large, comfortable tap targets; the speaker button is separately focusable and does not require precise aiming.
- [ ] Horizontal category pill row is swipe-navigable and scrolls into view when a pill gains focus.
- [ ] TTS playback works and can be stopped; confirm it does not conflict with TalkBack's own speech (pause TalkBack or confirm ducking).

---

## Screen 3 — Accessibility Settings (`SettingsOverlay`, Radix Dialog)

### NVDA (desktop)
- [ ] Opening settings moves focus **into** the dialog; it is announced as a dialog with the name "Accessibility settings".
- [ ] Focus is **trapped**: Tab cycles only within the dialog; it cannot reach the chat behind it.
- [ ] Background content is inert (announced as hidden) while the dialog is open.
- [ ] `Esc` closes the dialog and **returns focus to the settings button** that opened it.
- [ ] **Text size**: three buttons announce pressed/not-pressed; activating changes the app text size (verify visually + that the change persists after reload).
- [ ] **High contrast** switch announces on/off; toggling flips the entire UI to black/white/yellow and **survives reload**.
- [ ] **Simplified language** switch announces on/off.
- [ ] In high-contrast mode, re-run Screens 1–2 quickly: confirm no text becomes invisible (esp. category pills, idle speaker buttons, inactive text-size buttons — these were a known risk).

### TalkBack (Android)
- [ ] The bottom-sheet dialog is announced; swiping stays within it (focus trap).
- [ ] Switches expose on/off state and are operable by double-tap.
- [ ] Closing returns focus sensibly.

---

## Cross-cutting checks (all screens)

- [ ] **Zoom / reflow:** at 200% and 400% browser zoom (and Android font-scale "largest"), no content is clipped, no horizontal scroll appears on a 375 px viewport, tap targets don't overlap.
- [ ] **Colour independence:** every state (selected tab, checked box, error/fallback) is distinguishable without colour (icon, text, shape, or state).
- [ ] **Focus visibility:** every focusable element shows a clear focus ring (accent/yellow) in both normal and high-contrast modes.
- [ ] **Contrast spot-check:** with a contrast checker, verify body text, buttons, and the coral CTA/send/offline-banner meet ≥ 4.5:1 (accent is `#C2461F` on white text = 5.0:1).
- [ ] **Reduced motion:** enable OS "reduce motion" — confirm the typing dots and transitions are suppressed/minimised.

## Language & pronunciation (Kinyarwanda) — known gap
- [ ] Set language to Kinyarwanda and read each screen. **Expectation:** desktop NVDA and Android TTS engines generally have **no Kinyarwanda voice**, so Kinyarwanda text will be mispronounced by an English/other voice. **This is a known limitation** — log the severity per screen. Real Kinyarwanda speech depends on the accessibility TTS microservice + a trained Kinyarwanda voice (see `accessibility-service/README.md`), which does not exist yet.

---

## Reporting template (per issue)
```
Screen:            (Onboarding / Chat / Settings / cross-cutting)
Tool + version:    (NVDA x.y / TalkBack, Android z)
Language:          (EN / RW)
WCAG criterion:    (e.g. 1.3.1, 2.4.3, 4.1.2)
Severity:          (blocker / major / minor)
What happened:
Expected:
Steps to reproduce:
Screenshot / recording:
```

> When this checklist has been executed on **both** NVDA and TalkBack and blockers
> are resolved, mark the "Manual NVDA/Android audit" gap ✅. Until then it stays 🟡.
