# Social preview cards (public/og/*.png). Re-run after changing the hero text in src/content/cv.js.
"""Render the moutazm.com social preview cards (1200x630) for en/de/ar with the site's own fonts and colours.
usage: make_og.py OUTDIR   (needs PLAYWRIGHT_BROWSERS_PATH pointing at an installed chromium)"""
import json, re, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path("/home/pi/moutazm.com")
FS = REPO / "node_modules/@fontsource"
OUT = Path(sys.argv[1])

# hero text straight from the CV content (cv.js is "export const cv = {...json...}")
src = (REPO / "src/content/cv.js").read_text()
cv = json.loads(src[src.index("{"): src.rindex("}") + 1])
hero = cv["hero"]

FONTS = f"""
@font-face{{font-family:Chakra;font-weight:700;src:url(file://{FS}/chakra-petch/files/chakra-petch-latin-700-normal.woff2)}}
@font-face{{font-family:Chakra;font-weight:600;src:url(file://{FS}/chakra-petch/files/chakra-petch-latin-600-normal.woff2)}}
@font-face{{font-family:Plex;font-weight:400;src:url(file://{FS}/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2)}}
@font-face{{font-family:Plex;font-weight:600;src:url(file://{FS}/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2)}}
@font-face{{font-family:PlexAr;font-weight:400;src:url(file://{FS}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2)}}
@font-face{{font-family:PlexAr;font-weight:600;src:url(file://{FS}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2)}}
@font-face{{font-family:PlexAr;font-weight:700;src:url(file://{FS}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2)}}
@font-face{{font-family:Mono;font-weight:500;src:url(file://{FS}/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2)}}
"""

# a CAN frame-ish square wave (like the hero animation), drawn once as an SVG path
def wave():
    bits = "0110100111010010110011101001011010011100101101"
    x, y, d, hi, lo, w = 0, 0, [], 18, 62, 26
    level = None
    for b in bits:
        yy = hi if b == "1" else lo
        if level is None: d.append(f"M0 {yy}")
        elif yy != level: d.append(f"L{x} {yy}")
        x += w; d.append(f"L{x} {yy}"); level = yy
    return " ".join(d), x

PATH, WAVE_W = wave()

def html(lang):
    ar = lang == "ar"
    t = lambda k: hero[k][lang]
    keys = "".join(f'<li><span class="n">0{i}</span>{k[lang]}</li>' for i, k in enumerate(hero["keys"], 1))
    return f"""<!doctype html><html lang="{lang}" dir="{'rtl' if ar else 'ltr'}"><head><meta charset="utf-8"><style>{FONTS}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{background:#060a0f;color:#e8eff3;font-family:{'PlexAr,' if ar else ''}Plex,sans-serif;position:relative}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(#1f2c37 1px,transparent 1px),linear-gradient(90deg,#1f2c37 1px,transparent 1px);
  background-size:40px 40px;opacity:.35;-webkit-mask-image:radial-gradient(900px 520px at {'85%' if ar else '15%'} 30%,#000 10%,transparent 75%)}}
.glow{{position:absolute;width:760px;height:760px;border-radius:50%;{'left' if ar else 'right'}:-260px;top:-300px;
  background:radial-gradient(circle,rgba(245,184,63,.16),transparent 62%)}}
.glow2{{position:absolute;width:620px;height:620px;border-radius:50%;{'right' if ar else 'left'}:-220px;bottom:-380px;
  background:radial-gradient(circle,rgba(79,209,255,.10),transparent 62%)}}
.wave{{display:block;width:calc(100% + 128px);margin:auto -64px 22px;height:64px;opacity:.55}}
.card{{position:absolute;inset:56px 64px;display:flex;flex-direction:column}}
.top{{display:flex;align-items:center;gap:16px}}
.logo{{width:54px;height:54px}}
.name{{font:500 22px Mono,monospace;letter-spacing:.14em;text-transform:uppercase;color:#f5b83f}}
.loc{{margin-{'right' if ar else 'left'}:auto;font:500 17px {'PlexAr,' if ar else ''}Mono,monospace;color:#8d9ca8;letter-spacing:{'0' if ar else '.06em'};
  display:flex;align-items:center;gap:10px}}
.loc i{{width:10px;height:10px;border-radius:50%;background:#45e08f;box-shadow:0 0 12px #45e08f}}
h1{{margin-top:50px;font:700 {'68px/1.25 PlexAr' if ar else '70px/1.04 Chakra'},sans-serif;letter-spacing:{'0' if ar else '-.01em'};max-width:1072px}}
h1 b{{color:#f5b83f;font-weight:700}}
.line{{margin-top:20px;font:600 {'30px PlexAr' if ar else '30px Chakra'},sans-serif;color:#8d9ca8}}
ul{{list-style:none;display:flex;gap:14px}}
li{{display:flex;align-items:center;gap:10px;padding:12px 18px;border:1px solid #2b3c4a;border-radius:12px;background:rgba(15,22,29,.85);
  font:600 21px {'PlexAr,' if ar else ''}Plex,sans-serif}}
li .n{{font:500 16px Mono,monospace;color:#f5b83f}}
.url{{position:absolute;{'left' if ar else 'right'}:64px;bottom:62px;font:500 22px Mono,monospace;color:#e8eff3;direction:ltr}}
.url b{{color:#f5b83f;font-weight:500}}
</style></head><body>
<div class="grid"></div><div class="glow"></div><div class="glow2"></div>
<div class="card">
  <div class="top"><svg class="logo" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0f161d" stroke="#2b3c4a"/><rect x="7" y="7" width="5" height="18" rx="1" fill="#f2b33d"/><rect x="14" y="17" width="5" height="8" rx="1" fill="#f2b33d" opacity=".55"/><rect x="21" y="11" width="5" height="14" rx="1" fill="#58b7ff"/></svg>
    <span class="name">Moutaz Mohammad</span><span class="loc"><i></i>{t('kicker')}</span></div>
  <h1>{highlight(t('title'), lang)}</h1>
  <div class="line">{t('line')}</div>
  <svg class="wave" viewBox="0 0 {WAVE_W} 80" preserveAspectRatio="none"><path d="{PATH}" fill="none" stroke="#f5b83f" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg>
  <ul>{keys}</ul>
</div>
<div class="url">moutazm<b>.com</b></div>
</body></html>"""

def highlight(title, lang):
    # colour the last two words gold, like the accent on the site
    words = title.split(" ")
    return " ".join(words[:-2]) + " <b>" + " ".join(words[-2:]) + "</b>"

OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    for lang in ("en", "de", "ar"):
        f = Path(f"/tmp/og-work/card-{lang}.html"); f.write_text(html(lang), encoding="utf-8")
        pg.goto(f"file://{f}"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        missing = pg.evaluate("[...document.fonts].filter(f=>f.status!=='loaded').map(f=>f.family+' '+f.weight)")
        pg.screenshot(path=str(OUT / f"{lang}.png"))
        print(lang, "fonts not used/loaded:", missing)
    b.close()
