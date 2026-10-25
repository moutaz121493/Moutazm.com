// Page labels and helpers: en (default), de, ar. The CV and page text itself lives in cv.js.
// Anything marked TODO(user) is waiting for Moutaz and must not be guessed.
// German and Arabic are drafts: Moutaz reviews them before going live.

import cv from "./cv.js";

export const LANGS = ["en", "de", "ar"];
export const DIR = { en: "ltr", de: "ltr", ar: "rtl" };
export const LANG_NAME = { en: "EN", de: "DE", ar: "ع" };

export const LINKS = cv.links;

// Impressum (§ 5 DDG). Shown in German on every language, as the law expects.
export const LEGAL = {
  name: "Moutaz Mohammad",
  street: "Feldstr. 26",
  city: "38302 Wolfenbüttel",
  country: "Deutschland",
  phone: "+49 176 57957461",
};

/** Path for a page in a language, always with a trailing slash: path("de", "/cv") -> "/de/cv/" */
export const path = (lang, p = "/") => {
  const q = p.endsWith("/") ? p : p + "/";
  return lang === "en" ? q : `/${lang}${q}`;
};

export const ui = {
  en: {
    nav: { about: "About", work: "Experience", projects: "Projects", now: "Now", skills: "Skills", contact: "Contact", cv: "CV" },
    hero: {
      cta: { cv: "View CV", projects: "Projects", contact: "Contact" },
      lab: "the workbench", local: "Local time",
    },
    about: { h: "About" },
    work: { h: "Experience", present: "today" },
    projects: {
      h: "Projects",
      sub: "Things I built in my own time. Status is honest.",
      status: { live: "Live in my home", web: "Live in the browser", progress: "In progress", planned: "Planned" },
      more: "Read more",
      problem: "Problem",
      architecture: "Architecture",
      decisions: "Key decisions",
      learned: "What I learned",
      repo: "Repository",
      repoSoon: "Repository coming soon",
      back: "All projects",
    },
    now: { h: "Now & next" },
    skills: { h: "Skills" },
    beyond: { h: "Beyond work" },
    contact: {
      h: "Contact",
      email: "Email",
    },
    cv: {
      h: "Curriculum vitae",
      download: "Download PDF",
      exp: "Experience",
      edu: "Education",
      skills: "Skills",
      langs: "Languages",
      certs: "Certifications",
      inProgress: "in progress",
      planned: "next goal",
      projects: "Selected projects",
    },
    footer: { privacy: "Privacy", imprint: "Imprint", built: "Static site · no cookies · no tracking" },
    theme: "Toggle light / dark theme",
    langSwitch: "Language",
    skip: "Skip to content",
  },
  de: {
    nav: { about: "Über mich", work: "Erfahrung", projects: "Projekte", now: "Aktuell", skills: "Skills", contact: "Kontakt", cv: "Lebenslauf" },
    hero: {
      cta: { cv: "Lebenslauf", projects: "Projekte", contact: "Kontakt" },
      lab: "die Werkbank", local: "Ortszeit",
    },
    about: { h: "Über mich" },
    work: { h: "Berufserfahrung", present: "heute" },
    projects: {
      h: "Projekte",
      sub: "Eigene Projekte aus meiner Freizeit. Der Status ist ehrlich.",
      status: { live: "Läuft bei mir zu Hause", web: "Läuft im Browser", progress: "In Arbeit", planned: "Geplant" },
      more: "Mehr lesen",
      problem: "Problem",
      architecture: "Architektur",
      decisions: "Wichtige Entscheidungen",
      learned: "Was ich gelernt habe",
      repo: "Repository",
      repoSoon: "Repository folgt",
      back: "Alle Projekte",
    },
    now: { h: "Aktuell & als Nächstes" },
    skills: { h: "Skills" },
    beyond: { h: "Abseits der Arbeit" },
    contact: {
      h: "Kontakt",
      email: "E-Mail",
    },
    cv: {
      h: "Lebenslauf",
      download: "PDF herunterladen",
      exp: "Berufserfahrung",
      edu: "Ausbildung",
      skills: "Kenntnisse",
      langs: "Sprachen",
      certs: "Zertifikate",
      inProgress: "laufend",
      planned: "nächstes Ziel",
      projects: "Ausgewählte Projekte",
    },
    footer: { privacy: "Datenschutz", imprint: "Impressum", built: "Statische Seite · keine Cookies · kein Tracking" },
    theme: "Helles / dunkles Design umschalten",
    langSwitch: "Sprache",
    skip: "Zum Inhalt springen",
  },
  ar: {
    nav: { about: "عنّي", work: "الخبرة", projects: "المشاريع", now: "الآن", skills: "المهارات", contact: "تواصل", cv: "السيرة الذاتية" },
    hero: {
      cta: { cv: "السيرة الذاتية", projects: "المشاريع", contact: "تواصل" },
      lab: "طاولة العمل", local: "التوقيت المحلي",
    },
    about: { h: "عنّي" },
    work: { h: "الخبرة المهنية", present: "حتى الآن" },
    projects: {
      h: "المشاريع",
      sub: "مشاريع بنيتها في وقتي الخاص. والحالة مكتوبة بصدق.",
      status: { live: "يعمل في بيتي", web: "يعمل في المتصفح", progress: "قيد العمل", planned: "مخطط له" },
      more: "التفاصيل",
      problem: "المشكلة",
      architecture: "البنية",
      decisions: "قرارات أساسية",
      learned: "ماذا تعلّمت",
      repo: "المستودع",
      repoSoon: "المستودع قريباً",
      back: "كل المشاريع",
    },
    now: { h: "الآن وما بعده" },
    skills: { h: "المهارات" },
    beyond: { h: "خارج العمل" },
    contact: {
      h: "تواصل",
      email: "البريد",
    },
    cv: {
      h: "السيرة الذاتية",
      download: "تنزيل PDF",
      exp: "الخبرة المهنية",
      edu: "التعليم",
      skills: "المهارات",
      langs: "اللغات",
      certs: "الشهادات",
      inProgress: "قيد الدراسة",
      planned: "الهدف التالي",
      projects: "مشاريع مختارة",
    },
    footer: { privacy: "الخصوصية", imprint: "البيانات القانونية", built: "موقع ثابت · بلا كوكيز · بلا تتبّع" },
    theme: "تبديل الوضع الفاتح / الداكن",
    langSwitch: "اللغة",
    skip: "انتقل إلى المحتوى",
  },
};

