/* When the explanation is opened from the voting screen, its exits lead back there instead of to landing.
   The voting screen stores its URL under this key; landing clears it. */
const RETURN_KEY = 'kolenu.return';

if (document.querySelector('.landing')) sessionStorage.removeItem(RETURN_KEY);

const returnTo = sessionStorage.getItem(RETURN_KEY);
if (returnTo) document.querySelectorAll('[data-return]').forEach((a) => { a.href = returnTo; });
