const header = document.querySelector('.influence-header');
const topicIndex = TOPICS.findIndex(({ slug }) => slug === header.dataset.topic);
header.style.setProperty('--topic-accent', TOPICS[topicIndex].c);
header.querySelector('.topic-count-row').insertAdjacentHTML('beforeend', countHTML(topicIndex, 'xl'));

const rows = [...document.querySelectorAll('.bars .bar')];
const n = rows.length;
const equal = () => rows.map(() => 100 / n);
/* Each topic keeps its split for the session, so returning to it shows what was set before. */
const KEY = `kolenu.influence:${location.pathname.split('/').pop()}`;
const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
/* Opened from a topic with no votes: the split is shown at 0% and can't be edited.
   A saved split stays stored (it returns with the topic's first vote) but isn't shown as active. */
const locked = new URLSearchParams(location.search).has('novotes');
let values = locked ? rows.map(() => 0) : Array.isArray(saved) && saved.length === n ? saved : equal();

if (locked) {
  document.querySelector('.bars').classList.add('bars--locked');
  document.querySelector('.reset').disabled = true;
  rows.forEach((row) => { row.querySelector('button.bar-pct').disabled = true; });
  const note = document.createElement('p');
  note.className = 'locked-note';
  note.setAttribute('role', 'status');
  note.textContent = 'לא נתתם קולות לתחום זה, ולכן אי אפשר לחלק את ההשפעה שלכם בין תתי־הנושאים. תנו לתחום לפחות קול אחד כדי לחלק את ההשפעה שלכם.';
  document.querySelector('.bars-head').before(note);
}

const round1 = (v) => Math.round(v * 10) / 10;
const num = (v) => {
  const r = round1(v);
  return Number.isInteger(r) ? `${r}` : r.toFixed(1);
};
const fmt = (v) => `${num(v)}%`;

function render() {
  if (!locked) sessionStorage.setItem(KEY, JSON.stringify(values));
  rows.forEach((row, i) => {
    row.style.setProperty('--pct', values[i]);
    const pct = row.querySelector('button.bar-pct');
    if (pct) pct.textContent = fmt(values[i]);
    const slider = row.querySelector('.bar-row');
    slider.setAttribute('aria-valuenow', values[i].toFixed(1));
    slider.setAttribute('aria-valuetext', fmt(values[i]));
  });
}

/* Others keep their relative proportions from `base`. If they were all at 0,
   the freed space is shared equally between them. */
function setValue(base, i, v) {
  if (locked) return;
  v = Math.min(100, Math.max(0, v));
  const rest = 100 - v;
  const othersSum = base.reduce((s, b, j) => (j === i ? s : s + b), 0);
  values = base.map((b, j) => {
    if (j === i) return v;
    return othersSum > 1e-9 ? (b * rest) / othersSum : rest / (n - 1);
  });
  render();
}

/* Movement beyond this many px turns a tap on the name or number into a drag. */
const TAP_SLOP = 6;

rows.forEach((row, i) => {
  const slider = row.querySelector('.bar-row');
  const nameBtn = row.querySelector('.bar-name');
  const desc = row.querySelector('.bar-desc');

  slider.tabIndex = locked ? -1 : 0;
  if (locked) slider.setAttribute('aria-disabled', 'true');
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', '100');
  slider.setAttribute('aria-label', nameBtn.querySelector('span').textContent);

  let startX = 0;
  let base = null;
  let dragged = false;

  slider.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input')) return;
    startX = e.clientX;
    base = values.slice();
    dragged = false;
    slider.setPointerCapture(e.pointerId);
  });

  slider.addEventListener('pointermove', (e) => {
    if (!base) return;
    if (!dragged && Math.abs(e.clientX - startX) < TAP_SLOP) return;
    dragged = true;
    /* RTL: bars grow leftwards, so moving left increases the value. */
    const delta = ((startX - e.clientX) / slider.clientWidth) * 100;
    setValue(base, i, base[i] + delta);
  });

  const end = () => { base = null; };
  slider.addEventListener('pointerup', end);
  slider.addEventListener('pointercancel', () => { base = null; dragged = true; });

  /* Pointer capture retargets the click to the row, so route taps by position. */
  slider.addEventListener('click', (e) => {
    if (dragged) { dragged = false; return; }
    const hit = document.elementsFromPoint(e.clientX, e.clientY);
    if (hit.some((el) => el.classList?.contains('bar-pct'))) startEdit(row, i);
    else if (hit.some((el) => el === nameBtn || nameBtn.contains(el))) toggle();
  });

  function toggle() {
    const open = nameBtn.getAttribute('aria-expanded') !== 'true';
    nameBtn.setAttribute('aria-expanded', String(open));
    desc.hidden = !open;
  }

  nameBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggle(); }
  });

  row.querySelector('button.bar-pct').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); startEdit(row, i); }
  });

  slider.addEventListener('keydown', (e) => {
    if (e.target !== slider) return;
    const step = { ArrowLeft: 1, ArrowUp: 1, ArrowRight: -1, ArrowDown: -1 }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      setValue(values.slice(), i, values[i] + step);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setValue(values.slice(), i, e.key === 'End' ? 100 : 0);
    }
  });
});

function startEdit(row, i) {
  const btn = row.querySelector('button.bar-pct');
  if (!btn || locked) return;

  const wrap = document.createElement('label');
  wrap.className = 'bar-pct-edit';
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'decimal';
  input.enterKeyHint = 'done';
  input.autocomplete = 'off';
  input.value = num(values[i]);
  input.setAttribute('aria-label', row.querySelector('.bar-name span').textContent);
  wrap.append(input, '%');
  btn.replaceWith(wrap);

  input.focus();
  input.select();
  row.scrollIntoView({ block: 'center', behavior: 'smooth' });

  let done = false;
  const finish = (commit) => {
    if (done) return;
    done = true;
    if (commit) {
      const v = parseFloat(input.value.replace(',', '.'));
      if (Number.isFinite(v)) setValue(values.slice(), i, v);
    }
    wrap.replaceWith(btn);
    render();
    btn.focus({ preventScroll: true });
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); finish(true); }
    else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
}

const sheet = document.querySelector('.sheet-scrim');
const resetBtn = document.querySelector('.reset');

function openSheet() {
  sheet.hidden = false;
  sheet.querySelector('.primary').focus();
}

function closeSheet() {
  sheet.hidden = true;
  resetBtn.focus();
}

resetBtn.addEventListener('click', () => { if (!locked) openSheet(); });
sheet.querySelector('[data-action="confirm"]').addEventListener('click', () => {
  values = equal();
  render();
  closeSheet();
});
sheet.querySelector('[data-action="cancel"]').addEventListener('click', closeSheet);
sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

render();
