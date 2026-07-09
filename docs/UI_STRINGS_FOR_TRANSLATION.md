# UI strings for Kinyarwanda translation

Every sentence currently shown in the SRH frontend UI. Please fill the **"Your Kinyarwanda"**
column (or reply with corrections keyed by the `key`/row). Notes:

- **Current Kinyarwanda** shows what the app displays today — some are earlier drafts that need a native-speaker check.
- ⚠️ **MISSING** = there is no Kinyarwanda yet; the app currently shows the English text in RW mode. These are the priority.
- 🔤 **Hardcoded** (last two sections) = strings not yet wired to the translation system; once you give the Kinyarwanda I'll move them into the dictionary so they switch with the language toggle.
- Screen-reader-only labels are marked **(SR)** — they're read aloud to blind users, so they matter even though they aren't visible.
- `114` (hotline number) and the language-toggle label are intentionally left as-is.

Legend for status: ✅ has a draft to verify · ⚠️ missing, needs translation · 🔤 hardcoded (needs translation + wiring)

---

## 1. Header & navigation

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| app_name | SRH Education Platform | Urubuga rw’Uburezi ku Buzima bw’Imyororokere  | |
| tagline | Ask any question about your health — privately and without judgment. | Baza ikibazo icyo ari cyo cyose ku buzima bwawe mu ibanga. | |
| nav_home (SR) | Home | Ahabanza | |
| lang_toggle | *(shows the other language name — leave as "English" / "Kinyarwanda")* | English | — |
| skip_to_content (SR) | Skip to main content | Simbukira ku bikubiye mu rupapuro | |

## 2. Landing / front page

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| landing_title | Real answers about your body, your health, your choices. | Menya ukuri ku mubiri wawe, ubuzima bwawe n’amahitamo yawe.  | |
| landing_who | For young people and persons with disabilities in Rwanda — in Kinyarwanda or English. | Ku rubyiruko n'abafite ubumuga mu Rwanda — mu Kinyarwanda cyangwa Icyongereza. | |
| landing_reassure  | Private and anonymous. This chat shares information, not emergency care — for urgent help call 114. | Amakuru yawe aragirwa ibanga kandi ntusabwa kugaragaza umwirondoro wawe. Iki kiganiro kigufasha kubona amakuru, ariko ntigisimbura ubufasha bwihutirwa — niba ukeneye ubufasha bwihutirwa hamagara 114.  | |
| landing_cta_start | Start a conversation | Tangira ikiganiro | |
| landing_learn_more | How it works, languages, accessibility & safety | Uko ikora, indimi, uburyo ikoreshwa n’abantu bose ndetse n’umutekano  | |
| landing_hero_typed_label (SR) | Example questions you can ask | Ingero z'ibibazo washobora kubaza | |
| landing_hero_q1 | Is this normal? | Ese ni ibisanzwe? | |
| landing_hero_q2 | How do I stay safe? | Nakwirinda nte? | |
| landing_hero_q3 | Who can I talk to? | Nakwiyambaza nde? | |

### 2a. Landing → "Learn more" (collapsible)

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| landing_how_title | How to use it | Uko uyikoresha | |
| landing_how_1 | Tap "Start a conversation" and confirm that you are 13 or older and that your chat is anonymous. | Kanda "Tangira ikiganiro" wemeze ko ufite imyaka 13 cyangwa irenga kandi ko ikiganiro cyawe ari ibanga. | |
| landing_how_2 | Type your question — or tap one of the ready-made questions if typing is hard. | Andika ikibazo cyawe cyangwa uhitemo kimwe mu bibazo byateguwe niba udashoboye. | |
| landing_how_3 | Switch between Kinyarwanda and English any time using the language button. | Hindura hagati y'Ikinyarwanda n'Icyongereza igihe cyose ukoresheje buto y'ururimi. | |
| landing_how_4 | Open the accessibility menu to make text larger, turn on high contrast, or have answers read aloud. | Fungura igenamiterere ry'ubushobozi bwo kugera kugira ngo unini inyandiko, ukoreshe amabara atandukanye cyane, cyangwa umve ibisubizo bisomwa mu ijwi. | |
| landing_lang_title | Your language | Ururimi rwawe | |
| landing_lang_body | Switch between Kinyarwanda and English at any time using the language button at the top of the screen. | Hindura hagati y'Ikinyarwanda n'Icyongereza igihe cyose ukoresheje buto y'ururimi iri hejuru y'urupapuro. | |
| landing_access_title | Built to be used by everyone | Yubatswe kugira ngo ikoreshwe na bose | |
| landing_access_body ⚠️ | Read-aloud, larger text, high-contrast colours, and full keyboard support are built in on every screen — including this one. | Gusomerwa n’amajwi, inyandiko nini, amabara agaragara neza, ndetse no gukoresha clavier gusa byashyizwe muri buri rupapuro — harimo n’uru. | |
| landing_private_title | Private and anonymous | Ibanga kandi nta zina | |
| landing_private_body ⚠️ | We never ask for your name and we don't store who you are. Your questions are yours alone, and you can stop any time. | Ntabwo tugusaba izina ryawe kandi ntitubika amakuru agaragaza uwo uri we. Ibibazo ubaza ni ibyawe gusa, kandi ushobora guhagarika igihe icyo ari cyo cyose. | |
| landing_safety_title | If it's an emergency | Niba ari ibyihutirwa | |
| landing_safety_body ⚠️ | This chatbot shares information — it is not a doctor or a counsellor. For emergencies or urgent help it will point you to real services, such as Rwanda's health line 114, instead of trying to answer. | Iyi chatbot itanga amakuru gusa — ntabwo ari umuganga cyangwa umujyanama. Mu gihe cy’ibyihutirwa cyangwa ukeneye ubufasha bwihuse, izakuyobora kuri serivisi zifatika, nka telefoni y’ubuzima yo mu Rwanda 114, aho kugerageza gutanga igisubizo. | |


