// Executive Single-Page A4 CV PDF Builder (EN, DE Lebenslauf, AR السيرة الذاتية)
// Uses headless Chromium (Playwright) locally on the Pi for magazine-grade typography,
// two-column executive layout, clickable links, and 100% native HarfBuzz Arabic RTL shaping.
// On Cloudflare Workers Builds (where Chromium is absent), preserves the committed PDFs in public/cv/.

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ui, experience, education, skills, languages, certifications, LINKS } from "../src/content/site.js";
import { projects } from "../src/content/projects.js";

const OUT_DIR = fileURLToPath(new URL("../public/cv/", import.meta.url));
const FONTS_DIR = fileURLToPath(new URL("./fonts/", import.meta.url));
fs.mkdirSync(OUT_DIR, { recursive: true });

const PY_PLAYWRIGHT = "/home/pi/tools/shotenv/bin/python";
const hasAllPdfs = ["en", "de", "ar"].every((l) => fs.existsSync(`${OUT_DIR}/moutaz-mohammad-cv-${l}.pdf`));

if (!fs.existsSync(PY_PLAYWRIGHT)) {
  if (hasAllPdfs) {
    console.log("Using pre-rendered executive CV PDFs in public/cv/ (en, de, ar).");
    process.exit(0);
  }
  throw new Error("Playwright Python env not found and pre-rendered PDFs missing.");
}

