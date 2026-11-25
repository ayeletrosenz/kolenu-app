/* The ballot shared by the voting drafts and the summary. Votes cost n² tokens; nothing is sent. */
const BUDGET = 50;

/* Each topic uses one accent from styles.css.
   `slug` matches topic-<slug>.html (reading) and topic-<slug>-edit.html (influence). */
const TOPICS = [
  { slug: 'defense', name: 'ביטחון', c: 'var(--green)' },
  { slug: 'homeland', name: 'ביטחון פנים וחירום', c: 'var(--red)' },
  { slug: 'health', name: 'בריאות', c: 'var(--sky)' },
  { slug: 'housing', name: 'דיור ופיתוח יישובים', c: 'var(--pink)' },
  { slug: 'religion', name: 'דת ומוסדות תורניים', c: 'var(--purple)' },
  { slug: 'education', name: 'חינוך והשכלה גבוהה', c: 'var(--yellow)' },
  { slug: 'economy', name: 'כלכלה ותעסוקה', c: 'var(--orange)' },
  { slug: 'culture', name: 'מדע, תרבות וספורט', c: 'var(--magenta)' },
  { slug: 'government', name: 'ממשל ושירותים ציבוריים', c: 'var(--blue)' },
  { slug: 'environment', name: 'סביבה, אנרגיה ומים', c: 'var(--lime)' },
  { slug: 'welfare', name: 'רווחה וביטחון חברתי', c: 'var(--teal)' },
  { slug: 'transport', name: 'תחבורה', c: 'var(--brown)' },
];
const N = TOPICS.length;

/* The ballot survives visits to help, reading, influence and summary pages for the session. */
const VOTES_KEY = 'kolenu.votes';
/* The voting screen the summary was opened from, so חזרה לעריכה lands back on it. */
const SUMMARY_FROM_KEY = 'kolenu.summaryFrom';
const savedVotes = JSON.parse(sessionStorage.getItem(VOTES_KEY) || 'null');
let votes = Array.isArray(savedVotes) && savedVotes.length === N ? savedVotes : Array(N).fill(0);
const saveVotes = () => sessionStorage.setItem(VOTES_KEY, JSON.stringify(votes));

const spent = () => votes.reduce((s, v) => s + v * v, 0);
const left = () => BUDGET - spent();
const tokensWord = (n) => (n === 1 ? 'אסימון' : 'אסימונים');

const icon = (id, size, cls = '') =>
  `<svg class="${cls}" width="${size}" height="${size}" aria-hidden="true"><use href="#${id}"/></svg>`;

const countHTML = (i, size = 'm') =>
  `<span class="count count--${size}" role="img" aria-label="${votes[i]} קולות">${icon('ballot', { xl: 36, l: 26, o: 22 }[size] || 18)}<b>${votes[i]}</b></span>`;
