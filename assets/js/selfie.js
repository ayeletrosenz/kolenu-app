/* Simulated face capture: the live preview is never recorded or sent. */
/* Timeline after tapping התחלת צילום (ms from the previous step). */
const GUIDE_MS = 1500;   /* oval + first cue appear, ring searching */
const LOCK1_MS = 2500;   /* face "found": ring locks */
const CLOSE_MS = 1000;   /* second cue, oval grows, ring searching again */
const LOCK2_MS = 1500;   /* face "found" again */
const HOLD_MS = 1200;    /* orange progress traces the ring */
const VERIFY_MS = 3000;

const screen = document.querySelector('.selfie');
const video = document.querySelector('.camera-feed');
const cue = document.querySelector('.camera-cue');
const statusText = document.querySelector('.camera-status-text');
const action = document.querySelector('.selfie-action');
let stream = null;
let timers = [];

const setState = (state) => { screen.dataset.state = state; };

const setLock = (lock) => {
  if (lock) screen.dataset.lock = lock;
  else delete screen.dataset.lock;
};

const buzz = () => navigator.vibrate?.(35);

screen.style.setProperty('--hold-ms', `${HOLD_MS}ms`);

/* Each step is scheduled relative to the previous one. */
let at = 0;
const later = (ms, fn) => {
  at += ms;
  timers.push(setTimeout(fn, at));
};

const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
  at = 0;
};

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = stream;
  } catch {
    screen.classList.add('no-camera');
  }
}

function stopCamera() {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
}

function setButton(label, { disabled = false, done = false } = {}) {
  action.textContent = label;
  action.disabled = disabled;
  action.classList.toggle('is-done', done);
}

function verified() {
  clearTimers();
  setLock(null);
  stopCamera();
  statusText.textContent = 'הזהות שלכם אומתה';
  setButton('להצבעה', { done: true });
  setState('verified');
  action.focus();
}

action.addEventListener('click', () => {
  if (action.classList.contains('is-done')) {
    location.href = 'drafts/4-wheel.html';
    return;
  }

  clearTimers();
  setButton('הצילום מתבצע…', { disabled: true });
  setState('recording');
  cue.textContent = '';
  startCamera();

  setLock(null);

  later(GUIDE_MS, () => {
    cue.textContent = 'הביטו למצלמה ומקמו את הפנים במסגרת';
    setState('guiding');
  });

  later(LOCK1_MS, () => { setLock('found'); buzz(); });

  later(CLOSE_MS, () => {
    setLock(null);
    cue.textContent = 'קרבו מעט את הטלפון אל הפנים';
    setState('closing');
  });

  later(LOCK2_MS, () => { setLock('hold'); buzz(); });

  later(HOLD_MS, () => {
    video.pause();
    buzz();
    statusText.innerHTML = 'בודקים את הזהות<br>שלכם…';
    setButton('נא להמתין…', { disabled: true });
    setState('verifying');
  });

  later(VERIFY_MS, verified);
});

/* Demo shortcut: tap the title three times quickly (or press S) to skip straight to verified. */
let taps = [];
document.querySelector('.selfie-title').addEventListener('click', () => {
  const now = Date.now();
  taps = [...taps.filter((t) => now - t < 800), now];
  if (taps.length >= 3) { taps = []; verified(); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 's' || e.key === 'S' || e.key === 'ד') verified();
});

addEventListener('pagehide', () => { clearTimers(); stopCamera(); });
