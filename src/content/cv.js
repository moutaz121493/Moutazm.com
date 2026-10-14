// CV and page text that the CV admin page edits (reports.home.moutazm.com/cv-admin/).
// Plain JSON after `export default`: keep it that way so the admin page can read and write it.
export default {
  "links": {
    "email": "moutaz@moutazm.com",
    "linkedin": "https://www.linkedin.com/in/moutaz-mohammad-728356347/",
    "github": "https://github.com/moutaz121493"
  },
  "hero": {
    "kicker": {
      "en": "Wolfenbüttel, Germany",
      "de": "Wolfenbüttel, Deutschland",
      "ar": "هامبورغ، ألمانيا"
    },
    "title": {
      "en": "Embedded engineer building intelligent systems",
      "de": "Embedded-Ingenieur, der intelligente Systeme baut",
      "ar": "مهندس أنظمة مدمجة يبني أنظمة ذكية"
    },
    "line": {
      "en": "from CAN bits to RAG pipelines.",
      "de": "von CAN-Bits bis zu RAG-Pipelines.",
      "ar": "من بِتّات CAN إلى أنظمة RAG."
    },
    "keys": [
      {
        "en": "Automotive networks",
        "de": "Automotive-Netzwerke",
        "ar": "شبكات السيارات"
      },
      {
        "en": "Linux & infrastructure",
        "de": "Linux & Infrastruktur",
        "ar": "لينكس والبنية التحتية"
      },
      {
        "en": "Applied AI",
        "de": "Angewandte KI",
        "ar": "الذكاء الاصطناعي التطبيقي"
      }
    ]
  },
  "about": {
    "lead": {
      "en": "I like to understand systems from the inside, and then make them run themselves.",
      "de": "Ich will Systeme von innen verstehen – und sie dann selbstständig laufen lassen.",
      "ar": "أحب أن أفهم الأنظمة من الداخل، ثم أجعلها تعمل وحدها."
    },
    "body": [
      {
        "en": "I studied communications and electronics engineering and moved into the world of in-vehicle networks: CAN, CAN FD and the controllers and drivers underneath them. Since 2022 I test, debug and bring up these networks at a specialised test house in Germany.",
        "de": "Ich habe Nachrichtentechnik und Elektronik studiert und bin in die Welt der Fahrzeugnetzwerke gewechselt: CAN, CAN FD und die Controller und Treiber darunter. Seit 2022 teste, debugge und bringe ich diese Netzwerke bei einem spezialisierten Prüfhaus in Deutschland in Betrieb.",
        "ar": "درست هندسة الاتصالات والإلكترونيات، ثم انتقلت إلى عالم شبكات السيارات: CAN و CAN FD والمتحكمات والتعريفات التي تعمل تحتها. منذ 2022 أختبر هذه الشبكات وأصلح أعطالها وأشغّلها في مختبر اختبار متخصص في ألمانيا."
      },
      {
        "en": "In my own time I built a small self-hosted infrastructure on a Raspberry Pi: zero-trust access, encrypted 3-2-1 backups with restore tests, monitoring, and LLM-powered automation that files my paperwork and diagnoses outages on its own.",
        "de": "In meiner Freizeit habe ich eine kleine selbst gehostete Infrastruktur auf einem Raspberry Pi aufgebaut: Zero-Trust-Zugriff, verschlüsselte 3-2-1-Backups mit Restore-Tests, Monitoring und LLM-gestützte Automatisierung, die meine Dokumente ablegt und Ausfälle selbst diagnostiziert.",
        "ar": "في وقتي الخاص بنيت بنية تحتية صغيرة على Raspberry Pi: وصول بمبدأ Zero Trust، ونسخ احتياطي مشفّر بنظام 3-2-1 مع اختبارات استرجاع، ومراقبة، وأتمتة بالذكاء الاصطناعي ترتّب أوراقي وتشخّص الأعطال وحدها."
      },
      {
        "en": "That is where I am heading: AI engineering, with the discipline of embedded work behind it. Measured, secure, and built to keep running.",
        "de": "Dahin geht mein Weg: AI Engineering – mit der Disziplin aus der Embedded-Welt. Messbar, sicher und gebaut, um dauerhaft zu laufen.",
        "ar": "وهذا هو طريقي: هندسة الذكاء الاصطناعي، مع انضباط عالم الأنظمة المدمجة. قابل للقياس، آمن، ومبني ليستمر."
      }
    ]
  },
  "contact": {
    "body": {
      "en": "Open to conversations about embedded, networking and applied AI roles in Germany.",
      "de": "Offen für Gespräche über Rollen in Embedded, Networking und angewandter KI in Deutschland.",
      "ar": "منفتح على أحاديث حول وظائف الأنظمة المدمجة والشبكات والذكاء الاصطناعي التطبيقي في ألمانيا."
    }
  },
  "experience": [
    {
      "org": "C&S group GmbH",
      "url": "https://www.cs-group.de/",
      "from": "2022",
      "to": "",
      "role": {
        "en": "Test Engineer",
        "de": "Testingenieur",
        "ar": "مهندس اختبار"
      },
      "place": {
        "en": "Wolfenbüttel, Germany",
        "de": "Wolfenbüttel",
        "ar": "فولفنبوتل، ألمانيا"
      },
      "blurb": {
        "en": "Test house and consultancy for automotive in-vehicle networks (ISO/IEC 17025 accredited lab).",
        "de": "Prüfhaus und Beratung für Fahrzeugnetzwerke (nach ISO/IEC 17025 akkreditiertes Labor).",
        "ar": "مختبر اختبار واستشارات لشبكات السيارات الداخلية (مختبر معتمد وفق ISO/IEC 17025)."
      },
      "points": [
        {
          "en": "CAN / CAN FD conformance testing of the data link layer (ISO 16845-1).",
          "de": "Konformitätstests von CAN / CAN FD auf der Sicherungsschicht (ISO 16845-1).",
          "ar": "اختبارات المطابقة لـ CAN / CAN FD على طبقة ربط البيانات (ISO 16845-1)."
        },
        {
          "en": "Bring-up, debugging and fixing of CAN / CAN FD controller drivers on automotive microcontrollers: RX/TX paths, mailbox handling and race conditions, bus-off handling, FD bit timing, transmitter delay compensation, clock configuration.",
          "de": "Inbetriebnahme, Debugging und Fehlerbehebung von CAN-/CAN-FD-Controllertreibern auf Automotive-Mikrocontrollern: RX/TX-Pfade, Mailbox-Handling und Race Conditions, Bus-Off-Handling, FD-Bit-Timing, Transmitter Delay Compensation, Takt-Konfiguration.",
          "ar": "تشغيل وتتبّع أعطال وإصلاح تعريفات متحكمات CAN / CAN FD على متحكمات السيارات: مسارات الإرسال والاستقبال، إدارة الـ mailboxes وحالات التسابق، حالة bus-off، توقيت بِتّات FD، تعويض تأخير المرسِل، وإعداد الساعة."
        },
        {
          "en": "Python tooling that automates test-result analysis and reporting.",
          "de": "Python-Tools zur automatisierten Auswertung von Testergebnissen und Berichterstellung.",
          "ar": "أدوات بايثون تؤتمت تحليل نتائج الاختبارات وكتابة التقارير."
        }
      ]
    }
  ],
  "education": [
    {
      "school": "Syrian Virtual University (online)",
      "degree": {
        "en": "M.Sc. Web Technologies",
        "de": "M.Sc. Web Technologies",
        "ar": "ماجستير تقانات الويب"
      },
      "when": {
        "en": "expected Jul/Aug 2027",
        "de": "voraussichtlich Jul./Aug. 2027",
        "ar": "التخرج المتوقع تموز/آب 2027"
      },
      "note": {
        "en": "Thesis: RAG-based document Q&A, cross-lingual (Arabic/German), hybrid retrieval and evaluation.",
        "de": "Masterarbeit: RAG-basiertes Dokumenten-Q&A, sprachübergreifend (Arabisch/Deutsch), hybride Suche und Evaluation.",
        "ar": "رسالة الماجستير: نظام أسئلة وأجوبة على المستندات مبني على RAG، عابر للغات (عربي/ألماني)، مع بحث هجين وتقييم."
      }
    },
    {
      "school": "Yarmouk Private University, Syria",
      "degree": {
        "en": "B.Sc. Communications & Electronics Engineering",
        "de": "B.Sc. Nachrichtentechnik & Elektronik",
        "ar": "بكالوريوس هندسة الاتصالات والإلكترونيات"
      },
      "when": {
        "en": "2014 – 2019",
        "de": "2014 – 2019",
        "ar": "2014 – 2019"
      },
      "note": {
        "en": "",
        "de": "",
        "ar": ""
      }
    }
  ],
  "languages": [
    {
      "name": {
        "en": "Arabic",
        "de": "Arabisch",
        "ar": "العربية"
      },
      "level": {
        "en": "native",
        "de": "Muttersprache",
        "ar": "اللغة الأم"
      }
    },
    {
      "name": {
        "en": "German",
        "de": "Deutsch",
        "ar": "الألمانية"
      },
      "level": {
        "en": "B2",
        "de": "B2",
        "ar": "B2"
      }
    },
    {
      "name": {
        "en": "English",
        "de": "Englisch",
        "ar": "الإنكليزية"
      },
      "level": {
        "en": "C1",
        "de": "C1",
        "ar": "C1"
      }
    }
  ],
  "certifications": [
    {
      "name": "IBM AI Engineering Professional Certificate (Coursera)",
      "done": false,
      "target": false
    },
    {
      "name": "Google Cloud Professional Machine Learning Engineer",
      "done": false,
      "target": true
    }
  ],
  "skills": [
    {
      "h": {
        "en": "Embedded & automotive networks",
        "de": "Embedded & Fahrzeugnetzwerke",
        "ar": "الأنظمة المدمجة وشبكات السيارات"
      },
      "items": [
        {
          "en": "CAN / CAN FD",
          "de": "CAN / CAN FD",
          "ar": "CAN / CAN FD"
        },
        {
          "en": "LIN, Automotive Ethernet (basics)",
          "de": "LIN, Automotive Ethernet (Grundlagen)",
          "ar": "LIN و Automotive Ethernet (أساسيات)"
        },
        {
          "en": "ISO 16845-1 conformance",
          "de": "ISO-16845-1-Konformität",
          "ar": "مطابقة ISO 16845-1"
        },
        {
          "en": "Controller drivers on MCUs",
          "de": "Controllertreiber auf MCUs",
          "ar": "تعريفات المتحكمات على MCUs"
        },
        {
          "en": "Bit timing & TDC",
          "de": "Bit-Timing & TDC",
          "ar": "توقيت البِتّات و TDC"
        },
        {
          "en": "Oscilloscope / bus analysis",
          "de": "Oszilloskop / Busanalyse",
          "ar": "راسم الإشارة / تحليل الناقل"
        }
      ]
    },
    {
      "h": {
        "en": "Python & tooling",
        "de": "Python & Tools",
        "ar": "بايثون والأدوات"
      },
      "items": [
        {
          "en": "Python",
          "de": "Python",
          "ar": "Python"
        },
        {
          "en": "Test automation",
          "de": "Testautomatisierung",
          "ar": "أتمتة الاختبارات"
        },
        {
          "en": "Log & result analysis",
          "de": "Log- & Ergebnisanalyse",
          "ar": "تحليل السجلات والنتائج"
        },
        {
          "en": "Report generation",
          "de": "Berichtsgenerierung",
          "ar": "توليد التقارير"
        },
        {
          "en": "CLI tools",
          "de": "CLI-Tools",
          "ar": "أدوات سطر الأوامر"
        }
      ]
    },
    {
      "h": {
        "en": "Linux, Docker & security",
        "de": "Linux, Docker & Sicherheit",
        "ar": "لينكس و Docker والأمان"
      },
      "items": [
        {
          "en": "Debian / Raspberry Pi OS",
          "de": "Debian / Raspberry Pi OS",
          "ar": "Debian / Raspberry Pi OS"
        },
        {
          "en": "Docker Compose",
          "de": "Docker Compose",
          "ar": "Docker Compose"
        },
        {
          "en": "systemd",
          "de": "systemd",
          "ar": "systemd"
        },
        {
          "en": "Zero Trust (Cloudflare Access, Tailscale)",
          "de": "Zero Trust (Cloudflare Access, Tailscale)",
          "ar": "Zero Trust (Cloudflare Access، Tailscale)"
        },
        {
          "en": "Backups & restore tests (restic)",
          "de": "Backups & Restore-Tests (restic)",
          "ar": "نسخ احتياطي واختبارات استرجاع (restic)"
        },
        {
          "en": "Monitoring & alerting",
          "de": "Monitoring & Alerting",
          "ar": "مراقبة وتنبيهات"
        }
      ]
    },
    {
      "h": {
        "en": "AI / LLM integration",
        "de": "KI- / LLM-Integration",
        "ar": "دمج الذكاء الاصطناعي / LLM"
      },
      "items": [
        {
          "en": "LLM APIs with structured output",
          "de": "LLM-APIs mit strukturierter Ausgabe",
          "ar": "واجهات LLM بمخرجات منظّمة"
        },
        {
          "en": "RAG (hybrid retrieval)",
          "de": "RAG (hybride Suche)",
          "ar": "RAG (بحث هجين)"
        },
        {
          "en": "Evaluation (Recall@k, faithfulness)",
          "de": "Evaluation (Recall@k, Faithfulness)",
          "ar": "التقييم (Recall@k، الأمانة للمصادر)"
        },
        {
          "en": "Prompt-injection-aware design",
          "de": "Prompt-Injection-bewusstes Design",
          "ar": "تصميم واعٍ لـ prompt injection"
        },
        {
          "en": "Cost guards",
          "de": "Kostenkontrolle",
          "ar": "ضبط التكلفة"
        }
      ]
    },
    {
      "h": {
        "en": "Web",
        "de": "Web",
        "ar": "الويب"
      },
      "items": [
        {
          "en": "HTML / CSS / JavaScript",
          "de": "HTML / CSS / JavaScript",
          "ar": "HTML / CSS / JavaScript"
        },
        {
          "en": "Static sites (Astro)",
          "de": "Statische Seiten (Astro)",
          "ar": "مواقع ثابتة (Astro)"
        },
        {
          "en": "i18n & RTL",
          "de": "i18n & RTL",
          "ar": "تعدد اللغات و RTL"
        },
        {
          "en": "Accessibility",
          "de": "Barrierefreiheit",
          "ar": "إمكانية الوصول"
        }
      ]
    }
  ],
  "now": [
    {
      "k": {
        "en": "Studying",
        "de": "Studium",
        "ar": "أدرس"
      },
      "v": {
        "en": "M.Sc. Web Technologies, thesis on cross-lingual RAG (Arabic ↔ German).",
        "de": "M.Sc. Web Technologies, Masterarbeit über sprachübergreifendes RAG (Arabisch ↔ Deutsch).",
        "ar": "ماجستير تقانات الويب، ورسالتي عن RAG عابر للغات (عربي ↔ ألماني)."
      }
    },
    {
      "k": {
        "en": "Learning",
        "de": "Lernen",
        "ar": "أتعلّم"
      },
      "v": {
        "en": "Structured AI-engineering path: IBM AI Engineering certificate, then Google Cloud ML Engineer.",
        "de": "Strukturierter AI-Engineering-Weg: IBM-AI-Engineering-Zertifikat, danach Google Cloud ML Engineer.",
        "ar": "مسار منظّم في هندسة الذكاء الاصطناعي: شهادة IBM AI Engineering ثم Google Cloud ML Engineer."
      }
    },
    {
      "k": {
        "en": "Building",
        "de": "Bauen",
        "ar": "أبني"
      },
      "v": {
        "en": "A measurable RAG system over my own documents, with an evaluation set and experiments.",
        "de": "Ein messbares RAG-System über meine eigenen Dokumente – mit Evaluationsset und Experimenten.",
        "ar": "نظام RAG قابل للقياس فوق مستنداتي الخاصة، مع مجموعة تقييم وتجارب."
      }
    },
    {
      "k": {
        "en": "Next",
        "de": "Als Nächstes",
        "ar": "التالي"
      },
      "v": {
        "en": "An AI-engineering role in Germany, ideally where embedded systems and AI meet.",
        "de": "Eine AI-Engineering-Rolle in Deutschland, am liebsten dort, wo Embedded und KI zusammenkommen.",
        "ar": "وظيفة في هندسة الذكاء الاصطناعي في ألمانيا، والأفضل حيث تلتقي الأنظمة المدمجة بالذكاء الاصطناعي."
      }
    }
  ],
  "hobbies": [
    {
      "icon": "sport",
      "h": {
        "en": "Sports",
        "de": "Sport",
        "ar": "الرياضة"
      },
      "v": {
        "en": "Gym and swimming. Training is a system too: small steps, measured, every week.",
        "de": "Fitnessstudio und Schwimmen. Auch Training ist ein System: kleine Schritte, gemessen, jede Woche.",
        "ar": "الجيم والسباحة. التمرين نظام أيضاً: خطوات صغيرة، مقيسة، كل أسبوع."
      }
    },
    {
      "icon": "game",
      "h": {
        "en": "Dota 2",
        "de": "Dota 2",
        "ar": "Dota 2"
      },
      "v": {
        "en": "Support player around 6k MMR. I read the game as a system: vision, timings, and who is missing from the map.",
        "de": "Support-Spieler mit rund 6k MMR. Ich lese das Spiel als System: Sicht, Timings und wer gerade auf der Karte fehlt.",
        "ar": "ألعب دور الـ support بتصنيف حوالي 6k MMR. أقرأ اللعبة كنظام: الرؤية، التوقيت، ومن غائب عن الخريطة."
      }
    },
    {
      "icon": "code",
      "h": {
        "en": "Programming & tech",
        "de": "Programmieren & Technik",
        "ar": "البرمجة والتقنية"
      },
      "v": {
        "en": "Building things at home that run on their own.",
        "de": "Dinge zu Hause bauen, die von selbst laufen.",
        "ar": "أبني أشياء في البيت تعمل وحدها."
      }
    },
    {
      "icon": "travel",
      "h": {
        "en": "Travel",
        "de": "Reisen",
        "ar": "السفر"
      },
      "v": {
        "en": "Berlin and Germany's old towns, Switzerland, Paris, Spain and Turkey. Every new city is a new system to read.",
        "de": "Berlin und Deutschlands Altstädte, die Schweiz, Paris, Spanien und die Türkei. Jede neue Stadt ist ein neues System zum Lesen.",
        "ar": "برلين ومدن ألمانيا القديمة، سويسرا، باريس، إسبانيا وتركيا. كل مدينة جديدة نظام جديد أتعلّم قراءته."
      }
    }
  ]
};
