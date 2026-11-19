import { sections } from './translations.js?v=20261119-pronouns';
import { glossary } from './glossary.js?v=20261119-pronouns';

const roles = {
  S: 'Özne', V: 'Fiil öbeği', P: 'Ortaç ve devamındaki fiil öbeği', O: 'Doğrudan nesne',
  I: 'Dolaylı tümleç', C: 'Diğer tümleç', B: 'Bağlayıcı', N: 'Olumsuzluk',
};
const groupSizes = [5, 5, 5, 2, 2, 6];
const tabs = [...document.querySelectorAll('[role=tab]')];
const pages = sections.map(section => document.getElementById(section.id));
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const finish = document.querySelector('#finish');
const sectionCount = document.querySelector('#section-count');
const popover = document.querySelector('#word-popover');
const wordClose = document.querySelector('#word-close');
let activeIndex = 0;
let activeWord;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function appendWords(parent, text) {
  let from = 0;
  for (const match of text.matchAll(/(\p{L}+)(\/a)?(?:\{([^}]+)\})?/gu)) {
    const [token, word, ending = '', sense] = match;
    parent.append(text.slice(from, match.index));
    const button = element('button', 'vocab-word', word + ending);
    button.type = 'button';
    button.dataset.word = sense ?? word.toLowerCase();
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'word-popover');
    parent.append(button);
    from = match.index + token.length;
  }
  parent.append(text.slice(from));
}

function createSentence(encoded) {
  const line = element('span', 'sentence');
  line.lang = 'es';
  for (const [index, entry] of encoded.split('|').entries()) {
    if (index > 0) line.append(' ');
    const chunk = element('span', 'phrase');
    const [role, text] = entry.split(':');
    chunk.dataset.role = role;
    appendWords(chunk, text);
    line.append(chunk);
  }
  return line;
}

function createExercise([prompt, ...solutions], index) {
  const row = element('div', 'exercise');
  const number = element('span', 'number', String(index));
  number.setAttribute('aria-hidden', 'true');
  const content = element('div');
  const label = element('label', 'prompt', prompt);
  label.htmlFor = 'translation-' + index;
  const input = element('input', 'answer-input');
  input.id = label.htmlFor;
  input.lang = 'es';
  input.autocomplete = 'off';
  input.spellcheck = false;

  const multiple = solutions.length > 1;
  const model = element('div', 'answer-example');
  model.id = 'translation-model-' + index;
  model.hidden = true;
  model.append(element('small', '', multiple ? 'Örnek çeviriler' : 'Örnek çeviri'));
  if (multiple) {
    const options = element('ol', 'answer-options');
    for (const solution of solutions) {
      const option = element('li');
      option.append(createSentence(solution));
      options.append(option);
    }
    model.append(options);
  } else {
    model.append(createSentence(solutions[0]));
  }
  const lockLabel = index + '. çevirinin ' + (multiple ? 'örneklerini ' : 'örneğini ');
  const lock = element('button', 'answer-lock', '🔒');
  lock.type = 'button';
  lock.setAttribute('aria-controls', model.id);
  lock.setAttribute('aria-expanded', 'false');
  lock.setAttribute('aria-label', lockLabel + 'göster');
  lock.addEventListener('click', () => {
    closeWord();
    const reveal = model.hidden;
    model.hidden = !reveal;
    lock.textContent = reveal ? '🔓' : '🔒';
    lock.setAttribute('aria-expanded', String(reveal));
    lock.setAttribute('aria-label', lockLabel + (reveal ? 'gizle' : 'göster'));
  });

  content.append(label, input, model);
  row.append(number, content, lock);
  return row;
}

for (const part of document.querySelectorAll('[data-vocab]')) {
  const words = part.textContent;
  part.replaceChildren();
  appendWords(part, words);
}
let questionNumber = 0;
for (const [index, {items}] of sections.entries()) {
  const container = pages[index].querySelector('[data-exercises]');
  let start = 0;
  for (const size of groupSizes) {
    const card = element('div', 'paper');
    for (const item of items.slice(start, start + size)) card.append(createExercise(item, ++questionNumber));
    container.append(card);
    start += size;
  }
}