// ---------- editable content (cv.js) in the shapes the pages use ----------

const byLang = (list) => Object.fromEntries(LANGS.map((l) => [l, list.map((x) => x[l])]));
const blank = (t) => !t || LANGS.every((l) => !String(t[l] ?? "").trim());

for (const l of LANGS) {
  Object.assign(ui[l].hero, {
    kicker: cv.hero.kicker[l], title: cv.hero.title[l], line: cv.hero.line[l], keys: cv.hero.keys.map((k) => k[l]),
  });
  Object.assign(ui[l].about, { lead: cv.about.lead[l], body: cv.about.body.map((b) => b[l]) });
  ui[l].contact.body = cv.contact.body[l];
}

export const experience = cv.experience.map((e) => ({ ...e, to: e.to || null, points: byLang(e.points) }));
export const education = cv.education.map((e) => ({ ...e, note: blank(e.note) ? null : e.note }));
export const languages = cv.languages;
export const certifications = cv.certifications.map((c) => ({ name: c.name, done: c.done, ...(c.target ? { target: true } : {}) }));
const perLang = (f) => Object.fromEntries(LANGS.map((l) => [l, f(l)]));
export const skills = perLang((l) => cv.skills.map((g) => ({ h: g.h[l], items: g.items.map((x) => x[l]) })));
export const now = perLang((l) => cv.now.map((n) => ({ k: n.k[l], v: n.v[l] })));
export const hobbies = perLang((l) => cv.hobbies.map((h) => ({ icon: h.icon, h: h.h[l], v: h.v[l] })));
