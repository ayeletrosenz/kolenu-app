/* Ballot summary: every topic in alphabetical order with its votes and tokens used. */
const back = document.querySelector('.s-back');
const from = sessionStorage.getItem(SUMMARY_FROM_KEY);
if (from) back.href = from;
back.addEventListener('click', (e) => {
  if (history.length > 1) { e.preventDefault(); history.back(); }
});

const l = left();
document.querySelector('.s-total').innerHTML =
  `<p class="s-spent">נוצלו ${spent()} מתוך ${BUDGET} אסימונים</p>` +
  `<p>נותרו ${l} ${tokensWord(l)}</p>`;

const num = (id, n) => `<span class="num">${icon(id, 18)}<b>${n}</b></span>`;
document.querySelector('.s-list').innerHTML = TOPICS.map((t, i) =>
  `<li class="s-row" style="--c:${t.c}"><span class="s-name">${t.name}</span>` +
  `${num('ballot', votes[i])}${num('token', votes[i] * votes[i])}</li>`).join('');
