/* Main-voting drafts: five layouts over the ballot in ballot.js. */
const nextPrice = (i) => 2 * votes[i] + 1;
const canAdd = (i) => nextPrice(i) <= left();

const topicStyle = (i) => `--c:${TOPICS[i].c};--on:${TOPICS[i].on}`;

/* ---------- shared pieces ---------- */
const countHTML = (i, size = 'm') =>
  `<span class="count count--${size}">${icon('ballot', { xl: 36, l: 26, o: 22 }[size] || 18)}<b>${votes[i]}</b></span>`;

const priceHTML = (i, withIcon = true) =>
  canAdd(i)
    ? `<span class="price">הקול הבא: ${nextPrice(i)} ${tokensWord(nextPrice(i))}${withIcon ? ` ${icon('token', 14)}` : ''}</span>`
    : `<span class="price price--short">אין מספיק אסימונים לקול הבא</span>`;

const stepperHTML = (i, size = 'm') =>
  `<span class="stepper stepper--${size}">` +
  `<button type="button" data-add="${i}" aria-label="הוספת קול" ${canAdd(i) ? '' : 'disabled'}>` +
  `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10H17M10 3V17"/></svg></button>` +
  `<button type="button" data-remove="${i}" aria-label="הסרת קול" ${votes[i] === 0 ? 'disabled' : ''}>` +
  `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10H17"/></svg></button></span>`;

/* Always the influence split; without votes it opens locked at 0%. */
const subHTML = (i) =>
  `<a class="sub" href="../topic-${TOPICS[i].slug}-edit.html${votes[i] > 0 ? '' : '?novotes'}">תתי־נושאים</a>`;

/* Topic name with its subtopics link right under it */
const headHTML = (i, big = false) =>
  `<div class="t-head"><span class="t-name${big ? ' t-name--big' : ''}">${TOPICS[i].name}</span>${subHTML(i)}</div>`;

/* ---------- wallet: 13 / 12 / 13 / 12 ---------- */
const screen = document.querySelector('.v');
const walletGrid = document.querySelector('.wallet-grid');
const walletLabel = document.querySelector('.wallet-label');
const tokenEls = [];

[13, 12, 13, 12].forEach((n) => {
  const row = document.createElement('div');
  row.className = 'w-row';
  for (let k = 0; k < n; k++) {
    const t = document.createElement('i');
    t.innerHTML = icon('token', 20);
    row.append(t);
    tokenEls.push(t);
  }
  walletGrid.append(row);
});

let previewFor = null;

function renderWallet() {
  const l = left();
  const p = previewFor !== null && canAdd(previewFor) ? nextPrice(previewFor) : 0;
  tokenEls.forEach((t, k) => {
    t.className = k >= l ? 'spent' : k >= l - p ? 'next' : '';
  });
  walletLabel.textContent = `נותרו ${l} מתוך ${BUDGET} אסימונים`;
}

function preview(i) {
  previewFor = i;
  renderWallet();
}

/* ---------- actions ---------- */
let layout = null;

function change(fn) {
  const focused = document.activeElement;
  const key = focused?.dataset?.add !== undefined ? ['add', focused.dataset.add]
    : focused?.dataset?.remove !== undefined ? ['remove', focused.dataset.remove] : null;
  fn();
  saveVotes();
  layout.update();
  renderWallet();
  if (key) {
    const el = screen.querySelector(`[data-${key[0]}="${key[1]}"]`);
    if (el && !el.disabled) el.focus({ preventScroll: true });
  }
}

/* Touch has no hover: the wallet previews the next vote of the topic last tapped
   (wheel and overview: the topic in front). */
screen.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  const rem = e.target.closest('[data-remove]');
  if (add && !add.disabled) {
    previewFor = +add.dataset.add;
    change(() => { if (canAdd(+add.dataset.add)) votes[+add.dataset.add]++; });
  }
  if (rem && !rem.disabled) {
    previewFor = +rem.dataset.remove;
    change(() => { votes[+rem.dataset.remove] = Math.max(0, votes[+rem.dataset.remove] - 1); });
  }
});

document.querySelector('.dock-reset').addEventListener('click', () => change(() => { votes = votes.map(() => 0); }));
document.querySelector('.dock-next').addEventListener('click', () => sessionStorage.setItem(SUMMARY_FROM_KEY, location.href));

/* Help: the explanation's exits come back here (see assets/js/return.js). */
document.querySelector('.help').addEventListener('click', () => sessionStorage.setItem('kolenu.return', location.href));

const body = document.querySelector('.v-body');

/* Fat lists carry תתי־נושאים under the topic name; every other layout puts it in the bottom-left corner. */

/* ---------- 1. fat list: full-colour rows ---------- */
const listLayout = () => {
  body.innerHTML = `<ul class="l-list">${TOPICS.map((t, i) => `<li class="l-row" style="${topicStyle(i)}"></li>`).join('')}</ul>`;
  const rows = [...body.querySelectorAll('.l-row')];
  return {
    update() {
      rows.forEach((row, i) => {
        row.innerHTML =
          `<div class="l-main">${headHTML(i)}${priceHTML(i)}</div>` +
          `<div class="l-side">${countHTML(i, 'l')}${stepperHTML(i)}</div>`;
      });
    },
  };
};

