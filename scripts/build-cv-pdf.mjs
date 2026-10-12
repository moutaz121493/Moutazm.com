// Builds public/cv/moutaz-mohammad-cv-{en,de}.pdf from the same data as the CV page.
// Plain single-column text with real headings, so ATS parsers can read it.
import fs from "node:fs";
import PDFDocument from "pdfkit";
import { ui, experience, education, skills, languages, certifications, LINKS } from "../src/content/site.js";
import { projects } from "../src/content/projects.js";

const OUT = new URL("../public/cv/", import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

// Helvetica (WinAnsi) has no arrows; keep the text clean for every parser.
const clean = (s) => String(s ?? "").replace(/→/g, "->").replace(/↔/g, "<->").replace(/ /g, " ");
const ACCENT = "#a86b00", INK = "#11161b", MUTED = "#555d66";

function build(lang) {
  const t = ui[lang], c = t.cv;
  const doc = new PDFDocument({ size: "A4", margins: { top: 40, bottom: 34, left: 52, right: 52 },
    info: { Title: `Moutaz Mohammad - ${c.h}`, Author: "Moutaz Mohammad", Subject: t.hero.title } });
  doc.pipe(fs.createWriteStream(new URL(`moutaz-mohammad-cv-${lang}.pdf`, OUT)));
  const W = doc.page.width - 104;

  doc.font("Helvetica-Bold").fontSize(24).fillColor(INK).text("Moutaz Mohammad");
  doc.moveDown(0.15).font("Helvetica").fontSize(12.5).fillColor(MUTED).text(clean(t.hero.title));
  doc.moveDown(0.3).fontSize(9.5).fillColor(INK)
    .text(clean(`${t.hero.kicker}  |  ${LINKS.email}  |  ${LINKS.linkedin.replace("https://www.", "").replace(/\/$/, "")}  |  ${LINKS.github.replace("https://", "")}`));

  const heading = (s) => {
    doc.moveDown(0.7).font("Helvetica-Bold").fontSize(10.5).fillColor(ACCENT).text(clean(s).toUpperCase(), { characterSpacing: 0.8 });
    const y = doc.y + 2;
    doc.moveTo(52, y).lineTo(52 + W, y).lineWidth(0.6).strokeColor("#d0d4d8").stroke();
    doc.moveDown(0.35);
  };
  const entry = (title, when, sub) => {
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(clean(title), 52, y, { width: W - 130 });
    const yEnd = doc.y;
    doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(clean(when), 52 + W - 125, y, { width: 125, align: "right" });
    doc.x = 52; doc.y = Math.max(yEnd, doc.y);
    if (sub) doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(clean(sub), { width: W });
  };
  // summary
  heading(t.about.h);
  doc.font("Helvetica").fontSize(10).fillColor(INK).text(clean(t.about.body.join(" ")), { width: W, align: "left" });

  heading(c.exp);
  for (const e of experience) {
    entry(`${e.role[lang]} - ${e.org}`, `${e.from} - ${e.to ?? t.work.present}`, `${e.place[lang]}. ${e.blurb[lang]}`);
    doc.list(e.points[lang].map(clean), { width: W, bulletRadius: 1.4, textIndent: 12, bulletIndent: 4 });
    doc.moveDown(0.4);
  }

  heading(c.projects);
  for (const p of projects.filter((x) => x.status !== "planned")) {
    entry(p[lang].title, t.projects.status[p.status], p[lang].tagline);
    doc.moveDown(0.35);
  }

  heading(c.edu);
  for (const e of education) {
    entry(`${e.degree[lang]} - ${e.school}`, e.when[lang], e.note ? e.note[lang] : null);
    doc.moveDown(0.35);
  }

  heading(c.skills);
  for (const g of skills[lang]) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(clean(g.h) + ": ", { continued: true })
      .font("Helvetica").text(clean(g.items.join(", ")), { width: W });
    doc.moveDown(0.15);
  }

  heading(c.langs);
  doc.font("Helvetica").fontSize(10).fillColor(INK)
    .text(clean(languages.map((l) => `${l.name[lang]}: ${l.level[lang]}`).join("   |   ")), { width: W });

  heading(c.certs);
  for (const x of certifications) doc.font("Helvetica").fontSize(10).fillColor(INK).text(clean(`${x.name} (${x.target ? c.planned : c.inProgress})`), { width: W });

  doc.end();
}

for (const l of ["en", "de"]) build(l);
console.log("CV PDFs written to public/cv/");
