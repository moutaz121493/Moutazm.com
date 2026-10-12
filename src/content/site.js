// All page text in one place: en (default), de, ar.
// Anything marked TODO(user) is waiting for Moutaz and must not be guessed.
// German and Arabic are drafts: Moutaz reviews them before going live.

export const LANGS = ["en", "de", "ar"];
export const DIR = { en: "ltr", de: "ltr", ar: "rtl" };
export const LANG_NAME = { en: "EN", de: "DE", ar: "ع" };

export const LINKS = {
  email: "moutaz@moutazm.com",
  linkedin: "https://www.linkedin.com/in/moutaz-mohammad-728356347/",
  github: "https://github.com/moutaz121493",
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
      kicker: "Hamburg, Germany",
      title: "Embedded engineer building intelligent systems",
      line: "from CAN bits to RAG pipelines.",
      keys: ["Automotive networks", "Linux & infrastructure", "Applied AI"],
      cta: { cv: "View CV", projects: "Projects", contact: "Contact" },
    },
    about: {
      h: "About",
      lead: "I like to understand systems from the inside, and then make them run themselves.",
      body: [
        "I studied communications and electronics engineering and moved into the world of in-vehicle networks: CAN, CAN FD and the controllers and drivers underneath them. Since 2022 I test, debug and bring up these networks at a specialised test house in Germany.",
        "In my own time I built a small self-hosted infrastructure on a Raspberry Pi: zero-trust access, encrypted 3-2-1 backups with restore tests, monitoring, and LLM-powered automation that files my paperwork and diagnoses outages on its own.",
        "That is where I am heading: AI engineering, with the discipline of embedded work behind it. Measured, secure, and built to keep running.",
      ],
    },
    work: { h: "Experience", present: "today" },
    projects: {
      h: "Projects",
      sub: "Things I built in my own time. Status is honest.",
      status: { live: "Live in my home", progress: "In progress", planned: "Planned" },
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
      body: "Open to conversations about embedded, networking and applied AI roles in Germany.",
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
    footer: { privacy: "Privacy", built: "Static site · no cookies · no tracking" },
    theme: "Toggle light / dark theme",
    langSwitch: "Language",
    skip: "Skip to content",
  },
  de: {
    nav: { about: "Über mich", work: "Erfahrung", projects: "Projekte", now: "Aktuell", skills: "Skills", contact: "Kontakt", cv: "Lebenslauf" },
    hero: {
      kicker: "Hamburg, Deutschland",
      title: "Embedded-Ingenieur, der intelligente Systeme baut",
      line: "von CAN-Bits bis zu RAG-Pipelines.",
      keys: ["Automotive-Netzwerke", "Linux & Infrastruktur", "Angewandte KI"],
      cta: { cv: "Lebenslauf", projects: "Projekte", contact: "Kontakt" },
    },
    about: {
      h: "Über mich",
      lead: "Ich will Systeme von innen verstehen – und sie dann selbstständig laufen lassen.",
      body: [
        "Ich habe Nachrichtentechnik und Elektronik studiert und bin in die Welt der Fahrzeugnetzwerke gewechselt: CAN, CAN FD und die Controller und Treiber darunter. Seit 2022 teste, debugge und bringe ich diese Netzwerke bei einem spezialisierten Prüfhaus in Deutschland in Betrieb.",
        "In meiner Freizeit habe ich eine kleine selbst gehostete Infrastruktur auf einem Raspberry Pi aufgebaut: Zero-Trust-Zugriff, verschlüsselte 3-2-1-Backups mit Restore-Tests, Monitoring und LLM-gestützte Automatisierung, die meine Dokumente ablegt und Ausfälle selbst diagnostiziert.",
        "Dahin geht mein Weg: AI Engineering – mit der Disziplin aus der Embedded-Welt. Messbar, sicher und gebaut, um dauerhaft zu laufen.",
      ],
    },
    work: { h: "Berufserfahrung", present: "heute" },
    projects: {
      h: "Projekte",
      sub: "Eigene Projekte aus meiner Freizeit. Der Status ist ehrlich.",
      status: { live: "Läuft bei mir zu Hause", progress: "In Arbeit", planned: "Geplant" },
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
      body: "Offen für Gespräche über Rollen in Embedded, Networking und angewandter KI in Deutschland.",
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
    footer: { privacy: "Datenschutz", built: "Statische Seite · keine Cookies · kein Tracking" },
    theme: "Helles / dunkles Design umschalten",
    langSwitch: "Sprache",
    skip: "Zum Inhalt springen",
  },
  ar: {
    nav: { about: "عنّي", work: "الخبرة", projects: "المشاريع", now: "الآن", skills: "المهارات", contact: "تواصل", cv: "السيرة الذاتية" },
    hero: {
      kicker: "هامبورغ، ألمانيا",
      title: "مهندس أنظمة مدمجة يبني أنظمة ذكية",
      line: "من بِتّات CAN إلى أنظمة RAG.",
      keys: ["شبكات السيارات", "لينكس والبنية التحتية", "الذكاء الاصطناعي التطبيقي"],
      cta: { cv: "السيرة الذاتية", projects: "المشاريع", contact: "تواصل" },
    },
    about: {
      h: "عنّي",
      lead: "أحب أن أفهم الأنظمة من الداخل، ثم أجعلها تعمل وحدها.",
      body: [
        "درست هندسة الاتصالات والإلكترونيات، ثم انتقلت إلى عالم شبكات السيارات: CAN و CAN FD والمتحكمات والتعريفات التي تعمل تحتها. منذ 2022 أختبر هذه الشبكات وأصلح أعطالها وأشغّلها في مختبر اختبار متخصص في ألمانيا.",
        "في وقتي الخاص بنيت بنية تحتية صغيرة على Raspberry Pi: وصول بمبدأ Zero Trust، ونسخ احتياطي مشفّر بنظام 3-2-1 مع اختبارات استرجاع، ومراقبة، وأتمتة بالذكاء الاصطناعي ترتّب أوراقي وتشخّص الأعطال وحدها.",
        "وهذا هو طريقي: هندسة الذكاء الاصطناعي، مع انضباط عالم الأنظمة المدمجة. قابل للقياس، آمن، ومبني ليستمر.",
      ],
    },
    work: { h: "الخبرة المهنية", present: "حتى الآن" },
    projects: {
      h: "المشاريع",
      sub: "مشاريع بنيتها في وقتي الخاص. والحالة مكتوبة بصدق.",
      status: { live: "يعمل في بيتي", progress: "قيد العمل", planned: "مخطط له" },
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
      body: "منفتح على أحاديث حول وظائف الأنظمة المدمجة والشبكات والذكاء الاصطناعي التطبيقي في ألمانيا.",
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
    footer: { privacy: "الخصوصية", built: "موقع ثابت · بلا كوكيز · بلا تتبّع" },
    theme: "تبديل الوضع الفاتح / الداكن",
    langSwitch: "اللغة",
    skip: "انتقل إلى المحتوى",
  },
};

// ---------- experience / education (shared with the CV PDF) ----------

export const experience = [
  {
    org: "C&S group GmbH",
    url: "https://www.cs-group.de/",
    from: "2022",
    to: null,
    role: { en: "Test Engineer", de: "Testingenieur", ar: "مهندس اختبار" },
    place: { en: "Wolfenbüttel, Germany", de: "Wolfenbüttel", ar: "فولفنبوتل، ألمانيا" },
    blurb: {
      en: "Test house and consultancy for automotive in-vehicle networks (ISO/IEC 17025 accredited lab).",
      de: "Prüfhaus und Beratung für Fahrzeugnetzwerke (nach ISO/IEC 17025 akkreditiertes Labor).",
      ar: "مختبر اختبار واستشارات لشبكات السيارات الداخلية (مختبر معتمد وفق ISO/IEC 17025).",
    },
    points: {
      en: [
        "CAN / CAN FD conformance testing of the data link layer (ISO 16845-1).",
        "Bring-up, debugging and fixing of CAN / CAN FD controller drivers on automotive microcontrollers: RX/TX paths, mailbox handling and race conditions, bus-off handling, FD bit timing, transmitter delay compensation, clock configuration.",
        "Python tooling that automates test-result analysis and reporting.",
      ],
      de: [
        "Konformitätstests von CAN / CAN FD auf der Sicherungsschicht (ISO 16845-1).",
        "Inbetriebnahme, Debugging und Fehlerbehebung von CAN-/CAN-FD-Controllertreibern auf Automotive-Mikrocontrollern: RX/TX-Pfade, Mailbox-Handling und Race Conditions, Bus-Off-Handling, FD-Bit-Timing, Transmitter Delay Compensation, Takt-Konfiguration.",
        "Python-Tools zur automatisierten Auswertung von Testergebnissen und Berichterstellung.",
      ],
      ar: [
        "اختبارات المطابقة لـ CAN / CAN FD على طبقة ربط البيانات (ISO 16845-1).",
        "تشغيل وتتبّع أعطال وإصلاح تعريفات متحكمات CAN / CAN FD على متحكمات السيارات: مسارات الإرسال والاستقبال، إدارة الـ mailboxes وحالات التسابق، حالة bus-off، توقيت بِتّات FD، تعويض تأخير المرسِل، وإعداد الساعة.",
        "أدوات بايثون تؤتمت تحليل نتائج الاختبارات وكتابة التقارير.",
      ],
    },
  },
];

export const education = [
  {
    school: "Syrian Virtual University (online)",
    degree: { en: "M.Sc. Web Technologies", de: "M.Sc. Web Technologies", ar: "ماجستير تقانات الويب" },
    when: { en: "expected Jul/Aug 2027", de: "voraussichtlich Jul./Aug. 2027", ar: "التخرج المتوقع تموز/آب 2027" },
    note: {
      en: "Thesis: RAG-based document Q&A, cross-lingual (Arabic/German), hybrid retrieval and evaluation.",
      de: "Masterarbeit: RAG-basiertes Dokumenten-Q&A, sprachübergreifend (Arabisch/Deutsch), hybride Suche und Evaluation.",
      ar: "رسالة الماجستير: نظام أسئلة وأجوبة على المستندات مبني على RAG، عابر للغات (عربي/ألماني)، مع بحث هجين وتقييم.",
    },
  },
  {
    school: "Yarmouk Private University, Syria",
    degree: {
      en: "B.Sc. Communications & Electronics Engineering",
      de: "B.Sc. Nachrichtentechnik & Elektronik",
      ar: "بكالوريوس هندسة الاتصالات والإلكترونيات",
    },
    when: { en: "2014 – 2019", de: "2014 – 2019", ar: "2014 – 2019" },
    note: null,
  },
];

export const languages = [
  { name: { en: "Arabic", de: "Arabisch", ar: "العربية" }, level: { en: "native", de: "Muttersprache", ar: "اللغة الأم" } },
  { name: { en: "German", de: "Deutsch", ar: "الألمانية" }, level: { en: "B2", de: "B2", ar: "B2" } },
  { name: { en: "English", de: "Englisch", ar: "الإنكليزية" }, level: { en: "C1", de: "C1", ar: "C1" } },
];

export const certifications = [
  { name: "IBM AI Engineering Professional Certificate (Coursera)", done: false },
  { name: "Google Cloud Professional Machine Learning Engineer", done: false, target: true },
];

export const skills = {
  en: [
    { h: "Embedded & automotive networks", items: ["CAN / CAN FD", "LIN, Automotive Ethernet (basics)", "ISO 16845-1 conformance", "Controller drivers on MCUs", "Bit timing & TDC", "Oscilloscope / bus analysis"] },
    { h: "Python & tooling", items: ["Python", "Test automation", "Log & result analysis", "Report generation", "CLI tools"] },
    { h: "Linux, Docker & security", items: ["Debian / Raspberry Pi OS", "Docker Compose", "systemd", "Zero Trust (Cloudflare Access, Tailscale)", "Backups & restore tests (restic)", "Monitoring & alerting"] },
    { h: "AI / LLM integration", items: ["LLM APIs with structured output", "RAG (hybrid retrieval)", "Evaluation (Recall@k, faithfulness)", "Prompt-injection-aware design", "Cost guards"] },
    { h: "Web", items: ["HTML / CSS / JavaScript", "Static sites (Astro)", "i18n & RTL", "Accessibility"] },
  ],
  de: [
    { h: "Embedded & Fahrzeugnetzwerke", items: ["CAN / CAN FD", "LIN, Automotive Ethernet (Grundlagen)", "ISO-16845-1-Konformität", "Controllertreiber auf MCUs", "Bit-Timing & TDC", "Oszilloskop / Busanalyse"] },
    { h: "Python & Tools", items: ["Python", "Testautomatisierung", "Log- & Ergebnisanalyse", "Berichtsgenerierung", "CLI-Tools"] },
    { h: "Linux, Docker & Sicherheit", items: ["Debian / Raspberry Pi OS", "Docker Compose", "systemd", "Zero Trust (Cloudflare Access, Tailscale)", "Backups & Restore-Tests (restic)", "Monitoring & Alerting"] },
    { h: "KI- / LLM-Integration", items: ["LLM-APIs mit strukturierter Ausgabe", "RAG (hybride Suche)", "Evaluation (Recall@k, Faithfulness)", "Prompt-Injection-bewusstes Design", "Kostenkontrolle"] },
    { h: "Web", items: ["HTML / CSS / JavaScript", "Statische Seiten (Astro)", "i18n & RTL", "Barrierefreiheit"] },
  ],
  ar: [
    { h: "الأنظمة المدمجة وشبكات السيارات", items: ["CAN / CAN FD", "LIN و Automotive Ethernet (أساسيات)", "مطابقة ISO 16845-1", "تعريفات المتحكمات على MCUs", "توقيت البِتّات و TDC", "راسم الإشارة / تحليل الناقل"] },
    { h: "بايثون والأدوات", items: ["Python", "أتمتة الاختبارات", "تحليل السجلات والنتائج", "توليد التقارير", "أدوات سطر الأوامر"] },
    { h: "لينكس و Docker والأمان", items: ["Debian / Raspberry Pi OS", "Docker Compose", "systemd", "Zero Trust (Cloudflare Access، Tailscale)", "نسخ احتياطي واختبارات استرجاع (restic)", "مراقبة وتنبيهات"] },
    { h: "دمج الذكاء الاصطناعي / LLM", items: ["واجهات LLM بمخرجات منظّمة", "RAG (بحث هجين)", "التقييم (Recall@k، الأمانة للمصادر)", "تصميم واعٍ لـ prompt injection", "ضبط التكلفة"] },
    { h: "الويب", items: ["HTML / CSS / JavaScript", "مواقع ثابتة (Astro)", "تعدد اللغات و RTL", "إمكانية الوصول"] },
  ],
};

export const now = {
  en: [
    { k: "Studying", v: "M.Sc. Web Technologies, thesis on cross-lingual RAG (Arabic ↔ German)." },
    { k: "Learning", v: "Structured AI-engineering path: IBM AI Engineering certificate, then Google Cloud ML Engineer." },
    { k: "Building", v: "A measurable RAG system over my own documents, with an evaluation set and experiments." },
    { k: "Next", v: "An AI-engineering role in Germany, ideally where embedded systems and AI meet." },
  ],
  de: [
    { k: "Studium", v: "M.Sc. Web Technologies, Masterarbeit über sprachübergreifendes RAG (Arabisch ↔ Deutsch)." },
    { k: "Lernen", v: "Strukturierter AI-Engineering-Weg: IBM-AI-Engineering-Zertifikat, danach Google Cloud ML Engineer." },
    { k: "Bauen", v: "Ein messbares RAG-System über meine eigenen Dokumente – mit Evaluationsset und Experimenten." },
    { k: "Als Nächstes", v: "Eine AI-Engineering-Rolle in Deutschland, am liebsten dort, wo Embedded und KI zusammenkommen." },
  ],
  ar: [
    { k: "أدرس", v: "ماجستير تقانات الويب، ورسالتي عن RAG عابر للغات (عربي ↔ ألماني)." },
    { k: "أتعلّم", v: "مسار منظّم في هندسة الذكاء الاصطناعي: شهادة IBM AI Engineering ثم Google Cloud ML Engineer." },
    { k: "أبني", v: "نظام RAG قابل للقياس فوق مستنداتي الخاصة، مع مجموعة تقييم وتجارب." },
    { k: "التالي", v: "وظيفة في هندسة الذكاء الاصطناعي في ألمانيا، والأفضل حيث تلتقي الأنظمة المدمجة بالذكاء الاصطناعي." },
  ],
};

export const hobbies = {
  en: [
    { icon: "sport", h: "Sports", v: "Gym and swimming. Training is a system too: small steps, measured, every week." },
    { icon: "game", h: "Dota 2", v: "Support player around 6k MMR. I read the game as a system: vision, timings, and who is missing from the map." },
    { icon: "code", h: "Programming & tech", v: "Building things at home that run on their own." },
    { icon: "travel", h: "Travel", v: "Berlin and Germany's old towns, Switzerland, Paris, Spain and Turkey. Every new city is a new system to read." },
  ],
  de: [
    { icon: "sport", h: "Sport", v: "Fitnessstudio und Schwimmen. Auch Training ist ein System: kleine Schritte, gemessen, jede Woche." },
    { icon: "game", h: "Dota 2", v: "Support-Spieler mit rund 6k MMR. Ich lese das Spiel als System: Sicht, Timings und wer gerade auf der Karte fehlt." },
    { icon: "code", h: "Programmieren & Technik", v: "Dinge zu Hause bauen, die von selbst laufen." },
    { icon: "travel", h: "Reisen", v: "Berlin und Deutschlands Altstädte, die Schweiz, Paris, Spanien und die Türkei. Jede neue Stadt ist ein neues System zum Lesen." },
  ],
  ar: [
    { icon: "sport", h: "الرياضة", v: "الجيم والسباحة. التمرين نظام أيضاً: خطوات صغيرة، مقيسة، كل أسبوع." },
    { icon: "game", h: "Dota 2", v: "ألعب دور الـ support بتصنيف حوالي 6k MMR. أقرأ اللعبة كنظام: الرؤية، التوقيت، ومن غائب عن الخريطة." },
    { icon: "code", h: "البرمجة والتقنية", v: "أبني أشياء في البيت تعمل وحدها." },
    { icon: "travel", h: "السفر", v: "برلين ومدن ألمانيا القديمة، سويسرا، باريس، إسبانيا وتركيا. كل مدينة جديدة نظام جديد أتعلّم قراءته." },
  ],
};