/* Votes and tokens used, each number with its icon */
const numHTML = (id, n, size = 18) => `<span class="num">${icon(id, size)}<b>${n}</b></span>`;

/* ---------- 2. fat list as a table: topic | votes | tokens used ---------- */
const tableLayout = () => {
  body.innerHTML =
    `<div class="tb-head" aria-hidden="true"><span>תחום</span><span>קולות</span><span>אסימונים</span></div>` +
    `<ul class="tb-list">${TOPICS.map((t, i) => `<li class="tb-row" style="--c:${t.c}"></li>`).join('')}</ul>`;
  const rows = [...body.querySelectorAll('.tb-row')];
  return {
    update() {
      rows.forEach((row, i) => {
        row.innerHTML =
          `<div class="tb-topic"><span class="tb-name">${TOPICS[i].name}</span>${subHTML(i)}</div>` +
          `<div class="tb-vote"><div class="tb-ctrl">${stepperHTML(i, 's')}${numHTML('ballot', votes[i])}</div>${priceHTML(i, false)}</div>` +
          `<div class="tb-cost">${numHTML('token', votes[i] * votes[i])}</div>`;
      });
    },
  };
};

/* ---------- 3. cards ---------- */
const cardsLayout = () => {
  body.innerHTML = `<ul class="c-grid">${TOPICS.map((t, i) => `<li class="c-card" style="${topicStyle(i)}"></li>`).join('')}</ul>`;
  const cards = [...body.querySelectorAll('.c-card')];
  return {
    update() {
      cards.forEach((card, i) => {
        card.innerHTML =
          `<span class="t-name">${TOPICS[i].name}</span>` +
          `<div class="c-foot">${countHTML(i, 'xl')}${subHTML(i)}${stepperHTML(i)}${priceHTML(i)}</div>`;
      });
    },
  };
};

/* Front-card content shared by the wheel and the overview spotlight */
const focusCardHTML = (i, size = 'l') =>
  `<div class="f-top"><span class="t-name t-name--big">${TOPICS[i].name}</span>${countHTML(i, 'xl')}</div>` +
  `<div class="f-foot">${stepperHTML(i, size)}<div class="f-meta">${priceHTML(i)}${subHTML(i)}</div></div>`;

/* ---------- 4. wheel: the side of an endless drum of cards ---------- */
const wheelLayout = () => {
  body.innerHTML = `<div class="w-stage" tabindex="0" role="listbox" aria-label="תחומים">${TOPICS.map((t, i) =>
    `<div class="w-card" style="${topicStyle(i)}" data-i="${i}" role="option"><div class="w-face"><span class="w-label">${t.name}</span><div class="w-content"></div></div></div>`).join('')}</div>`;
  const stage = body.querySelector('.w-stage');
  const cards = [...stage.querySelectorAll('.w-card')];
  const STRIP = 44;      /* visible band of each neighbouring card */
  const TILT = 11;       /* degrees per step away from the front */
  const SKEW = [2.2, -1.6, 2.8, -2.4, 1.4, -2.6, 2, -1.8, 2.6, -1.4, 2.4, -2.2];  /* resting tilt of each card off the front */
  const faces = cards.map((c) => c.querySelector('.w-face'));
  let pos = 5;           /* fractional position on the drum; unbounded, read modulo N */
  let target = pos;
  let raf = null;

  /* Signed distance around the drum, in [-N/2, N/2): the last topic sits right above the first. */
  const around = (x) => (((x % N) + N * 1.5) % N) - N / 2;
  const indexAt = (x) => ((Math.round(x) % N) + N) % N;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function place() {
    cards.forEach((card, i) => {
      const d = around(i - pos);
      const a = Math.abs(d);
      const s = Math.sign(d) || 1;
      const hidden = a > 3.6;
      card.style.visibility = hidden ? 'hidden' : 'visible';
      card.classList.toggle('is-front', a < 0.5);
      card.classList.toggle('is-below', d > 0.5);
      if (hidden) return;
      /* Each card carries its own perspective so the stack layers by z-index instead of cutting through itself. */
      const y = d * STRIP + s * Math.min(a, 1) * 8;
      const rx = -d * TILT;
      const sc = 1 - Math.min(a, 3) * 0.035;
      card.style.transform = `perspective(900px) translateY(${y}px) rotateX(${rx}deg) scale(${sc})`;
      card.style.zIndex = String(100 - Math.round(a * 10));
      card.style.opacity = String(a > 2.8 ? Math.max(0, 1 - (a - 2.8) / 0.8) : 1);
      /* Pivot on the end hidden behind the front card, so only the visible band swings out. */
      faces[i].style.transformOrigin = d > 0 ? '50% 0' : '50% 100%';
      faces[i].style.transform = `rotate(${SKEW[i] * Math.min(a, 1)}deg)`;
    });
  }

  function settle() {
    cancelAnimationFrame(raf);
    const step = () => {
      const diff = target - pos;
      if (Math.abs(diff) < 0.002 || reduce) { pos = target; place(); return activate(); }
      pos += diff * 0.18;
      place();
      raf = requestAnimationFrame(step);
    };
    step();
  }

  function activate() {
    const i = indexAt(pos);
    api.active = i;
    cards.forEach((card, k) => card.setAttribute('aria-selected', String(k === i)));
    preview(i);
  }

  const goTo = (t) => { target = t; settle(); };
  const goToTopic = (i) => goTo(Math.round(pos) + Math.round(around(i - Math.round(pos))));

  let startY = null;
  let startPos = 0;
  let lastY = 0;
  let lastT = 0;
  let vel = 0;
  let moved = false;

  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a')) return;
    cancelAnimationFrame(raf);
    startY = lastY = e.clientY;
    lastT = performance.now();
    startPos = pos;
    vel = 0;
    moved = false;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    if (startY === null) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 4) moved = true;
    pos = startPos - dy / STRIP;
    const now = performance.now();
    vel = (e.clientY - lastY) / Math.max(1, now - lastT);
    lastY = e.clientY;
    lastT = now;
    place();
  });

  const release = (e) => {
    if (startY === null) return;
    startY = null;
    if (!moved) {
      const card = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el.classList?.contains('w-card'));
      if (card) return goToTopic(+card.dataset.i);
    }
    goTo(Math.round(pos - (vel * 220) / STRIP));
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    goTo(Math.round(target) + Math.sign(e.deltaY));
  }, { passive: false });

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); goTo(Math.round(target) + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); goTo(Math.round(target) - 1); }
  });

  const api = {
    active: 5,
    update() {
      cards.forEach((card, i) => { card.querySelector('.w-content').innerHTML = focusCardHTML(i); });
      place();
    },
    restore(i) {
      pos = target = i;
      api.active = i;
      place();
    },
  };
  requestAnimationFrame(activate);
  return api;
};

