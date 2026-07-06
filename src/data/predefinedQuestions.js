// Predefined question bank for the PWD-accessibility QuestionPanel.
// English-only for now; structured so Kinyarwanda variants can be added later
// (e.g. a `questions_rw` array per category) without touching the component.
export const QUESTION_CATEGORIES = [
  {
    id: 'contraception',
    label: 'Contraception',
    questions: [
      'What types of contraception are available to me?',
      'How does a condom protect against pregnancy?',
      'What is emergency contraception and when do I use it?',
      'Can I use contraception if I have a disability?',
    ],
  },
  {
    id: 'sti_hiv',
    label: 'STIs & HIV',
    questions: [
      'How is HIV spread and how can I protect myself?',
      'What are the signs of a sexually transmitted infection?',
      'Where can I get tested for HIV in Rwanda?',
      'Can someone with HIV live a healthy life?',
    ],
  },
  {
    id: 'puberty_body',
    label: 'Puberty & Body',
    questions: [
      'What body changes happen during puberty?',
      'Is it normal to have irregular periods?',
      'What is a wet dream and is it normal?',
      'Why do I have discharge and is that normal?',
    ],
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy',
    questions: [
      'What are the early signs of pregnancy?',
      'What is antenatal care and why does it matter?',
      'What should I do if I think I am pregnant?',
      'How can I prevent an unplanned pregnancy?',
    ],
  },
  {
    id: 'gbv_consent',
    label: 'GBV & Consent',
    questions: [
      'What does consent mean in a relationship?',
      'What is gender-based violence?',
      'What should I do if someone touches me without permission?',
      'Where can I report abuse or violence in Rwanda?',
    ],
  },
  {
    id: 'disability_srh',
    label: 'Disability & SRH',
    questions: [
      'Do people with disabilities have the same right to sexual health information?',
      'How can I access SRH services if I use a wheelchair?',
      'Are there SRH resources for people who are deaf or hard of hearing?',
      'Who can I talk to about my sexual health as a person with a disability?',
    ],
  },
]
