/* The ballot shared by the voting drafts and the summary. Votes cost n² tokens; nothing is sent. */
const BUDGET = 50;

/* Draft colour per topic (each accent once). `on` is the readable ink for that fill.
   `slug` matches topic-<slug>.html (reading) and topic-<slug>-edit.html (influence). */
const TOPICS = [
  { slug: 'defense', name: 'ביטחון', c: '#2E9E5B', on: 'var(--paper)' },
  { slug: 'homeland', name: 'ביטחון פנים וחירום', c: '#E5383B', on: 'var(--ink)' },
  { slug: 'health', name: 'בריאות', c: '#5BC8F0', on: 'var(--ink)' },
  { slug: 'housing', name: 'דיור ופיתוח יישובים', c: '#FF3DAE', on: 'var(--ink)' },
  { slug: 'religion', name: 'דת ומוסדות תורניים', c: '#8E5CD9', on: 'var(--paper)' },
  { slug: 'education', name: 'חינוך והשכלה גבוהה', c: '#FFC72C', on: 'var(--ink)' },
  { slug: 'economy', name: 'כלכלה ותעסוקה', c: '#FF7A1A', on: 'var(--ink)' },
  { slug: 'culture', name: 'מדע, תרבות וספורט', c: '#B03A9E', on: 'var(--paper)' },
  { slug: 'government', name: 'ממשל ושירותים ציבוריים', c: '#2F54C9', on: 'var(--paper)' },
  { slug: 'environment', name: 'סביבה, אנרגיה ומים', c: '#A3CF3F', on: 'var(--ink)' },
  { slug: 'welfare', name: 'רווחה וביטחון חברתי', c: '#14A89A', on: 'var(--ink)' },
  { slug: 'transport', name: 'תחבורה', c: '#8B5A3C', on: 'var(--paper)' },
];
const N = TOPICS.length;
const SAMPLE = [2, 0, 3, 0, 0, 2, 0, 0, 0, 1, 0, 0];

/* The ballot survives visits to help, reading, influence and summary pages for the session. */
const VOTES_KEY = 'kolenu.votes';
/* The voting screen the summary was opened from, so חזרה לעריכה lands back on it. */
const SUMMARY_FROM_KEY = 'kolenu.summaryFrom';
const savedVotes = JSON.parse(sessionStorage.getItem(VOTES_KEY) || 'null');
let votes = Array.isArray(savedVotes) && savedVotes.length === N ? savedVotes : SAMPLE.slice();
const saveVotes = () => sessionStorage.setItem(VOTES_KEY, JSON.stringify(votes));

const spent = () => votes.reduce((s, v) => s + v * v, 0);
const left = () => BUDGET - spent();
const tokensWord = (n) => (n === 1 ? 'אסימון' : 'אסימונים');

const icon = (id, size, cls = '') =>
  `<svg class="${cls}" width="${size}" height="${size}" aria-hidden="true"><use href="#${id}"/></svg>`;
