/* Ballot summary: every topic in alphabetical order with its votes and tokens used. */
const back = document.querySelector('.s-back');
const from = sessionStorage.getItem(SUMMARY_FROM_KEY);
if (from) back.href = from;
back.addEventListener('click', (e) => {
  if (history.length > 1) { e.preventDefault(); history.back(); }
});

const renderWallet = createWallet(document.querySelector('.wallet'));
renderWallet();

const totalVotes = votes.reduce((total, count) => total + count, 0);
const summary = document.querySelector('.v--summary');
const send = summary.querySelector('.s-send');
const confirmation = document.querySelector('.s-confirm');
const sendTitle = confirmation.querySelector('#send-title');
const sendNote = confirmation.querySelector('#send-note');
const returnToVote = confirmation.querySelector('.s-return');
if (from && !new URL(from, location.href).pathname.endsWith('/index.html')) {
  returnToVote.href = from;
}

function closeConfirmation() {
  confirmation.hidden = true;
  summary.inert = false;
  send.focus();
}

send.addEventListener('click', (e) => {
  const remaining = left();
  const empty = totalVotes === 0;
  if (!empty && remaining <= 0) return;

  e.preventDefault();
  if (empty) {
    sendTitle.textContent = 'לשלוח הצבעה ריקה?';
    sendNote.textContent = 'לא נתתם קול לאף תחום.';
  } else {
    sendTitle.textContent = 'לשלוח את ההצבעה?';
    sendNote.textContent = remaining === 1
      ? 'נשאר לכם אסימון אחד שאפשר להשתמש בו לפני השליחה.'
      : `נשארו לכם ${remaining} אסימונים שאפשר להשתמש בהם לפני השליחה.`;
  }
  confirmation.hidden = false;
  summary.inert = true;
  returnToVote.focus();
});

returnToVote.addEventListener('click', (e) => {
  closeConfirmation();
  if (history.length > 1 && document.referrer === returnToVote.href) {
    e.preventDefault();
    history.back();
  }
});
confirmation.querySelector('.s-send-anyway').addEventListener('click', closeConfirmation);
confirmation.addEventListener('click', (e) => {
  if (e.target === confirmation) closeConfirmation();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !confirmation.hidden) closeConfirmation();
});

const num = (id, n) => `<span class="num">${icon(id, 18)}<b>${n}</b></span>`;
document.querySelector('.s-list').innerHTML = TOPICS.map((topic, i) => {
  const count = votes[i];
  const share = totalVotes ? count / totalVotes : 0;
  return `<li class="s-row">
    <div class="s-topic">
      <span class="s-name">${topic.name}</span>
      <div class="s-fill" role="meter" aria-label="חלק מסך הקולות" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${(share * 100).toFixed(1)}" style="--c:${topic.c}; --share:${share}"></div>
    </div>
    ${num('ballot', count)}${num('token', count * count)}
  </li>`;
}).join('');
