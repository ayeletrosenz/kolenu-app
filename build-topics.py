"""Generates the twelve topic reading pages (topic-<slug>.html) and influence pages
(topic-<slug>-edit.html). Run: python3 build-topics.py
Names and descriptions are the approved taxonomy from docs/kolenu_cursor_prompt.md, section 7.
Bar colours are a shuffled pick from the palette per topic, so no page reads as a rainbow."""
from pathlib import Path

HERE = Path(__file__).parent

TOPICS = [
    ("defense", "ביטחון", [
        ("orange", "פעילות צבאית וביטחונית", "הפעילות המרכזית של מערכת הביטחון, לרבות הצטיידות ותשתיות"),
        ("blue", "שיקום נכי צה״ל וכוחות הביטחון", "תגמולים, טיפול ושירותי שיקום"),
        ("lime", "משפחות שכולות והנצחה", "תמיכה במשפחות חללי מערכות ישראל ופעולות הנצחה"),
        ("magenta", "חיילים משוחררים ומסיימי שירות", "מענקים, פיקדונות ותוכניות סיוע לאחר השירות"),
    ]),
    ("homeland", "ביטחון פנים וחירום", [
        ("red", "משטרה וביטחון הציבור", "שיטור, חקירות, אכיפה ושמירה על הסדר הציבורי"),
        ("teal", "בתי סוהר ומעצר", "הפעלת מתקני כליאה ומעצר ותשתיותיהם"),
        ("yellow", "כבאות והצלה", "מניעת שריפות, כיבוי וחילוץ"),
        ("purple", "מוכנות לחירום ומיגון אזרחי", "היערכות העורף, מרכיבי ביטחון ומיגון האוכלוסייה"),
    ]),
    ("health", "בריאות", [
        ("pink", "שירותי בריאות בקהילה", "השתתפות המדינה במימון שירותי קופות החולים וסל הבריאות"),
        ("green", "בתי חולים ורפואה דחופה", "שירותי אשפוז כללי, חדרי מיון ותשתיות בתי החולים"),
        ("yellow", "בריאות הנפש", "טיפול נפשי, אשפוז פסיכיאטרי ושיקום בתחום בריאות הנפש"),
        ("blue", "מניעה ובריאות הציבור", "חיסונים, מניעת מחלות, ניטור וקידום בריאות"),
        ("brown", "גריאטריה ואשפוז סיעודי", "טיפול רפואי באוכלוסייה המבוגרת ומימון אשפוז סיעודי"),
    ]),
    ("housing", "דיור ופיתוח יישובים", [
        ("brown", "סיוע בשכר דירה וברכישת דירה", "השתתפות בשכר דירה וסיוע ממשלתי לזכאים ברכישה"),
        ("orange", "דיור ציבורי", "מלאי הדירות הציבוריות, ניהולן ותחזוקתן"),
        ("teal", "תכנון ופיתוח למגורים", "תכנון שכונות והכנת תשתיות המאפשרות בנייה למגורים"),
        ("magenta", "התחדשות עירונית ושיקום שכונות", "קידום התחדשות, שיפור שכונות ותיקות ושיקום תשתיות"),
        ("lime", "פיתוח ושיקום יישובים", "פיתוח פיזי ותוכניות שיקום של יישובים ואזורים"),
    ]),
    ("religion", "דת ומוסדות תורניים", [
        ("purple", "ישיבות וכוללים", "תמיכה במסגרות הלימוד התורני הרלוונטיות"),
        ("yellow", "לימוד ותרבות תורניים", "פעילות לימודית ותרבות תורנית מחוץ למסגרות בתי הספר"),
        ("red", "שירותי דת לציבור", "שירותי דת ומועצות דתיות, לרבות השירותים לדתות השונות"),
        ("green", "מבני דת ומקומות קדושים", "תמיכה במבני דת, תחזוקה ופיתוח של מקומות קדושים"),
    ]),
    ("education", "חינוך והשכלה גבוהה", [
        ("yellow", "הגיל הרך", "גני ילדים, מעונות יום ומשפחתונים, לרבות סבסוד מסגרות"),
        ("blue", "בתי ספר", "חינוך יסודי ועל־יסודי, הוראה, תוכניות לימוד ותשתיות בתי הספר"),
        ("pink", "חינוך מיוחד ושילוב", "מסגרות חינוך מיוחד ותמיכה בשילוב תלמידים במערכת החינוך"),
        ("lime", "חינוך בלתי פורמלי", "תנועות וארגוני נוער, פעילות חינוכית בקהילה ומסגרות משלימות"),
        ("teal", "השכלה גבוהה", "תמיכה במוסדות להשכלה גבוהה, בהוראה ובמחקר האקדמי"),
    ]),
    ("economy", "כלכלה ותעסוקה", [
        ("teal", "תעסוקה והכשרה מקצועית", "הכשרות, שילוב בעבודה ושירותים לקידום תעסוקה"),
        ("orange", "עסקים ותעשייה", "סיוע לעסקים, פיתוח תעשייה וקידום יצוא"),
        ("purple", "חדשנות ופיתוח טכנולוגי", "תמיכה במחקר ופיתוח שמטרתם חדשנות עסקית ותעשייתית"),
        ("lime", "חקלאות וייצור מזון", "תמיכה בחקלאות, בייצור המקומי ובפיתוח הענף"),
        ("red", "תיירות", "פיתוח תשתיות תיירות ועידוד הפעילות בענף"),
        ("blue", "תקשורת", "הפעילות הממשלתית לפיתוח ולהסדרת שירותי התקשורת"),
    ]),
    ("culture", "מדע, תרבות וספורט", [
        ("magenta", "מדע ומחקר", "תוכניות מדע, תשתיות מחקר ומלגות מחוץ לתקצוב השוטף של ההשכלה הגבוהה"),
        ("yellow", "תרבות ואמנות", "יצירה, מוסדות תרבות, מופעים, קולנוע ואמנות"),
        ("green", "מורשת, מוזיאונים וספריות", "שימור והנגשת מורשת, אוספים וידע לציבור"),
        ("orange", "ספורט בקהילה", "פעילות ספורט לציבור ומתקנים לשימוש קהילתי"),
        ("blue", "ספורט תחרותי והישגי", "ספורטאים, איגודים, תחרויות וספורט הישגי"),
    ]),
    ("government", "ממשל ושירותים ציבוריים", [
        ("blue", "משפט ושירותים משפטיים", "מערכת המשפט, סיוע משפטי ושירותים משפטיים לציבור"),
        ("lime", "רשויות מקומיות", "מענקים כלליים לחיזוק הרשויות ולמימון שירותיהן"),
        ("pink", "שירות לאזרח וממשל דיגיטלי", "שירותי אוכלוסין, הנגשת שירותים ושיפור השירות המקוון"),
        ("brown", "יחסי חוץ ודיפלומטיה", "נציגויות, קשרי חוץ ופעילות דיפלומטית"),
        ("teal", "מוסדות המדינה והמינהל הציבורי", "פעילות מוסדות המדינה, בקרה, בחירות וניהול ממשלתי מרכזי"),
    ]),
    ("environment", "סביבה, אנרגיה ומים", [
        ("green", "פסולת ומיחזור", "צמצום פסולת, מיון, מיחזור וטיפול בפסולת"),
        ("orange", "צמצום זיהום והיערכות לאקלים", "מניעת מפגעים, הפחתת זיהום והיערכות להשפעות שינוי האקלים"),
        ("blue", "טבע ושטחים פתוחים", "הגנה ושיקום של שטחים פתוחים, מערכות טבעיות ונחלים"),
        ("yellow", "אנרגיה", "תכנון משק האנרגיה, אנרגיה מתחדשת והתייעלות אנרגטית"),
        ("magenta", "מים וביוב", "פיתוח משק המים, תשתיות ביוב, טיפול בשפכים והשבת מים"),
    ]),
    ("welfare", "רווחה וביטחון חברתי", [
        ("teal", "קצבאות וביטחון סוציאלי", "השתתפות תקציב המדינה במימון קצבאות ותשלומים דרך הביטוח הלאומי"),
        ("red", "ילדים, נוער ומשפחות בסיכון", "הגנה, ליווי וטיפול בקהילה ובמסגרות חוץ־ביתיות"),
        ("yellow", "שירותים לבעלי מוגבלויות", "דיור נתמך, מרכזי יום, תעסוקה נתמכת ושירותים לחיים בקהילה"),
        ("purple", "שירותים לאזרחים ותיקים", "ליווי חברתי, מסגרות יום ותמיכה בקהילה ובמסגרות מגורים"),
        ("orange", "סיוע לניצולי שואה", "תגמולים, טיפול ושירותי תמיכה ייעודיים"),
        ("lime", "סיוע בעוני ובמצוקה", "סיוע חומרי, ביטחון תזונתי וליווי אנשים ומשפחות במצוקה"),
        ("pink", "קליטת עלייה", "סל קליטה, לימוד עברית וליווי להשתלבות בחברה"),
    ]),
    ("transport", "תחבורה", [
        ("pink", "תחבורה ציבורית", "אוטובוסים, רכבות, רכבות קלות ומטרו"),
        ("teal", "כבישים ותשתיות דרך", "סלילה, שדרוג ותחזוקת כבישים"),
        ("yellow", "בטיחות בדרכים", "מניעה, הסברה ושיפור הבטיחות בתשתיות"),
        ("brown", "תעופה וספנות", "הפעילות הממשלתית בתחומי התעופה והשיט ותמיכות רלוונטיות"),
    ]),
]

