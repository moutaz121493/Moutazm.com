// sitemap.xml: every indexable page in all languages (the imprint is noindex, so it is left out)
import { LANGS, path } from "../content/site.js";
import { projects } from "../content/projects.js";

const ROUTES = ["/", "/cv", "/privacy", ...projects.map((p) => `/projects/${p.slug}`)];

export function GET({ site }) {
  const base = site.toString().replace(/\/$/, "");
  const urls = ROUTES.flatMap((r) => LANGS.map((l) => {
    const alts = LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${base}${path(a, r)}"/>`).join("");
    return `<url><loc>${base}${path(l, r)}</loc>${alts}</url>`;
  }));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
