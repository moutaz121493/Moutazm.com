# moutazm.com

Personal portfolio and CV of **Moutaz Mohammad**, an embedded engineer moving into AI engineering.
Trilingual (English, German, Arabic with full right-to-left layout), static, and free to run.

## Stack

- [Astro](https://astro.build) static site, small dependency-free JavaScript (`src/scripts/fx.js`: card glow + tilt, magnetic buttons, circuit background, theme reveal; hero canvas)
- Two themes: HUD (dark) and Retro-Tech (light); hand-drawn SVG "photos" in `src/components/Illo.astro` until real photos exist
- Self-hosted fonts via Fontsource (no requests to Google)
- CV PDFs (EN/DE) generated at build time with [PDFKit](https://pdfkit.org) from the same data as the CV page
- Hosted on Cloudflare Pages · no cookies, no analytics, no trackers

## Structure

```
src/content/cv.js         CV and page text (en / de / ar), edited from a private admin page
src/content/site.js       labels, legal details and helpers; turns cv.js into the shapes the pages use
src/content/projects.js   project write-ups
src/components/           Hero (CAN-bus → neural-network canvas), Home, Flow diagram
src/pages/[...lang]/      one route file per page type, generated for every language
scripts/build-cv-pdf.mjs  ATS-friendly CV PDFs
```

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # CV PDFs + static site into dist/
```

## Principles

- Respects `prefers-reduced-motion`; the animation pauses when it is off-screen.
- Content describes work generically: no customer names, internal tools or code from employers.
- No internal hostnames, IP addresses or other details of the private homelab.