/* ---------- 5. overview + spotlight ----------
   Spotlight: the picked topic, full size. Overview: every topic as one chart row whose bar
   grows with its votes, so the whole ballot reads at a glance; tap a row to spotlight it. */
const MAX_VOTES = Math.floor(Math.sqrt(BUDGET));
const overviewLayout = () => {
  body.innerHTML =
    `<section class="o-spot" aria-live="polite"></section>` +
    `<ol class="o-chart" aria-label="תחומים">${TOPICS.map((t, i) =>
      `<li><button type="button" class="o-row" style="${topicStyle(i)}" data-pick="${i}">` +
      `<span class="o-name">${t.name}</span><span class="o-track"><span class="o-bar"></span></span>` +
      `<span class="o-nums"></span></button></li>`).join('')}</ol>`;
  const spot = body.querySelector('.o-spot');
  const rows = [...body.querySelectorAll('.o-row')];
  const api = {
    active: 5,
    update() {
      const a = api.active;
      rows.forEach((s, i) => {
        s.style.setProperty('--share', votes[i] / MAX_VOTES);
        s.classList.toggle('is-zero', votes[i] === 0);
        s.querySelector('.o-nums').innerHTML = numHTML('ballot', votes[i], 14) + numHTML('token', votes[i] * votes[i], 14);
        if (i === a) s.setAttribute('aria-current', 'true');
        else s.removeAttribute('aria-current');
      });
      spot.setAttribute('style', topicStyle(a));
      spot.innerHTML = focusCardHTML(a, 'm');
    },
    restore(i) {
      api.active = i;
      api.update();
    },
  };
  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-pick]');
    if (!t) return;
    api.active = +t.dataset.pick;
    api.update();
    preview(api.active);
  });
  body.querySelector('.o-chart').addEventListener('keydown', (e) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    api.active = (api.active + step + N) % N;
    api.update();
    preview(api.active);
    rows[api.active].focus();
  });
  requestAnimationFrame(() => preview(api.active));
  return api;
};

const LAYOUTS = { list: listLayout, table: tableLayout, cards: cardsLayout, wheel: wheelLayout, overview: overviewLayout };
layout = LAYOUTS[screen.dataset.layout]();
layout.update();
renderWallet();

/* Coming back from תתי־נושאים (or help, or the summary) lands on the same card and scroll position. */
const VIEW_KEY = `kolenu.view:${location.pathname}`;
const saveView = () => sessionStorage.setItem(VIEW_KEY, JSON.stringify({ scroll: screen.scrollTop, active: layout.active }));
const savedView = JSON.parse(sessionStorage.getItem(VIEW_KEY) || 'null');
if (savedView) {
  if (Number.isInteger(savedView.active) && layout.restore) layout.restore(savedView.active);
  screen.scrollTop = savedView.scroll || 0;
}
screen.addEventListener('click', (e) => { if (e.target.closest('a[href]')) saveView(); });
addEventListener('pagehide', saveView);