const fontBase64 = (file) => fs.readFileSync(`${FONTS_DIR}/${file}`).toString("base64");
const fChakra = fontBase64("ChakraPetch-Bold.ttf");
const fSansReg = fontBase64("IBMPlexSans-Regular.ttf");
const fSansBold = fontBase64("IBMPlexSans-SemiBold.ttf");
const fArReg = fontBase64("IBMPlexSansArabic-Regular.ttf");
const fArBold = fontBase64("IBMPlexSansArabic-SemiBold.ttf");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function renderHtml(lang) {
  const isRtl = lang === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const t = ui[lang];
  const c = t.cv;
  const activeProjects = projects.filter((p) => p.status !== "planned");

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8" />
<style>
  @font-face { font-family: 'CVDisplay'; src: url(data:font/ttf;base64,${fChakra}) format('truetype'); font-weight: 700; }
  @font-face { font-family: 'CVSans'; src: url(data:font/ttf;base64,${fSansReg}) format('truetype'); font-weight: 400; }
  @font-face { font-family: 'CVSans'; src: url(data:font/ttf;base64,${fSansBold}) format('truetype'); font-weight: 600; }
  @font-face { font-family: 'CVArabic'; src: url(data:font/ttf;base64,${fArReg}) format('truetype'); font-weight: 400; }
  @font-face { font-family: 'CVArabic'; src: url(data:font/ttf;base64,${fArBold}) format('truetype'); font-weight: 600; }

  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body {
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    background: #ffffff;
    color: #111924;
    font-family: ${isRtl ? "'CVArabic', 'CVSans', sans-serif" : "'CVSans', sans-serif"};
    font-size: ${isRtl ? "8.8pt" : "8.6pt"};
    line-height: ${isRtl ? "1.48" : "1.42"};
  }
  a { color: inherit; text-decoration: none; }

  /* Executive Top Banner */
  .banner {
    background: linear-gradient(135deg, #0b131e 0%, #132234 100%);
    color: #f4f7fa;
    padding: 6.5mm 11mm 5.8mm;
    border-top: 1.4mm solid #f5b83f;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8mm;
  }
  .ban-main { flex: 1; }
  .kicker {
    display: inline-block;
    font-size: 7.2pt;
    font-weight: 600;
    letter-spacing: ${isRtl ? "0" : "0.14em"};
    text-transform: uppercase;
    color: #f5b83f;
    margin-bottom: 1.2mm;
  }
  .name {
    font-family: 'CVDisplay', 'CVSans', sans-serif;
    font-size: 21pt;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #ffffff;
    line-height: 1.05;
  }
  .role {
    margin-top: 1.4mm;
    font-size: 9.8pt;
    font-weight: 600;
    color: #e2e8f0;
  }
  .role span { color: #94a3b8; font-weight: 400; }

  .ban-contact {
    display: grid;
    gap: 1mm;
    font-family: 'CVSans', sans-serif;
    font-size: 7.7pt;
    color: #cbd5e1;
    text-align: ${isRtl ? "left" : "right"};
    direction: ltr;
  }
  .ban-contact a { color: #f5b83f; font-weight: 600; }

  /* Asymmetric 2-Column Executive Grid */
  .sheet {
    display: grid;
    grid-template-columns: 1.58fr 1fr;
    height: calc(297mm - 35.5mm);
  }
  .main-col {
    padding: 5.5mm 8mm 5mm 11mm;
    display: flex;
    flex-direction: column;
    gap: 4.5mm;
  }
  html[dir="rtl"] .main-col {
    padding: 5.5mm 11mm 5mm 8mm;
  }
  .side-col {
    background: #f6f8fb;
    border-inline-start: 0.3mm solid #dde4ec;
    padding: 4.5mm 9.5mm 4.5mm 7mm;
    display: flex;
    flex-direction: column;
    gap: 3.1mm;
  }
  html[dir="rtl"] .side-col {
    padding: 4.5mm 7mm 4.5mm 9.5mm;
  }

  .sec { display: flex; flex-direction: column; gap: 1.7mm; }
  .sec-h {
    display: flex;
    align-items: center;
    gap: 2mm;
    font-family: ${isRtl ? "'CVArabic'" : "'CVDisplay', 'CVSans'"}, sans-serif;
    font-size: ${isRtl ? "9.4pt" : "8.6pt"};
    font-weight: 700;
    letter-spacing: ${isRtl ? "0" : "0.09em"};
    text-transform: uppercase;
    color: #0b131e;
    padding-bottom: 1.1mm;
    border-bottom: 0.35mm solid #d5dde6;
  }
  .sec-h::before {
    content: "";
    width: 1.1mm;
    height: 3.4mm;
    border-radius: 0.5mm;
    background: #d99207;
    flex: none;
  }

  /* Summary */
  .lead { font-weight: 600; color: #0f172a; font-size: 8.8pt; margin-bottom: 1mm; }
  .summary-p { color: #334155; font-size: 8.1pt; line-height: ${isRtl ? "1.46" : "1.38"}; }

  /* Experience */
  .exp-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 3mm;
  }
  .exp-title { font-weight: 600; font-size: 9.2pt; color: #0f172a; }
  .exp-org { color: #475569; font-weight: 400; }
  .pill-date {
    font-family: 'CVSans', sans-serif;
    font-size: 7.4pt;
    font-weight: 600;
    color: #0e7490;
    background: #e0f2fe;
    padding: 0.4mm 2mm;
    border-radius: 99px;
    white-space: nowrap;
  }
  .exp-sub { color: #64748b; font-size: 7.8pt; margin: 0.5mm 0 1.2mm; }
  .bullets {
    padding-inline-start: 3.8mm;
    display: grid;
    gap: 1mm;
    color: #1e293b;
    font-size: 8.05pt;
  }
  .bullets li::marker { color: #d99207; }

  /* Projects 2-Column Compact Cards */
  .pgrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.2mm;
  }
  .pcard {
    border: 0.28mm solid #dde4ec;
    border-radius: 1.8mm;
    padding: 2.1mm 2.6mm;
    background: #fbfcfe;
    display: flex;
    flex-direction: column;
    gap: 0.8mm;
  }
  .ptop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5mm;
  }
  .ptitle { font-weight: 600; font-size: 8.2pt; color: #0f172a; }
  .pbadge {
    font-family: 'CVSans', sans-serif;
    font-size: 6.3pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #0e7490;
    background: #e6f6fa;
    padding: 0.3mm 1.5mm;
    border-radius: 99px;
    white-space: nowrap;
  }
  .ptag {
    color: #475569;
    font-size: 7.45pt;
    line-height: 1.32;
  }

  /* Sidebar: Education, Skills, Languages, Certs */
  .edu-item { display: grid; gap: 0.5mm; padding-bottom: 2mm; border-bottom: 0.25mm dashed #dde4ec; }
  .edu-item:last-child { padding-bottom: 0; border-bottom: 0; }
  .edu-deg { font-weight: 600; font-size: 8.4pt; color: #0f172a; }
  .edu-meta { display: flex; justify-content: space-between; gap: 2mm; font-size: 7.5pt; color: #64748b; }
  .edu-when { color: #0e7490; font-weight: 600; white-space: nowrap; }
  .edu-note { font-size: 7.4pt; color: #334155; margin-top: 0.4mm; }

  .sk-group { display: grid; gap: 0.7mm; }
  .sk-h { font-weight: 600; font-size: 7.6pt; color: #0f172a; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.85mm; }
  .chip {
    font-size: 6.75pt;
    color: #1e293b;
    background: #ffffff;
    border: 0.25mm solid #cbd5e1;
    border-radius: 1mm;
    padding: 0.25mm 1.35mm;
    line-height: 1.22;
  }

  .lang-grid { display: grid; gap: 0.9mm; }
  .lang-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border: 0.25mm solid #dde4ec;
    border-radius: 1.2mm;
    padding: 0.85mm 2.2mm;
    font-size: 7.5pt;
  }
  .lang-lvl { color: #0e7490; font-weight: 600; font-size: 7.2pt; }

  .cert-list { display: grid; gap: 1.1mm; }
  .cert-item {
    background: #ffffff;
    border: 0.25mm solid #dde4ec;
    border-radius: 1.2mm;
    padding: 1.1mm 2.2mm;
    font-size: 7.25pt;
    color: #1e293b;
    display: grid;
    gap: 0.3mm;
  }
  .cert-st { font-size: 6.8pt; color: #b45309; font-weight: 600; text-transform: uppercase; }
</style>
</head>
<body>
  <header class="banner">
    <div class="ban-main">
      <span class="kicker">${esc(c.h)}</span>
      <div class="name">Moutaz Mohammad</div>
      <div class="role">${esc(t.hero.title)} <span>— ${esc(t.hero.line)}</span></div>
    </div>
    <div class="ban-contact">
      <span>${esc(t.hero.kicker)}</span>
      <a href="mailto:${esc(LINKS.email)}">${esc(LINKS.email)}</a>
      <a href="https://moutazm.com">moutazm.com</a>
      <a href="${esc(LINKS.github)}">github.com/moutaz121493</a>
      <a href="${esc(LINKS.linkedin)}">linkedin.com/in/moutaz-mohammad-728356347</a>
    </div>
  </header>

  <div class="sheet">
    <main class="main-col">
      <section class="sec">
        <h2 class="sec-h">${esc(c.summary || t.about.h)}</h2>
        <div>
          <p class="lead">${esc(t.about.lead)}</p>
          <p class="summary-p">${esc(t.about.body.join(" "))}</p>
        </div>
      </section>

      <section class="sec">
        <h2 class="sec-h">${esc(c.exp)}</h2>
        ${experience
          .map(
            (e) => `
          <div>
            <div class="exp-head">
              <div class="exp-title">${esc(e.role[lang])} <span class="exp-org">· ${esc(e.org)}</span></div>
              <span class="pill-date">${esc(e.from)} – ${esc(e.to ?? t.work.present)}</span>
            </div>
            <div class="exp-sub">${esc(e.place[lang])} — ${esc(e.blurb[lang])}</div>
            <ul class="bullets">
              ${e.points[lang].map((pt) => `<li>${esc(pt)}</li>`).join("")}
            </ul>
          </div>`
          )
          .join("")}
      </section>

      <section class="sec">
        <h2 class="sec-h">${esc(c.projects)}</h2>
        <div class="pgrid">
          ${activeProjects
            .map(
              (p) => `
            <div class="pcard">
              <div class="ptop">
                <a class="ptitle" href="${esc(p.repo || `https://moutazm.com/projects/${p.slug}/`)}">${esc(p[lang].title)}</a>
                <span class="pbadge">${esc(p.repo ? "GitHub" : "Live")}</span>
              </div>
              <p class="ptag">${esc(p[lang].tagline)}</p>
            </div>`
            )
            .join("")}
        </div>
      </section>
    </main>

    <aside class="side-col">
      <section class="sec">
        <h2 class="sec-h">${esc(c.edu)}</h2>
        ${education
          .map(
            (e) => `
          <div class="edu-item">
            <div class="edu-deg">${esc(e.degree[lang])}</div>
            <div class="edu-meta">
              <span>${esc(e.school)}</span>
              <span class="edu-when">${esc(e.when[lang])}</span>
            </div>
            ${e.note ? `<div class="edu-note">${esc(e.note[lang])}</div>` : ""}
          </div>`
          )
          .join("")}
      </section>

      <section class="sec">
        <h2 class="sec-h">${esc(c.skills)}</h2>
        ${skills[lang]
          .map(
            (g) => `
          <div class="sk-group">
            <div class="sk-h">${esc(g.h)}</div>
            <div class="chips">
              ${g.items.map((it) => `<span class="chip">${esc(it)}</span>`).join("")}
            </div>
          </div>`
          )
          .join("")}
      </section>

      <section class="sec">
        <h2 class="sec-h">${esc(c.langs)}</h2>
        <div class="lang-grid">
          ${languages
            .map(
              (l) => `
            <div class="lang-row">
              <strong>${esc(l.name[lang])}</strong>
              <span class="lang-lvl">${esc(l.level[lang])}</span>
            </div>`
            )
            .join("")}
        </div>
      </section>

      <section class="sec">
        <h2 class="sec-h">${esc(c.certs)}</h2>
        <div class="cert-list">
        ${certifications
          .map(
            (x) => `
          <div class="cert-item">
            <strong>${esc(x.name)}</strong>
            <span class="cert-st">${esc(x.target ? c.planned : c.inProgress)}</span>
          </div>`
          )
          .join("")}
        </div>
      </section>
    </aside>
  </div>
</body>
</html>`;
}

const jobs = ["en", "de", "ar"].map((lang) => {
  const htmlPath = `/tmp/cv-print-${lang}.html`;
  const pdfPath = `${OUT_DIR}/moutaz-mohammad-cv-${lang}.pdf`;
  fs.writeFileSync(htmlPath, renderHtml(lang), "utf-8");
  return { lang, htmlPath, pdfPath };
});

const pyScript = `
import json, sys
from playwright.sync_api import sync_playwright

jobs = json.loads(sys.argv[1])
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    for j in jobs:
        page.goto("file://" + j["htmlPath"], wait_until="networkidle")
        page.pdf(path=j["pdfPath"], format="A4", print_background=True, prefer_css_page_size=True)
    b.close()
`;

const res = spawnSync(PY_PLAYWRIGHT, ["-c", pyScript, JSON.stringify(jobs)], { stdio: "inherit" });
if (res.status !== 0) {
  throw new Error(`Playwright PDF generation failed with exit code ${res.status}`);
}
console.log("Executive single-page CV PDFs (en, de, ar) rendered to public/cv/");
