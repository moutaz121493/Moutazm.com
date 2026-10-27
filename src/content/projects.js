// Own-time projects only. No IPs, hostnames, tunnel IDs or anything from work.
// status: live | web | progress | planned (web = runs in the browser). tool: optional interactive parts on the project page (list). repo: null until a clean public repo exists.

export const projects = [
  {
    slug: "moutaz-home",
    status: "live",
    repo: null,
    tags: ["Raspberry Pi 5", "Docker", "Zero Trust", "restic", "Monitoring"],
    flow: ["Phone / laptop", "Tailscale · Cloudflare Access", "Reverse proxy + TLS", "Services", "3-2-1 backups"],
    en: {
      title: "Moutaz Home",
      tagline: "A self-hosted homelab on a Raspberry Pi 5 that runs, backs up and watches itself.",
      problem: "I wanted my passwords, documents and budget at home instead of in a dozen clouds, without opening my home network to the internet and without a setup that breaks silently.",
      decisions: [
        "Zero Trust instead of open ports: private services are only reachable over Tailscale; the one public entry sits behind Cloudflare Tunnel + Access with country and bot rules.",
        "3-2-1 encrypted backups (local HDD, Google Drive, Cloudflare R2) plus a monthly automatic restore test that compares checksums. A backup is only real once it was restored.",
        "Network-wide ad and tracker blocking with a recursive DNS resolver, pushed to every device through the VPN.",
        "Monitoring with push alerts split into two channels: things that are broken, and everything else.",
      ],
      learned: [
        "Reliability is mostly boring details: power supplies, USB disks that disconnect, and timers that must not overlap.",
        "Write down every decision. The documentation is part of the system.",
      ],
    },
    de: {
      title: "Moutaz Home",
      tagline: "Ein selbst gehostetes Homelab auf einem Raspberry Pi 5, das sich selbst betreibt, sichert und überwacht.",
      problem: "Ich wollte Passwörter, Dokumente und Budget zu Hause statt in einem Dutzend Clouds – ohne mein Heimnetz ins Internet zu öffnen und ohne ein Setup, das unbemerkt kaputtgeht.",
      decisions: [
        "Zero Trust statt offener Ports: Private Dienste sind nur über Tailscale erreichbar; der einzige öffentliche Zugang liegt hinter Cloudflare Tunnel + Access mit Länder- und Bot-Regeln.",
        "Verschlüsselte 3-2-1-Backups (lokale HDD, Google Drive, Cloudflare R2) plus ein monatlicher automatischer Restore-Test mit Prüfsummenvergleich. Ein Backup zählt erst, wenn es wiederhergestellt wurde.",
        "Netzwerkweites Blockieren von Werbung und Trackern mit rekursivem DNS-Resolver, per VPN an jedes Gerät verteilt.",
        "Monitoring mit Push-Benachrichtigungen in zwei Kanälen: Dinge, die kaputt sind – und alles andere.",
      ],
      learned: [
        "Zuverlässigkeit besteht vor allem aus langweiligen Details: Netzteile, USB-Platten, die sich trennen, und Timer, die sich nicht überschneiden dürfen.",
        "Jede Entscheidung aufschreiben. Die Dokumentation ist Teil des Systems.",
      ],
    },
    ar: {
      title: "Moutaz Home",
      tagline: "مختبر منزلي على Raspberry Pi 5 يشغّل نفسه وينسخ نفسه احتياطياً ويراقب نفسه.",
      problem: "أردت كلمات السر والمستندات والميزانية في البيت بدل عشرات الخدمات السحابية، من دون فتح شبكة البيت على الإنترنت، ومن دون نظام يتعطّل بصمت.",
      decisions: [
        "مبدأ Zero Trust بدل المنافذ المفتوحة: الخدمات الخاصة متاحة فقط عبر Tailscale، والمدخل العام الوحيد خلف Cloudflare Tunnel و Access مع قواعد للدول والبوتات.",
        "نسخ احتياطي مشفّر بنظام 3-2-1 (قرص محلي، Google Drive، Cloudflare R2) مع اختبار استرجاع آلي شهري يقارن البصمات. النسخة الاحتياطية لا تُحسب إلا بعد استرجاعها.",
        "حجب الإعلانات والمتتبّعات على مستوى الشبكة مع خادم DNS تكراري، يصل لكل جهاز عبر الـ VPN.",
        "مراقبة مع إشعارات على قناتين: ما هو معطّل، وكل ما عداه.",
      ],
      learned: [
        "الاعتمادية في الغالب تفاصيل مملّة: مزوّدات الطاقة، أقراص USB تنفصل، ومؤقّتات يجب ألا تتداخل.",
        "اكتب كل قرار. التوثيق جزء من النظام.",
      ],
    },
  },
  {
    slug: "paperless-ai",
    status: "live",
    repo: null,
    tags: ["LLM", "Structured output", "Python", "Paperless-ngx", "Cost guard"],
    flow: ["Scan / upload", "OCR", "LLM, no tools, JSON schema", "Title · type · amount · deadline", "Reminder push"],
    en: {
      title: "Paperless AI",
      tagline: "German paperwork filed by an LLM: title, sender, type, amount, deadline, and a short summary in Arabic.",
      problem: "German letters arrive constantly, and deadlines hide in long paragraphs. I wanted every document sorted and every deadline reminded, without reading each one twice.",
      decisions: [
        "The model gets no tools and answers only through a strict JSON schema. Document text is treated as data, never as instructions.",
        "One model call per document does everything (classification, amounts, deadlines, tax relevance), which keeps cost predictable.",
        "A hard monthly budget with a shared lock: every AI feature reserves its maximum cost before calling and records the real cost after.",
        "It never overwrites values I corrected by hand.",
      ],
      learned: [
        "Structured output plus validation beats clever prompting.",
        "Cost control has to be designed in from the first line, not added later.",
      ],
    },
    de: {
      title: "Paperless AI",
      tagline: "Deutscher Papierkram, abgelegt von einem LLM: Titel, Absender, Typ, Betrag, Frist und eine kurze Zusammenfassung auf Arabisch.",
      problem: "Deutsche Briefe kommen ständig, und Fristen verstecken sich in langen Absätzen. Ich wollte jedes Dokument sortiert und an jede Frist erinnert werden – ohne alles zweimal zu lesen.",
      decisions: [
        "Das Modell bekommt keine Tools und antwortet nur über ein striktes JSON-Schema. Dokumenttext ist Daten, niemals Anweisung.",
        "Ein Modellaufruf pro Dokument erledigt alles (Klassifizierung, Beträge, Fristen, Steuerrelevanz) – so bleiben die Kosten planbar.",
        "Ein hartes Monatsbudget mit gemeinsamer Sperre: Jede KI-Funktion reserviert vor dem Aufruf ihre Maximalkosten und bucht danach die echten Kosten.",
        "Von Hand korrigierte Werte werden nie überschrieben.",
      ],
      learned: [
        "Strukturierte Ausgabe plus Validierung schlägt cleveres Prompting.",
        "Kostenkontrolle gehört von der ersten Zeile an ins Design, nicht später dazu.",
      ],
    },
    ar: {
      title: "Paperless AI",
      tagline: "أوراق ألمانية يرتّبها نموذج لغوي: العنوان، المرسِل، النوع، المبلغ، الموعد النهائي، وملخص قصير بالعربي.",
      problem: "الرسائل الألمانية لا تتوقف، والمواعيد النهائية مختبئة في فقرات طويلة. أردت كل مستند مرتّباً وكل موعد مذكَّراً به، من دون أن أقرأ كل شيء مرتين.",
      decisions: [
        "النموذج بلا أدوات ويجيب فقط عبر JSON schema صارم. نص المستند بيانات، وليس تعليمات أبداً.",
        "استدعاء واحد للنموذج لكل مستند يقوم بكل شيء (التصنيف، المبالغ، المواعيد، الصلة بالضرائب)، فتبقى التكلفة متوقّعة.",
        "ميزانية شهرية صارمة بقفل مشترك: كل ميزة ذكاء اصطناعي تحجز أقصى تكلفتها قبل الاستدعاء وتسجّل التكلفة الحقيقية بعده.",
        "لا يكتب أبداً فوق قيمة صحّحتها بيدي.",
      ],
      learned: [
        "المخرجات المنظّمة مع التحقق أفضل من الـ prompts الذكية.",
        "ضبط التكلفة يجب أن يكون جزءاً من التصميم من أول سطر، لا إضافة لاحقة.",
      ],
    },
  },
  {
    slug: "diag-agent",
    status: "live",
    repo: "https://github.com/moutaz121493/diag-agent",
    tags: ["Privilege separation", "Redaction", "LLM", "systemd", "Uptime Kuma"],
    flow: ["Monitor: DOWN", "Re-check after 2 min", "Whitelisted evidence + redaction", "LLM with no tools", "Push: cause + fix"],
    en: {
      title: "Self-diagnosing server",
      tagline: "When a service goes down, the server collects evidence, an LLM diagnoses it, and I get one message with the cause and the fix.",
      problem: "An alert that says only \"DOWN\" at 3 a.m. starts a long search through logs. I wanted the first ten minutes of that search done before I even look at my phone.",
      decisions: [
        "Privilege separation: a deterministic collector runs a fixed whitelist of read-only commands; the config can only select built-in checks, never commands.",
        "Secrets are redacted before anything leaves the collector (tokens, passwords, e-mail addresses, push topics, long blobs), and the redaction has tests.",
        "The model runs as an unprivileged user with no tools. It diagnoses only; it never executes a fix.",
        "Flap protection, rate limits and its own monthly cost cap inside the shared AI budget.",
      ],
      learned: [
        "Letting an LLM help with operations is safe when the system around it is designed so that it cannot do anything.",
        "Good evidence matters more than a bigger model: filtering logs to warnings and errors halved the input and improved the answers.",
      ],
    },
    de: {
      title: "Selbstdiagnostizierender Server",
      tagline: "Fällt ein Dienst aus, sammelt der Server Belege, ein LLM stellt die Diagnose, und ich bekomme eine Nachricht mit Ursache und Lösung.",
      problem: "Ein Alarm, der um 3 Uhr nachts nur \"DOWN\" sagt, startet eine lange Suche in Logs. Ich wollte die ersten zehn Minuten dieser Suche erledigt haben, bevor ich aufs Handy schaue.",
      decisions: [
        "Rechtetrennung: Ein deterministischer Collector führt eine feste Whitelist von Lesebefehlen aus; die Konfiguration wählt nur eingebaute Checks, niemals Befehle.",
        "Geheimnisse werden geschwärzt, bevor etwas den Collector verlässt (Tokens, Passwörter, E-Mail-Adressen, Push-Topics, lange Blobs) – mit Tests für die Schwärzung.",
        "Das Modell läuft als unprivilegierter Nutzer ohne Tools. Es diagnostiziert nur und führt nie eine Lösung aus.",
        "Flapping-Schutz, Ratenlimits und ein eigenes Monatslimit innerhalb des gemeinsamen KI-Budgets.",
      ],
      learned: [
        "Ein LLM im Betrieb einzusetzen ist sicher, wenn das System drumherum so gebaut ist, dass es nichts tun kann.",
        "Gute Belege sind wichtiger als ein größeres Modell: Logs auf Warnungen und Fehler zu filtern halbierte den Input und verbesserte die Antworten.",
      ],
    },
    ar: {
      title: "خادم يشخّص نفسه",
      tagline: "حين تتوقف خدمة، يجمع الخادم الأدلة، ويشخّصها نموذج لغوي، وتصلني رسالة واحدة فيها السبب والحل.",
      problem: "تنبيه يقول \"DOWN\" فقط في الثالثة فجراً يعني بحثاً طويلاً في السجلات. أردت أن تكون أول عشر دقائق من هذا البحث منجزة قبل أن أنظر إلى هاتفي.",
      decisions: [
        "فصل الصلاحيات: جامع أدلة حتمي ينفّذ قائمة ثابتة من أوامر القراءة فقط، والإعدادات تختار من فحوص جاهزة ولا تحتوي أوامر أبداً.",
        "إخفاء الأسرار قبل أن يغادر أي شيء الجامع (التوكنات، كلمات السر، البريد، قنوات الإشعارات، الكتل الطويلة)، مع اختبارات للإخفاء.",
        "النموذج يعمل كمستخدم بلا صلاحيات وبلا أدوات. يشخّص فقط ولا ينفّذ أي إصلاح.",
        "حماية من الانقطاعات العابرة، وحدود للتكرار، وسقف تكلفة شهري خاص ضمن ميزانية الذكاء الاصطناعي المشتركة.",
      ],
      learned: [
        "استخدام نموذج لغوي في التشغيل آمن حين يكون النظام حوله مصمماً بحيث لا يستطيع فعل شيء.",
        "الأدلة الجيدة أهم من نموذج أكبر: تصفية السجلات إلى التحذيرات والأخطاء خفّضت المدخلات للنصف وحسّنت الأجوبة.",
      ],
    },
  },
  {
    slug: "home-rag",
    status: "progress",
    repo: null,
    tags: ["RAG", "Hybrid retrieval", "Multilingual embeddings", "Evaluation", "Master's thesis"],
    flow: ["Question (AR / DE / EN)", "Router: docs or numbers", "Keyword + vector search → fusion", "Answer with citations", "Evaluation set"],
    en: {
      title: "Home RAG · Master's thesis",
      tagline: "Ask questions in Arabic about German documents and get answers with sources, measured, not guessed.",
      problem: "Reading a document is easy for today's models. Choosing the right document is the hard part: across languages, as the archive grows, and for questions that need a sum rather than a paragraph.",
      decisions: [
        "Hybrid retrieval: keyword search (exact invoice numbers, names) plus multilingual vectors (Arabic question → German letter), merged with reciprocal rank fusion.",
        "Embeddings run locally on small hardware, so documents never leave the house; only the selected passages go to the answering model.",
        "Numeric questions go to predefined, parameterised queries. The model never writes free SQL.",
        "Everything is measured on an evaluation set: Recall@k, MRR, answer faithfulness, latency and cost per question.",
      ],
      learned: [
        "In progress. The thesis compares keyword, vector, hybrid and reranked retrieval, plus tokenizers for German compound words.",
      ],
    },
    de: {
      title: "Home RAG · Masterarbeit",
      tagline: "Fragen auf Arabisch über deutsche Dokumente stellen und Antworten mit Quellen bekommen – gemessen, nicht geraten.",
      problem: "Ein Dokument zu lesen ist für heutige Modelle leicht. Schwer ist es, das richtige Dokument zu finden: sprachübergreifend, bei wachsendem Archiv und für Fragen, die eine Summe statt eines Absatzes brauchen.",
      decisions: [
        "Hybride Suche: Stichwortsuche (exakte Rechnungsnummern, Namen) plus mehrsprachige Vektoren (arabische Frage → deutscher Brief), zusammengeführt mit Reciprocal Rank Fusion.",
        "Embeddings laufen lokal auf kleiner Hardware, Dokumente verlassen das Haus nicht; nur die ausgewählten Passagen gehen an das Antwortmodell.",
        "Zahlenfragen laufen über vordefinierte, parametrisierte Abfragen. Das Modell schreibt nie freies SQL.",
        "Alles wird an einem Evaluationsset gemessen: Recall@k, MRR, Treue zur Quelle, Latenz und Kosten pro Frage.",
      ],
      learned: [
        "In Arbeit. Die Arbeit vergleicht Stichwort-, Vektor-, hybride und gererankte Suche sowie Tokenizer für deutsche Komposita.",
      ],
    },
    ar: {
      title: "Home RAG · رسالة الماجستير",
      tagline: "اسأل بالعربي عن مستندات ألمانية واحصل على أجوبة مع مصادرها، مقيسة لا مخمّنة.",
      problem: "قراءة المستند سهلة على النماذج اليوم. الصعب هو اختيار المستند الصحيح: عبر اللغات، ومع نمو الأرشيف، ولأسئلة تحتاج مجموعاً لا فقرة.",
      decisions: [
        "بحث هجين: بحث بالكلمات (أرقام فواتير، أسماء) مع متجهات متعددة اللغات (سؤال عربي ← رسالة ألمانية)، مدموجة بـ reciprocal rank fusion.",
        "الـ embeddings تعمل محلياً على عتاد صغير، فلا تغادر المستندات البيت؛ فقط المقاطع المختارة تذهب لنموذج الإجابة.",
        "الأسئلة الرقمية تذهب لاستعلامات جاهزة بمعاملات. النموذج لا يكتب SQL حرّاً أبداً.",
        "كل شيء يُقاس على مجموعة تقييم: Recall@k و MRR والأمانة للمصادر والزمن والتكلفة لكل سؤال.",
      ],
      learned: [
        "قيد العمل. الرسالة تقارن البحث بالكلمات والمتجهات والهجين ومع إعادة الترتيب، ومقسّمات النص للكلمات الألمانية المركّبة.",
      ],
    },
  },
  {
    slug: "can-tools",
    status: "web",
    tool: ["can-timing", "can-frame"],
    repo: null,
    tags: ["CAN FD", "Bit timing", "Browser", "Open source"],
    flow: ["Clock + bit rates", "Bit-timing solver", "Sample point & TDC", "Registers + Linux command", "Next: frame decoder"],
    en: {
      title: "CAN tools",
      tagline: "A CAN FD bit-timing calculator that runs entirely in the browser. A frame decoder comes next.",
      problem: "Choosing CAN FD bit timing (prescaler, segments, sample point, transmitter delay compensation) is error-prone and usually done in spreadsheets. A clear visual tool helps.",
      decisions: [
        "Built only from public standards, in my own time.",
        "Pure client-side: no server, no cost, works offline.",
        "Shows every intermediate value, so the result can be checked by hand.",
      ],
      learned: [
        "Most clock and bit-rate pairs have only a few exact settings. Using the same prescaler in both phases narrows them down further, so it is worth showing the alternatives.",
        "TDC is only allowed with a data prescaler of 1 or 2, so the clock frequency decides early whether high data rates are possible.",
      ],
    },
    de: {
      title: "CAN-Tools",
      tagline: "Ein Rechner für CAN-FD-Bit-Timing, der komplett im Browser läuft. Ein Frame-Decoder folgt als Nächstes.",
      problem: "CAN-FD-Bit-Timing (Prescaler, Segmente, Sample Point, Transmitter Delay Compensation) zu wählen ist fehleranfällig und passiert meist in Tabellen. Ein klares visuelles Tool hilft.",
      decisions: [
        "Nur aus öffentlichen Standards gebaut, in meiner Freizeit.",
        "Rein clientseitig: kein Server, keine Kosten, funktioniert offline.",
        "Zeigt jeden Zwischenwert, damit das Ergebnis von Hand prüfbar ist.",
      ],
      learned: [
        "Die meisten Paare aus Takt und Bitrate haben nur wenige exakte Einstellungen. Ein gemeinsamer Prescaler für beide Phasen schränkt sie weiter ein, deshalb lohnt es sich, die Alternativen zu zeigen.",
        "TDC ist nur mit Daten-Prescaler 1 oder 2 erlaubt. Der Takt entscheidet also früh, ob hohe Datenraten möglich sind.",
      ],
    },
    ar: {
      title: "أدوات CAN",
      tagline: "حاسبة لتوقيت بِتّات CAN FD تعمل بالكامل داخل المتصفح. مفكّك الإطارات هو الخطوة التالية.",
      problem: "اختيار توقيت بِتّات CAN FD (المقسّم، المقاطع، نقطة أخذ العيّنة، تعويض تأخير المرسِل) عرضة للخطأ ويتم غالباً بجداول. أداة بصرية واضحة تساعد.",
      decisions: [
        "مبنية فقط من المعايير العامة، في وقتي الخاص.",
        "تعمل في المتصفح بالكامل: بلا خادم، بلا تكلفة، وتعمل دون اتصال.",
        "تعرض كل قيمة وسيطة لتمكن مراجعة النتيجة يدوياً.",
      ],
      learned: [
        "معظم أزواج الساعة والسرعة لها إعدادات دقيقة قليلة فقط، واستخدام نفس المقسّم في المرحلتين يقلّلها أكثر، لذلك من المفيد عرض البدائل.",
        "تعويض تأخير المرسِل مسموح فقط مع مقسّم بيانات 1 أو 2، لذا تحدّد الساعة مبكراً إن كانت السرعات العالية ممكنة.",
      ],
    },
  },
];