function placeWord() {
  if (!activeWord) return;
  const bounds = activeWord.getBoundingClientRect();
  const { offsetWidth: width, offsetHeight: height } = popover;
  const below = bounds.bottom + 8;
  popover.style.left = Math.max(12, Math.min(bounds.left, innerWidth - width - 12)) + 'px';
  popover.style.top = Math.max(12, below + height + 12 <= innerHeight ? below : bounds.top - height - 8) + 'px';
}

function closeWord(restoreFocus = false) {
  if (!activeWord) return;
  const button = activeWord;
  activeWord = undefined;
  button.setAttribute('aria-expanded', 'false');
  button.closest('.sentence')?.classList.remove('word-active');
  popover.hidden = true;
  if (restoreFocus) button.focus({preventScroll:true});
}

function openWord(button) {
  if (button === activeWord) {
    closeWord(true);
    return;
  }
  closeWord();
  const line = button.closest('.sentence');
  const [tr, en, lemma, form] = glossary.get(button.dataset.word);
  document.querySelector('#word-title').textContent = button.textContent;
  document.querySelector('#word-tr').textContent = tr;
  document.querySelector('#word-en').textContent = en;
  document.querySelector('#word-lemma').textContent = lemma;
  document.querySelector('#word-form').textContent = form;
  document.querySelector('#word-role').textContent = roles[button.closest('.phrase')?.dataset.role] ?? 'Ders başlığı';
  document.querySelector('#word-example').textContent = (line ?? button.closest('[data-vocab]')).textContent;
  document.querySelector('#word-context').open = false;
  activeWord = button;
  line?.classList.add('word-active');
  button.setAttribute('aria-expanded', 'true');
  popover.hidden = false;
  placeWord();
  wordClose.focus({preventScroll:true});
}

document.addEventListener('click', event => {
  const word = event.target.closest('.vocab-word');
  if (word) openWord(word);
  else if (!popover.contains(event.target)) closeWord();
});
wordClose.addEventListener('click', () => closeWord(true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeWord) closeWord(true);
});
window.addEventListener('resize', placeWord);
document.addEventListener('scroll', event => {
  if (!popover.contains(event.target)) placeWord();
}, true);

function showPage(index, moveFocus = false) {
  closeWord();
  activeIndex = index;
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    pages[i].hidden = i !== index;
  });
  previous.hidden = index === 0;
  next.hidden = index === pages.length - 1;
  finish.hidden = !next.hidden;
  sectionCount.textContent = (index + 1) + ' / ' + pages.length;
  if (moveFocus) {
    pages[index].querySelector('h2').focus({preventScroll:true});
    window.scrollTo(0, 0);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showPage(index, true));
  tab.addEventListener('keydown', event => {
    const targets = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0, End: tabs.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    showPage(target);
    tabs[target].focus();
  });
});
previous.addEventListener('click', () => showPage(activeIndex - 1, true));
next.addEventListener('click', () => showPage(activeIndex + 1, true));
document.querySelector('#skip').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#main').focus();
});

const initial = pages.findIndex(page => '#' + page.id === location.hash);
if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
showPage(Math.max(0, initial));

for (const dialog of document.querySelectorAll('dialog')) {
  let trigger;
  for (const button of document.querySelectorAll(`[data-open="${dialog.id}"]`)) {
    button.addEventListener('click', () => {
      closeWord();
      trigger = button;
      dialog.showModal();
      dialog.scrollTop = 0;
      button.setAttribute('aria-expanded', 'true');
      if (dialog.id === 'classroom-homework') document.body.classList.add('classroom-homework-open');
    });
  }
  dialog.addEventListener('close', () => {
    document.body.classList.remove('classroom-homework-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({preventScroll:true});
  });
}
for (const button of document.querySelectorAll('[data-classroom-print]')) {
  button.addEventListener('click', () => window.print());
}
