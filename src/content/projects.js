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
    repo: "https://github.com/moutaz121493/canfd-bittiming",
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
  {
    slug: "pi-n8n-ai-stack",
    status: "live",
    repo: "https://github.com/moutaz121493/pi-n8n-ai-stack",
    tags: ["n8n", "Raspberry Pi 5", "Docker Compose", "Workflow Automation", "Template"],
    flow: ["Webhook / Cron", "Cloudflare Tunnel", "n8n (Queue / SQLite)", "Guarded Agent API", "Validated Workflow JSON"],
    en: {
      title: "pi-n8n-ai-stack",
      tagline: "Hardened ARM64 n8n infrastructure template for Raspberry Pi 5 with CI-validated agentic workflows.",
      problem: "Most self-hosted n8n examples are single-container setups with open ports, no memory caps, and unvalidated workflow exports. I wanted a reusable template built for small ARM64 boards.",
      decisions: [
        "Ships two profiles: production queue mode (PostgreSQL + Redis + worker) and a lightweight 4 GB Pi 5 profile (SQLite + 384 MB memory cap).",
        "Loopback-only binding with an optional Cloudflare Tunnel profile and N8N_BLOCK_ENV_ACCESS_IN_NODE enabled.",
        "Includes 3 sanitized agentic workflow templates validated in CI for schema integrity and zero leaked secrets or private IPs.",
      ],
      learned: [
        "Explicit memory limits and execution pruning matter more on a 4 GB Pi than raw throughput.",
        "Treating n8n workflows as CI-checked code prevents accidental credential leaks.",
      ],
    },
    de: {
      title: "pi-n8n-ai-stack",
      tagline: "Gehärtetes ARM64-Infrastruktur-Template für n8n auf dem Raspberry Pi 5 mit CI-geprüften Agent-Workflows.",
      problem: "Die meisten Self-Hosting-Beispiele für n8n sind einfache Einzelcontainer mit offenen Ports, ohne Speicherlimits und ohne geprüfte Workflow-Exporte. Ich wollte ein wiederverwendbares Template für kleine ARM64-Boards.",
      decisions: [
        "Zwei Profile inklusive: Produktions-Queue-Modus (PostgreSQL + Redis + Worker) und ein leichtes 4-GB-Pi-5-Profil (SQLite + 384 MB RAM-Limit).",
        "Bindung nur an Localhost mit optionalem Cloudflare-Tunnel-Profil und aktiviertem N8N_BLOCK_ENV_ACCESS_IN_NODE.",
        "Enthält 3 bereinigte Agent-Workflow-Templates, die per CI auf Schema-Validität und fehlende Secrets oder private IPs geprüft werden.",
      ],
      learned: [
        "Klare Speicherlimits und Execution-Pruning sind auf einem 4-GB-Pi wichtiger als roher Durchsatz.",
        "n8n-Workflows wie CI-geprüften Code zu behandeln verhindert versehentliche Secret-Leaks.",
      ],
    },
    ar: {
      title: "pi-n8n-ai-stack",
      tagline: "قالب بنية تحتية محصّن لتشغيل n8n على Raspberry Pi 5 (ARM64) مع قوالب أتمتة مفحوصة عبر CI.",
      problem: "معظم أمثلة n8n الذاتية هي حاوية واحدة بمنافذ مفتوحة وبلا حدود للذاكرة أو فحص لملفات الـ workflows. أردت قالباً قابلاً لإعادة الاستخدام ومصمماً لأجهزة ARM64 الصغيرة.",
      decisions: [
        "يوفّر وضعين: وضع الإنتاج بالطوابير (PostgreSQL + Redis + Worker) ووضع خفيف لـ Raspberry Pi 5 بذاكرة 4 GB (SQLite + حد 384 MB).",
        "ربط محلي فقط (loopback) مع خيار Cloudflare Tunnel وتفعيل عزل المتغيرات البيئية داخل العقد.",
        "يتضمن 3 قوالب workflows نظيفة تُفحص تلقائياً في CI للتأكد من صحة البنية وخلوها من المفاتيح أو العناوين الخاصة.",
      ],
      learned: [
        "تحديد الذاكرة وتنظيف سجل التشغيل أهم على جهاز 4 GB من السرعة القصوى.",
        "التعامل مع ملفات n8n ككود مفحوص بـ CI يمنع تسريب الأسرار بالخطأ.",
      ],
    },
  },
  {
    slug: "guarded-agent-template",
    status: "live",
    repo: "https://github.com/moutaz121493/guarded-agent-template",
    tags: ["Agentic AI", "FastAPI", "LLM Evals", "HITL", "Cost Guard"],
    flow: ["Untrusted Input", "Injection Screen", "Atomic Budget Reserve", "Bounded Tool Loop", "HITL Gate / JSON Trace"],
    en: {
      title: "guarded-agent-template",
      tagline: "A bounded, measurable Agentic AI microservice with atomic SQLite cost caps, HITL gates, and CI evals.",
      problem: "Many agent demos run unbounded loops with no cost limit, no safety boundary on mutating tools, and no automated tests. I wanted a small template that brings embedded-systems discipline to LLM agents.",
      decisions: [
        "Every tool is explicitly classified as read-only or mutating; mutating tools pause and require an ephemeral approval code via /v1/approve.",
        "Atomic SQLite budget ledger reserves max cost before calling an LLM and settles actual spend afterward.",
        "Ships a 12-case multilingual (EN/DE/AR) golden evaluation suite that runs in GitHub Actions on every push.",
      ],
      learned: [
        "Deterministic guardrails before the model call catch prompt injections at zero token cost.",
        "A mock planner mode makes CI evals fast, reproducible, and free to run.",
      ],
    },
    de: {
      title: "guarded-agent-template",
      tagline: "Ein begrenzter, messbarer Agentic-AI-Microservice mit atomarem SQLite-Kostenlimit, HITL-Gates und CI-Evals.",
      problem: "Viele Agent-Demos laufen in unbegrenzten Schleifen ohne Kostenlimit, ohne Schutz bei schreibenden Tools und ohne Tests. Ich wollte ein kompaktes Template mit Embedded-Disziplin für LLM-Agenten.",
      decisions: [
        "Jedes Tool ist explizit als lesend oder verändernd markiert; verändernde Tools pausieren und erfordern einen kurzlebigen Freigabecode über /v1/approve.",
        "Ein atomares SQLite-Budgetbuch reserviert Maximalkosten vor dem Modellaufruf und verbucht danach die echten Kosten.",
        "Enthält eine 12-teilige mehrsprachige Eval-Suite (EN/DE/AR), die bei jedem Push in GitHub Actions läuft.",
      ],
      learned: [
        "Deterministische Guardrails vor dem Modellaufruf blockieren Prompt-Injections ohne Token-Kosten.",
        "Ein Mock-Planner macht CI-Evals schnell, reproduzierbar und kostenlos.",
      ],
    },
    ar: {
      title: "guarded-agent-template",
      tagline: "خدمة Agentic AI محدودة وقابلة للقياس مع سقف تكلفة ذري بـ SQLite، بوابات موافقة بشرية، وتقييم تلقائي في CI.",
      problem: "كثير من مشاريع الوكلاء تعمل بحلقات غير محدودة بلا سقف تكلفة ولا حماية للأدوات التغييرية ولا اختبارات آلية. أردت قالباً خفيفاً يطبّق انضباط الأنظمة المدمجة على وكلاء الـ LLM.",
      decisions: [
        "تصنيف صريح لكل أداة كقراءة فقط أو تغييرية؛ الأدوات التغييرية تتوقف وتطلب رمز موافقة مؤقت عبر /v1/approve.",
        "دفتر ميزانية ذري بـ SQLite يحجز أقصى تكلفة قبل استدعاء النموذج ويسوّي التكلفة الفعلية بعده.",
        "يتضمن مجموعة تقييم ذهبية من 12 حالة متعددة اللغات (EN/DE/AR) تعمل تلقائياً في GitHub Actions.",
      ],
      learned: [
        "الحواجز الحتمية قبل استدعاء النموذج توقف محاولات حقن الأوامر بتكلفة صفر.",
        "وجود وضع محاكاة يجعل اختبارات CI سريعة وقابلة للتكرار ومجانية.",
      ],
    },
  },
  {
    slug: "whatsapp-agent-kit",
    status: "live",
    repo: "https://github.com/moutaz121493/whatsapp-agent-kit",
    tags: ["WhatsApp Cloud API", "Agentic AI", "HITL", "n8n", "FastAPI"],
    flow: ["WhatsApp (Text / Voice)", "HMAC + Allowlist", "Media Adapter", "Guarded Agent", "HITL YES/NO Reply"],
    en: {
      title: "whatsapp-agent-kit",
      tagline: "Secure WhatsApp AI Agent template with HMAC verification, allowlist, voice intake, HITL approvals, and a local /demo simulator.",
      problem: "Connecting an AI agent to WhatsApp in a portfolio repo is hard to test without Meta Business credentials and easy to misconfigure insecurely.",
      decisions: [
        "Verifies Meta's X-Hub-Signature-256 header in constant time and enforces a deny-by-default E.164 sender allowlist.",
        "Stores Human-in-the-Loop approval codes in SQLite bound to the originating sender with a 5-minute TTL.",
        "Includes a built-in /demo web chat simulator and an n8n router workflow so anyone can test text, voice notes, and HITL approvals in 30 seconds.",
      ],
      learned: [
        "Binding approval codes to the sender identity prevents cross-user confirmation bugs.",
        "Shipping a zero-credential local simulator makes an infrastructure template immediately verifiable.",
      ],
    },
    de: {
      title: "whatsapp-agent-kit",
      tagline: "Sicheres WhatsApp-AI-Agent-Template mit HMAC-Prüfung, Allowlist, Sprachnotiz-Intake, HITL-Freigaben und lokalem /demo-Simulator.",
      problem: "Einen KI-Agenten in einem Portfolio-Repo an WhatsApp anzubinden ist ohne Meta-Business-Zugang schwer testbar und schnell unsicher konfiguriert.",
      decisions: [
        "Prüft Metas X-Hub-Signature-256 in konstanter Zeit und erzwingt eine Deny-by-Default-Allowlist für E.164-Nummern.",
        "Speichert HITL-Freigabecodes mit 5-Minuten-TTL sendergebunden in SQLite.",
        "Enthält einen lokalen /demo-Chat-Simulator und einen n8n-Router-Workflow, damit Text, Sprachnotizen und HITL-Freigaben in 30 Sekunden testbar sind.",
      ],
      learned: [
        "Sendergebundene Freigabecodes verhindern Bestätigungen durch unbefugte Nutzer.",
        "Ein lokaler Simulator ohne Zugangsdaten macht Infrastruktur-Templates sofort prüfbar.",
      ],
    },
    ar: {
      title: "whatsapp-agent-kit",
      tagline: "قالب وكيل ذكاء اصطناعي آمن لواتساب مع تحقق HMAC وقائمة سماح ومعالجة صوت وموافقات بشرية ومحاكي محلي.",
      problem: "ربط وكيل ذكاء اصطناعي بواتساب في مستودع مفتوح يصعب اختباره بدون حساب Meta Business، ويسهل تهيئته بطريقة غير آمنة.",
      decisions: [
        "تحقق بزمن ثابت من توقيع X-Hub-Signature-256 مع قائمة سماح صارمة للأرقام (رفض افتراضي).",
        "تخزين رموز الموافقة البشرية (HITL) في SQLite مرتبطة بالمرسِل مع صلاحية 5 دقائق.",
        "يتضمن محاكي دردشة مدمج على /demo وملف n8n router لتجربة الرسائل النصية والصوتية والموافقات خلال 30 ثانية.",
      ],
      learned: [
        "ربط رمز الموافقة بهوية المرسِل يمنع أي تداخل أو تأكيد غير مصرح به.",
        "توفير محاكي محلي بدون مفاتيح يجعل القالب قابلاً للتجربة الفورية.",
      ],
    },
  },
];
