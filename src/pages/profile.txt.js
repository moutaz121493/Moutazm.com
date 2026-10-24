// profile.txt: the public CV + projects as plain English text. The "Ask about me" chat (worker/index.js) gives this
// to Gemini as its only knowledge. Everything in it is already public on this site.
import { ui, experience, education, languages, certifications, skills, now, hobbies, LINKS } from "../content/site.js";
import { projects } from "../content/projects.js";

const ok = (s) => s && !String(s).includes("TODO(user)");
const L = (o) => (o && typeof o === "object" ? o.en : o);

export function GET({ site }) {
  const base = site.toString().replace(/\/$/, "");
  const t = ui.en;
  const out = [
    "# Moutaz Mohammad - public profile (from https://moutazm.com)",
    `Headline: ${t.hero.title}, ${t.hero.line} Based in ${t.hero.kicker}. Focus: ${t.hero.keys.join(", ")}.`,
    `About: ${t.about.lead} ${t.about.body.join(" ")}`,
    `Looking for: ${t.contact.body}`,
    `Contact: email ${LINKS.email}, LinkedIn ${LINKS.linkedin}, GitHub ${LINKS.github}. Full CV: ${base}/cv/ (PDF download there).`,
    "", "## Experience",
    ...experience.map((e) => `- ${L(e.role)} at ${e.org} (${e.url || ""}), ${e.from}-${e.to || "today"}, ${L(e.place) || ""}: ${e.points.en.filter(ok).join(" ")}`),
    "", "## Education",
    ...education.map((e) => `- ${e.degree.en}, ${e.school}${e.when ? ", " + L(e.when) : ""}${e.note ? ". " + e.note.en : ""}`),
    "", "## Languages", ...languages.map((x) => `- ${L(x.name)}: ${L(x.level)}`),
    "", "## Certifications", ...certifications.filter((c) => ok(c.name)).map((c) => `- ${c.name}${c.done ? " (done)" : " (in progress)"}`),
    "", "## Skills", ...skills.en.map((g) => `- ${g.h}: ${g.items.filter(ok).join(", ")}`),
    "", "## Now", ...now.en.map((n) => `- ${n.k}: ${n.v}`),
    "", "## Hobbies", ...hobbies.en.map((h) => `- ${h.h}: ${h.v}`),
    "", "## Own projects",
    ...projects.map((p) => {
      const e = p.en;
      const parts = [`### ${e.title} (${p.status}) - ${base}/projects/${p.slug}/`, e.tagline, `Tags: ${(p.tags || []).join(", ")}`];
      for (const k of ["problem", "decisions", "learned"]) if (e[k]) parts.push(`${k}: ${[].concat(e[k]).map((x) => (typeof x === "object" ? Object.values(x).join(": ") : x)).join(" ")}`);
      return parts.join("\n");
    }),
  ];
  return new Response(out.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
