const topicHeader = document.querySelector('.influence-header');
const topicIndex = TOPICS.findIndex(({ slug }) => slug === topicHeader.dataset.topic);
const topicColor = TOPICS[topicIndex].c;
const isTopicReading = topicHeader.hasAttribute('data-vote-reading');
const fromBallot = new URLSearchParams(location.search).get('from') === 'vote';

topicHeader.closest('.device-bezel').style.setProperty('--topic-accent', topicColor);

if (!isTopicReading || fromBallot) {
  topicHeader.querySelector('.topic-count-row').insertAdjacentHTML('beforeend', countHTML(topicIndex, 'xl'));
}

if (isTopicReading && fromBallot) {
  const back = topicHeader.querySelector('.back');
  back.href = 'drafts/4-wheel.html';
  back.querySelector('span').textContent = 'חזרה להצבעה';
  document.querySelector('[data-no-vote-note]').hidden = votes[topicIndex] > 0;
}

// Use the same shuffle for all views of this topic during the session.
const paletteKey = `kolenu.subtopic-colors:${TOPICS[topicIndex].slug}`;
const availableColors = TOPICS.map(({ c }) => c)
  .filter((color) => ![topicColor, 'var(--blue)', 'var(--brown)'].includes(color));
let subtopicColors = JSON.parse(sessionStorage.getItem(paletteKey) || 'null');
if (!Array.isArray(subtopicColors) || subtopicColors.length !== availableColors.length ||
    !availableColors.every((color) => subtopicColors.includes(color))) {
  subtopicColors = [];
  while (availableColors.length) {
    const index = Math.floor(Math.random() * availableColors.length);
    subtopicColors.push(availableColors.splice(index, 1)[0]);
  }
  sessionStorage.setItem(paletteKey, JSON.stringify(subtopicColors));
}

document.querySelectorAll('.subtopics > li, .bars > .bar').forEach((row, i) => {
  row.style.setProperty('--color', subtopicColors[i]);
});