def page(slug, name, subs):
    items = "\n".join(
        f"""          <li style="--color: var(--{color})">
            <h2>{title}</h2>
            <p>{desc}</p>
          </li>""" for color, title, desc in subs)
    return f"""<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{name} · קולנו</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="device">
    <span class="btn btn-power" aria-hidden="true"></span>
    <span class="btn btn-volume" aria-hidden="true"></span>
    <div class="device-bezel" style="--screen-edge: var(--sky)">
      <main class="screen">
        <section class="hero hero--topic" style="--hero: var(--sky)">
          <div class="top-row">
            <a class="back" href="explanation-5.html#topic-{slug}" onclick="if (history.length > 1) {{ history.back(); return false; }}">
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true"><path d="M2 1.5L8.5 8L2 14.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/></svg>
              <span>חזרה</span>
            </a>
          </div>
          <div class="hero-art" aria-hidden="true"></div>
        </section>

        <h1 class="page-title">{name}</h1>

        <ul class="subtopics">
{items}
        </ul>
      </main>
      <div class="home-indicator" aria-hidden="true"></div>
    </div>
  </div>
</body>
</html>
"""


def pct_label(v):
    r = round(v, 1)
    return f"{int(r)}%" if r == int(r) else f"{r:.1f}%"


def edit_page(slug, name, subs):
    share = 100 / len(subs)
    bars = "\n".join(
        f"""          <li class="bar" style="--pct: {share:.4f}">
            <div class="bar-row">
              <div class="bar-fill"></div>
              <button class="bar-name" type="button" aria-expanded="false" aria-controls="desc-{k}"><span>{title}</span><span class="chev" aria-hidden="true"></span></button>
              <button class="bar-pct" type="button">{pct_label(share)}</button>
            </div>
            <p class="bar-desc" id="desc-{k}" hidden>{desc}</p>
          </li>""" for k, (_, title, desc) in enumerate(subs, 1))
    back = 'onclick="if (history.length > 1) { history.back(); return false; }"'
    return f"""<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{name} · חלוקת השפעה · קולנו</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="assets/css/topic-transition.css" media="(prefers-reduced-motion: no-preference)">
</head>
<body>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="ballot" viewBox="0 0 24 24"><path fill="currentColor" d="M11 0H24V24H0V11H11Z M9 0V9H0Z"/></symbol>
  </svg>
  <div class="device">
    <span class="btn btn-power" aria-hidden="true"></span>
    <span class="btn btn-volume" aria-hidden="true"></span>
    <div class="device-bezel device-bezel--influence">
      <main class="screen">
        <header class="top influence-header" data-topic="{slug}">
          <a class="back" href="drafts/4-wheel.html" {back}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true"><path d="M2 1.5L8.5 8L2 14.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/></svg>
            <span>חזרה להצבעה</span>
          </a>
          <div class="topic-count-row">
            <h1 class="topic-count-title">{name}</h1>
          </div>
        </header>

        <section class="intro">
          <p>גררו את הברים כדי לחלק את ההשפעה בין תתי־הנושאים. הסכום תמיד נשאר 100%.</p>
          <p>אלה אחוזים מההשפעה שלכם בתוך התחום, ולא מתקציב המדינה. שינוי החלוקה אינו משנה את הקולות או את יתרת האסימונים.</p>
        </section>

        <div class="bars-head">
          <h2>חלוקת ההשפעה שלכם</h2>
          <button class="reset" type="button">איפוס</button>
        </div>

        <ul class="bars bars--live">
{bars}
        </ul>

        <footer class="footer">
          <a class="primary" href="drafts/4-wheel.html" {back}>סיימתי</a>
        </footer>
      </main>
      <div class="sheet-scrim" hidden>
        <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <h2 id="reset-title">להחזיר לחלוקה שווה?</h2>
          <p>ההשפעה שלכם תתחלק שווה בשווה בין כל תתי־הנושאים בתחום. מספר הקולות ויתרת האסימונים לא ישתנו.</p>
          <div class="sheet-actions">
            <button class="primary" type="button" data-action="confirm">החזרה לחלוקה שווה</button>
            <button class="secondary secondary--outline" type="button" data-action="cancel">ביטול</button>
          </div>
        </section>
      </div>
      <div class="home-indicator" aria-hidden="true"></div>
    </div>
  </div>
  <script src="drafts/ballot.js"></script>
  <script src="assets/js/influence.js"></script>
</body>
</html>
"""


for slug, name, subs in TOPICS:
    (HERE / f"topic-{slug}.html").write_text(page(slug, name, subs), encoding="utf-8")
    (HERE / f"topic-{slug}-edit.html").write_text(edit_page(slug, name, subs), encoding="utf-8")
print("built", len(TOPICS), "reading pages and", len(TOPICS), "influence pages")
