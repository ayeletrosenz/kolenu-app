"""Generates the selected main-voting screen. Run: python3 drafts/build.py
Markup is only the shared chrome; drafts/voting.js renders the wheel layout."""
from pathlib import Path

HERE = Path(__file__).parent

SYMBOLS = """<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="token" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M10 0a10 10 0 1 0 0 20a10 10 0 1 0 0-20ZM7 7h6v6H7Z"/></symbol>
  <symbol id="ballot" viewBox="0 0 24 24"><path fill="currentColor" d="M11 0H24V24H0V11H11Z"/><path fill="currentColor" d="M9 0V9H0Z"/></symbol>
</svg>"""

WALLET = """        <div class="wallet">
          <p class="wallet-label" aria-live="polite"></p>
          <div class="wallet-grid" aria-hidden="true"></div>
        </div>"""

DRAFTS = [
    ("4-wheel", "מניפה", "wheel", "dock"),
]


def shell(title, main, scripts, transition=False):
    transition_css = (
        '\n<link rel="stylesheet" href="../assets/css/topic-transition.css" media="(prefers-reduced-motion: no-preference)">'
        if transition else ""
    )
    return f"""<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="drafts.css">{transition_css}</head>
<body>{SYMBOLS}
<div class="device">
  <span class="btn btn-power" aria-hidden="true"></span><span class="btn btn-volume" aria-hidden="true"></span>
  <div class="device-bezel">
{main}
    <div class="home-indicator" aria-hidden="true"></div>
  </div>
</div>
{"".join(f'<script src="{s}"></script>' for s in scripts)}
</body></html>"""


def page(title, layout, wallet):
    return shell(f"ההצבעה שלך · {title} · טיוטה", f"""    <main class="screen v v--{layout}" data-layout="{layout}" data-wallet="{wallet}">
      <header class="v-head">
        <div class="top-row">
          <a class="back" href="../selfie.html" onclick="if (history.length > 1) {{ history.back(); return false; }}">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true"><path d="M2 1.5L8.5 8L2 14.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/></svg>
            <span>חזרה</span>
          </a>
          <a class="help" href="../explanation-1.html" aria-label="איך ההצבעה עובדת?" title="איך ההצבעה עובדת?">?</a>
        </div>
        <h1 class="v-title">ההצבעה שלך</h1>
      </header>
      <div class="v-body"></div>
      <section class="dock dock--{wallet}">
{WALLET}
        <div class="dock-actions">
          <button class="dock-reset" type="button">איפוס</button>
          <a class="dock-next" href="summary.html">לסיכום ההצבעה</a>
        </div>
      </section>
    </main>""", ["ballot.js", "voting.js"], transition=(layout == "wheel"))


SUMMARY = shell("סיכום ההצבעה · טיוטה", f"""    <main class="screen v v--summary">
      <header class="v-head">
        <div class="top-row">
          <a class="back s-back" href="4-wheel.html">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true"><path d="M2 1.5L8.5 8L2 14.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/></svg>
            <span>חזרה לעריכה</span>
          </a>
        </div>
        <h1 class="v-title">סיכום ההצבעה</h1>
      </header>
      <div class="s-head" aria-hidden="true">
        <span>תחום</span><span>קולות</span><span>אסימונים</span>
      </div>
      <ul class="s-list" tabindex="0" aria-label="קולות ואסימונים לפי תחום"></ul>
      <footer class="dock dock--dock">
{WALLET}
        <div class="dock-actions">
          <a class="dock-next s-send" href="../received.html">אישור ושליחה</a>
        </div>
      </footer>
    </main>
    <div class="sheet-scrim s-confirm" hidden>
      <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="send-title" aria-describedby="send-note">
        <h2 id="send-title">לשלוח את ההצבעה?</h2>
        <p id="send-note"></p>
        <div class="sheet-actions">
          <a class="secondary secondary--outline s-return" href="4-wheel.html">חזרה להצבעה</a>
          <a class="primary s-send-anyway" href="../received.html">שלח בכל זאת</a>
        </div>
      </section>
    </div>""", ["ballot.js", "summary.js"])

for slug, title, layout, wallet in DRAFTS:
    (HERE / f"{slug}.html").write_text(page(title, layout, wallet), encoding="utf-8")
(HERE / "summary.html").write_text(SUMMARY, encoding="utf-8")

for old in ["1-fat-list", "2-cards", "2-table", "3-cards", "3-fan", "3-wheel", "4-wheel", "4-deck",
            "4-overview", "5-overview", "5-overview-edit", "6-wallet"]:
    p = HERE / f"{old}.html"
    if p.exists() and old not in {s for s, *_ in DRAFTS}:
        p.unlink()

frames = "".join(
    f'<figure><figcaption><a href="{slug}.html">{title}</a></figcaption><iframe src="{slug}.html" title="{title}"></iframe></figure>'
    for slug, title, *_ in DRAFTS)
(HERE / "index.html").write_text(f"""<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<title>טיוטות מסך הצבעה</title><style>
body{{margin:0;background:#1a1a1a;color:#FDFCFA;font-family:system-ui,sans-serif;padding:24px}}
.bar{{display:flex;justify-content:center;gap:12px;margin-bottom:24px}}
.bar a{{padding:10px 18px;background:#FDFCFA;color:#292929;font-size:16px;font-weight:600;text-decoration:none}}
.grid{{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:center}}
figure{{margin:0;display:flex;flex-direction:column;align-items:center;gap:8px}}
figcaption{{font-size:15px}}
figcaption a{{color:inherit;opacity:.8;text-underline-offset:3px}}
iframe{{width:520px;height:1000px;border:0;transform:scale(.7);transform-origin:top center;margin:0 -78px -300px}}
</style></head><body>
<nav class="bar"><a href="summary.html" onclick="sessionStorage.setItem('kolenu.summaryFrom', location.href)">סיכום ההצבעה</a><a href="../received.html">מסך הסיום</a></nav>
<div class="grid">{frames}</div><p style="text-align:center"><a style="color:inherit" href="archive/index.html">לארכיון הסקיצות הקודמות</a></p></body></html>""", encoding="utf-8")
print("built", len(DRAFTS), "drafts")