## 3. Consent / onboarding screen

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| consent_title (SR) | Welcome — let's set up a safe space | Murakaza neza — reka dutegure ahantu hatekanye | |
| consent_body | This is a private, anonymous space to learn about sexual and reproductive health. We don't ask for your name and we don't store who you are. You can stop at any time. | Aha ni ahantu h'ibanga kandi h'ibanga rikomeye ho kwiga ku buzima bw'imyororokere n'imibonano mpuzabitsina. Ntitukubaza izina ryawe kandi ntitubika uwo uri we. Ushobora guhagarara igihe cyose ushaka. | |
| consent_age_confirm | I am 13 years or older | Mfite imyaka 13 cyangwa irenga | |
| consent_anonymous_confirm | I understand my questions are anonymous | Numva ko ibibazo byanjye bidasangirwa n'undi (ni ibanga) | |
| consent_confirm | Continue | Komeza | |
| chat_back_home | Back to home | Subira ahabanza | |

## 4. Chat page

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| chat_heading (SR) | Ask your health questions | Baza ibibazo ufite k'ubuzima bw’imyorokere | |
| chat_placeholder | Type your question here... | Andika ikibazo cyawe hano... | |
| chat_send | Send | Ohereza | |
| chat_loading | Preparing a thoughtful answer... | Turimo gutegura cyiza... | |
| chat_referral_label (SR) | Where to get help | Aho wakura ubufasha | |
| tts_play | Listen to this answer | Umva iki gisubizo | |
| tts_stop | Stop listening | Hagarika amajwi| |

## 5. Suggested-questions panel

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| questions_title | Suggested questions | Ibibazo byatanzwe | |

### 5a. Category labels (predefined-questions data)

| id | English | Your Kinyarwanda |
|---|---|---|
| contraception | Contraception | |
| sti_hiv | STIs & HIV | |
| puberty_body | Puberty & Body | |
| pregnancy | Pregnancy | |
| gbv_consent | GBV & Consent | |
| disability_srh | Disability & SRH | |

### 5b. Predefined questions (24) — shown as tappable cards

Ubwunganizi bwo kwirinda gusama (Contraception)
What types of contraception are available to me?
 → Ni ubuhe buryo bwo kuboneza urubyaro nshobora gukoresha?
How does a condom protect against pregnancy?
 → Agakingirizo karinda gute gusama?
What is emergency contraception and when do I use it?
 → Uburyo bwo kwirinda gusama bwihutirwa ni ubuhe kandi bukoresha ryari?
Can I use contraception if I have a disability?
 → Ese nshobora gukoresha uburyo bwo kuboneza urubyaro niba mfite ubumuga?

Indwara zandurira mu mibonano mpuzabitsina na SIDA (STIs & HIV)
How is HIV spread and how can I protect myself?
 → SIDA yandura ite kandi nakwirinda nte?
What are the signs of a sexually transmitted infection?
 → Ni ibihe bimenyetso by’indwara zandurira mu mibonano mpuzabitsina?
Where can I get tested for HIV in Rwanda?
 → Ni he nshobora kwipimisha SIDA mu Rwanda?
Can someone with HIV live a healthy life?
 → Ese umuntu ufite SIDA ashobora kubaho ubuzima buzira umuze?

Ubwangavu n’imihindagurikire y’umubiri (Puberty & Body)
What body changes happen during puberty?
 → Ni izihe mpinduka zibera mu mubiri mu gihe cy’ubwangavu?
Is it normal to have irregular periods?
 → Ese ni ibisanzwe kugira imihango idakurikiza gahunda ihoraho?
What is a wet dream and is it normal?
 → Inzozi zitera gusohora intanga ni iki kandi ese ni ibisanzwe?
Why do I have discharge and is that normal?
 → Kuki ngira amatembabuzi ava mu myanya y’ibanga kandi ese ni ibisanzwe?

Gutwita (Pregnancy)
What are the early signs of pregnancy?
 → Ni ibihe bimenyetso bya mbere byo gutwita?
