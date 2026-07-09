// Predefined question bank for the PWD-accessibility QuestionPanel.
// Bilingual: each category carries English (`label`, `questions`) and Kinyarwanda
// (`label_rw`, `questions_rw`) variants in the SAME order, so the component can
// pick by the active language and indexing (e.g. badge tints) stays aligned.
export const QUESTION_CATEGORIES = [
  {
    id: 'contraception',
    label: 'Contraception',
    label_rw: 'Ubwunganizi bwo kwirinda gusama',
    questions: [
      'What types of contraception are available to me?',
      'How does a condom protect against pregnancy?',
      'What is emergency contraception and when do I use it?',
      'Can I use contraception if I have a disability?',
    ],
    questions_rw: [
      'Ni ubuhe buryo bwo kuboneza urubyaro nshobora gukoresha?',
      'Agakingirizo karinda gute gusama?',
      'Uburyo bwo kwirinda gusama bwihutirwa ni ubuhe kandi bukoresha ryari?',
      'Ese nshobora gukoresha uburyo bwo kuboneza urubyaro niba mfite ubumuga?',
    ],
  },
  {
    id: 'sti_hiv',
    label: 'STIs & HIV',
    label_rw: 'Indwara zandurira mu mibonano mpuzabitsina na SIDA',
    questions: [
      'How is HIV spread and how can I protect myself?',
      'What are the signs of a sexually transmitted infection?',
      'Where can I get tested for HIV in Rwanda?',
      'Can someone with HIV live a healthy life?',
    ],
    questions_rw: [
      'SIDA yandura ite kandi nakwirinda nte?',
      "Ni ibihe bimenyetso by'indwara zandurira mu mibonano mpuzabitsina?",
      'Ni he nshobora kwipimisha SIDA mu Rwanda?',
      'Ese umuntu ufite SIDA ashobora kubaho ubuzima buzira umuze?',
    ],
  },
  {
    id: 'puberty_body',
    label: 'Puberty & Body',
    label_rw: "Ubwangavu n'imihindagurikire y'umubiri",
    questions: [
      'What body changes happen during puberty?',
      'Is it normal to have irregular periods?',
      'What is a wet dream and is it normal?',
      'Why do I have discharge and is that normal?',
    ],
    questions_rw: [
      "Ni izihe mpinduka zibera mu mubiri mu gihe cy'ubwangavu?",
      'Ese ni ibisanzwe kugira imihango idakurikiza gahunda ihoraho?',
      'Inzozi zitera gusohora intanga ni iki kandi ese ni ibisanzwe?',
      "Kuki ngira amatembabuzi ava mu myanya y'ibanga kandi ese ni ibisanzwe?",
    ],
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy',
    label_rw: 'Gutwita',
    questions: [
      'What are the early signs of pregnancy?',
      'What is antenatal care and why does it matter?',
      'What should I do if I think I am pregnant?',
      'How can I prevent an unplanned pregnancy?',
    ],
    questions_rw: [
      'Ni ibihe bimenyetso bya mbere byo gutwita?',
      'Kwipimisha no gukurikiranwa kwa muganga mu gihe cyo gutwita ni iki kandi kuki ari ingenzi?',
      'Nakora iki niba nkeka ko ntwite?',
      'Nakwirinda nte gutwita ntateganyije?',
    ],
  },
  {
    id: 'gbv_consent',
    label: 'GBV & Consent',
    label_rw: "Ihohoterwa rishingiye ku gitsina n'ubwumvikane",
    questions: [
      'What does consent mean in a relationship?',
      'What is gender-based violence?',
      'What should I do if someone touches me without permission?',
      'Where can I report abuse or violence in Rwanda?',
    ],
    questions_rw: [
      'Kwemeranya mu mibanire bisobanura iki?',
      'Ihohoterwa rishingiye ku gitsina ni iki?',
      'Nakora iki niba umuntu ankozeho atabinsabyeho uruhushya?',
      "Ni he nshobora gutanga amakuru y'ihohoterwa cyangwa gukorerwa nabi mu Rwanda?",
    ],
  },
  {
    id: 'disability_srh',
    label: 'Disability & SRH',
    label_rw: "Ubumuga n'ubuzima bw'imyororokere",
    questions: [
      'Do people with disabilities have the same right to sexual health information?',
      'How can I access SRH services if I use a wheelchair?',
      'Are there SRH resources for people who are deaf or hard of hearing?',
      'Who can I talk to about my sexual health as a person with a disability?',
    ],
    questions_rw: [
      "Ese abantu bafite ubumuga bafite uburenganzira bungana bwo kubona amakuru ajyanye n'ubuzima bw'imyororokere n'imibonano mpuzabitsina?",
      "Nakoresha nte serivisi z'ubuzima bw'imyororokere n'imibonano mpuzabitsina niba nkoresha igare ry'abamugaye?",
      "Ese hari amakuru cyangwa serivisi z'ubuzima bw'imyororokere n'imibonano mpuzabitsina zigenewe abantu batumva cyangwa bumva nabi?",
      "Ni nde nshobora kuganiriza ku buzima bwanjye bw'imyororokere n'imibonano mpuzabitsina nk'umuntu ufite ubumuga?",
    ],
  },
]