What is antenatal care and why does it matter?
 → Kwipimisha no gukurikiranwa kwa muganga mu gihe cyo gutwita ni iki kandi kuki ari ingenzi?
What should I do if I think I am pregnant?
 → Nakora iki niba nkeka ko ntwite?
How can I prevent an unplanned pregnancy?
 → Nakwirinda nte gutwita ntateganyije?

Ihohoterwa rishingiye ku gitsina n’ubwumvikane (GBV & Consent)
What does consent mean in a relationship?
 → Kwemeranya mu mibanire bisobanura iki?
What is gender-based violence?
 → Ihohoterwa rishingiye ku gitsina ni iki?
What should I do if someone touches me without permission?
 → Nakora iki niba umuntu ankozeho atabinsabyeho uruhushya?
Where can I report abuse or violence in Rwanda?
 → Ni he nshobora gutanga amakuru y’ihohoterwa cyangwa gukorerwa nabi mu Rwanda?

Ubumuga n’ubuzima bw’imyororokere n’imibonano mpuzabitsina (Disability & SRH)
Do people with disabilities have the same right to sexual health information?
 → Ese abantu bafite ubumuga bafite uburenganzira bungana bwo kubona amakuru ajyanye n’ubuzima bw’imyororokere n’imibonano mpuzabitsina?
How can I access SRH services if I use a wheelchair?
 → Nakoresha nte serivisi z’ubuzima bw’imyororokere n’imibonano mpuzabitsina niba nkoresha igare ry’abamugaye?
Are there SRH resources for people who are deaf or hard of hearing?
 → Ese hari amakuru cyangwa serivisi z’ubuzima bw’imyororokere n’imibonano mpuzabitsina zigenewe abantu batumva cyangwa bumva nabi?
Who can I talk to about my sexual health as a person with a disability?
 → Ni nde nshobora kuganiriza ku buzima bwanjye bw’imyororokere n’imibonano mpuzabitsina nk’umuntu ufite ubumuga?


> _Please provide Kinyarwanda for each of the 24 above (number them in your reply)._

## 6. Accessibility settings

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| settings_open (SR) | Open accessibility settings | Fungura igenamiterere ry'ubushobozi bwo kugera | |
| settings_title | Accessibility settings | Igenamiterere ry'ubushobozi bwo kugera | |
| settings_close (SR) | Close settings | Funga igenamiterere | |
| settings_font_size | Text size | Ingano y'inyandiko | |
| settings_font_default | Default | Isanzwe | |
| settings_font_large | Large | Nini | |
| settings_font_xl | Extra large | Nini cyane | |
| settings_contrast | High contrast | Itandukaniro rikomeye ry'amabara | |
| settings_simplified | Simple language | Imvugo yoroshye | |
| read_page_aloud | Read this page aloud | Soma uru rupapuro mu ijwi | |
| read_page_stop | Stop reading | Hagarika gusoma | |

## 7. Status & error messages

| key | English | Current Kinyarwanda | Your Kinyarwanda |
|---|---|---|---|
| offline_banner | Service temporarily unavailable. Please try again later. | Serivisi ntiraboneka by'agateganyo. Wongera ugerageze nyuma. | |
| health_hotline_label | Rwanda Health Hotline | Telefoni y'ubufasha bw'ubuzima mu Rwanda | |
| health_hotline_number | 114 | 114 | — |
| assessment_placeholder | Assessment module coming soon. | Igice cy'isuzuma kiraza vuba. | |

---

## 8. 🔤 Hardcoded strings (need translation + code wiring)

These are shown today in **English only in both languages** because they aren't in the dictionary yet.
Once you translate them, I'll move them into the i18n files so they follow the language toggle.

### Visible text

| where | English | Your Kinyarwanda |
|---|---|---|
| Consent screen heading | Your health questions, answered safely. | |
| Chat empty state | Tap a question below or type your own. | |
| Suggested-questions toggle (mobile) | Browse Questions | |

### Screen-reader-only labels (SR) — read aloud to blind users

| where | English | Your Kinyarwanda |
|---|---|---|
| Consent illustration (alt) | Two young people talking openly about health | |
| Suggested-questions tabs (group label) | Question categories | |
| Each question card (action) | Ask: _{question}_ | *(translate the prefix "Ask:")* |
| Each question card (speaker) | Read aloud and ask: _{question}_ | *(translate the prefix "Read aloud and ask:")* |
| Assessment logo (alt) | SRH Education Platform logo | |

---

## Not included (legacy / not shown)

These keys still exist in the files but are **not displayed** in the current UI (left over from the
landing-page trim), so they don't need translating unless we re-introduce them:
`nav_start_chat`, `chat_fallback_message` (the fallback text now comes from the backend),
`landing_eyebrow`, `landing_subtitle`, `landing_cta_how`, `landing_what_title`, `landing_what_body`,
`landing_help_title`, `landing_help_1`–`landing_help_5`, `landing_footer_note`.


