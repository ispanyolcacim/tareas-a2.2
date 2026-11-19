import { homework, hasTargetStructure } from './homework-data.js';
import { multipleChoice } from './homework-choices.js';

const endpoint = 'https://script.google.com/macros/s/AKfycbw-BwEhVOhO6GkkQHNWJA8LQLMkEGwNCtJ3BXSqik1RnzqZLl4a_a3HmYEoIlJAgY4Wkg/exec';
const assignment = {
  spreadsheetId: '1wziyxdRdIGL7OEq4yRib0i_CaCWJGI14fwDyMKB4abw',
  sheetName: 'A2.2',
  taskColumn: 'H4 – 15-16.Ders',
};

const get = id => document.getElementById(id);
const startName = get('name-sel');
const confirmName = get('cf-sel');
const input = get('translation');
const feedback = get('feedback');
const check = get('check');
const questions = [
  ...homework.map(([prompt, model, patterns]) => ({prompt, model, patterns})),
  ...multipleChoice,
];
const letters = ['A', 'B', 'C', 'D'];
const pointsPerQuestion = 100 / questions.length;
const drafts = homework.map(() => '');
const answers = new Map();
const jumps = [];
let index = 0;
let sending = false;

function show(id) {
  for (const screen of document.querySelectorAll('.screen')) {
    screen.hidden = screen.id !== id;
    screen.classList.toggle('active', !screen.hidden);
  }
  get(id).querySelector('h2')?.focus({preventScroll:true});
  window.scrollTo(0, 0);
}

function showRosterStatus() {
  if (startName.options.length > 1) get('roster-status').hidden = true;
}
new MutationObserver(showRosterStatus).observe(startName, { childList:true });
showRosterStatus();
window.setTimeout(() => {
  if (!get('roster-status').hidden) {
    get('roster-status').textContent = 'Liste açılamadıysa sayfayı yenileyip tekrar dene.';
  }
}, 6500);

function submissionTotals() {
  let correct = 0;
  let wrong = 0;
  let blank = 0;
  let writtenCorrect = 0;
  for (const [i, question] of questions.entries()) {
    const answer = answers.get(i);
    const draft = drafts[i]?.trim();
    if (!answer && !draft) {
      blank++;
    } else if (answer?.correct ?? hasTargetStructure(draft, question.patterns)) {
      correct++;
      if (!question.choices) writtenCorrect++;
    } else {
      wrong++;
    }
  }
  return {correct, wrong, blank, writtenCorrect};
}

function updateProgress() {
  const correct = [...answers.values()].filter(answer => answer.correct).length;
  let answered = 0;
  get('correct').textContent = correct;
  get('incorrect').textContent = answers.size - correct;
  for (const [i, jump] of jumps.entries()) {
    const hasResponse = Boolean(answers.has(i) || drafts[i]?.trim());
    if (hasResponse) answered++;
    jump.dataset.answered = String(hasResponse);
    jump.setAttribute('aria-label', (i + 1) + '. soru' + (hasResponse ? ', yanıtlandı' : ''));
  }
  get('progress').value = answered;
  get('progress-note').textContent = answered + ' / ' + questions.length;
}

function renderWritten({prompt, model}, draft, answer) {
  get('prompt').textContent = prompt;
  input.value = draft;
  input.readOnly = Boolean(answer);
  check.disabled = Boolean(answer);
  feedback.hidden = !answer;
  if (answer) {
    feedback.dataset.match = String(answer.correct);
    get('feedback-status').textContent = answer.correct ? '✓ Hedef fiil yapısı bulundu.' : 'Hedef fiil yapısını örnekle karşılaştır.';
    get('model').textContent = model;
  }
}

function renderChoice(question, answer) {
  const {prompt, context, choices, correct} = question;
  get('choice-prompt').textContent = prompt;
  get('choice-context').textContent = context ?? '';
  get('choice-context').hidden = !context;
  const buttons = choices.map(([option], position) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice mc-option';
    button.dataset.option = position;
    button.disabled = Boolean(answer);
    button.setAttribute('aria-pressed', String(answer?.selection === position));
    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.textContent = letters[position];
    const label = document.createElement('span');
    label.lang = 'es';
    label.textContent = option;
    button.append(letter, label);
    if (answer && (position === correct || position === answer.selection)) {
      const correctOption = position === correct;
      button.classList.add(correctOption ? 'correct' : 'wrong');
      const state = document.createElement('span');
      state.className = 'option-state';
      state.textContent = correctOption ? '✓ Doğru seçenek' : '✗ Seçimin';
      button.append(state);
    }
    return button;
  });
  get('choices').replaceChildren(...buttons);

  const response = get('choice-feedback');
  response.hidden = !answer;
  if (answer) {
    const [solution, explanation] = choices[correct];
    response.dataset.match = String(answer.correct);
    get('choice-status').textContent = (answer.correct ? '✅ Doğru' : '❌ Yanlış') + ' · Seçimin ' + letters[answer.selection];
    get('choice-explanation').textContent = choices[answer.selection][1];
    get('choice-solution-label').textContent = 'Doğru cevap · ' + letters[correct] + '.';
    get('choice-solution-text').textContent = context ? context.replace('___', solution) : solution;
    get('choice-solution-reason').textContent = explanation;
    get('choice-solution-reason').hidden = answer.correct;
  }
}

function renderQuestion(i, focus = false) {
  index = i;
  const question = questions[i];
  const isChoice = Boolean(question.choices);
  const answer = answers.get(i);
  get('question-form').hidden = isChoice;
  get('choice-question').hidden = !isChoice;
  get('section-label').textContent = isChoice ? '2. Bölüm · Çoktan seçmeli' : '1. Bölüm · Yazılı çeviri';
  if (isChoice) renderChoice(question, answer);
  else renderWritten(question, drafts[i], answer);
  get('question-number').textContent = (i + 1) + ' / ' + questions.length;
  get('prev-question').disabled = i === 0;
  get('next-question').disabled = i === questions.length - 1;
  for (const [position, jump] of jumps.entries()) {
    if (position === i) jump.setAttribute('aria-current', 'step');
    else jump.removeAttribute('aria-current');
  }
  if (focus) (isChoice ? get('choice-prompt') : input).focus();
}

get('progress').max = questions.length;
for (const [i, question] of questions.entries()) {
  const jump = document.createElement('button');
  jump.type = 'button';
  jump.textContent = i + 1;
  jump.addEventListener('click', () => renderQuestion(i, true));
  get(question.choices ? 'choice-jumps' : 'written-jumps').append(jump);
  jumps.push(jump);
}

get('start-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!startName.value) return;
  get('student').textContent = startName.value;
  show('sc-quiz');
  updateProgress();
  renderQuestion(index, true);
});
input.addEventListener('input', () => {
  drafts[index] = input.value;
  updateProgress();
});
get('question-form').addEventListener('submit', event => {
  event.preventDefault();
  if (answers.has(index)) return;
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }
  drafts[index] = value;
  answers.set(index, {correct:hasTargetStructure(value, questions[index].patterns)});
  updateProgress();
  renderQuestion(index);
  const forward = get('next-question');
  (forward.disabled ? get('review') : forward).focus();
});
get('choices').addEventListener('click', event => {
  const button = event.target.closest('[data-option]');
  if (!button || answers.has(index)) return;
  const selection = Number(button.dataset.option);
  answers.set(index, {correct:selection === questions[index].correct, selection});
  updateProgress();
  renderQuestion(index);
  get('choice-feedback').focus();
});
get('prev-question').addEventListener('click', () => renderQuestion(index - 1, true));
get('next-question').addEventListener('click', () => renderQuestion(index + 1, true));

get('review').addEventListener('click', () => {
  if (!questions[index].choices) drafts[index] = input.value;
  const {blank} = submissionTotals();
  get('submit-summary').textContent = (questions.length - blank) + ' yanıt değerlendirilecek · ' + blank + ' soru boş';
  get('submission-error').hidden = true;
  confirmName.value = startName.value;
  show('sc-confirm');
});
get('back-to-quiz').addEventListener('click', () => {
  show('sc-quiz');
  renderQuestion(index, true);
});

get('confirm-form').addEventListener('submit', async event => {
  event.preventDefault();
  const name = confirmName.value;
  if (!name || sending) return;
  const submit = get('submit-score');
  const back = get('back-to-quiz');
  const error = get('submission-error');
  sending = true;
  submit.disabled = true;
  back.disabled = true;
  confirmName.disabled = true;
  error.hidden = true;
  submit.textContent = 'Gönderiliyor…';
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const {correct, wrong, blank, writtenCorrect} = submissionTotals();
    const score = Math.round(correct * pointsPerQuestion);
    const timestamp = new Date().toLocaleString('tr-TR', {
      timeZone:'Europe/Istanbul', year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23',
    });
    const formatted = `✅ ${score}/100\n✓${correct} ✗${wrong} · ${blank} boş\n${timestamp}`;
    await fetch(endpoint, {
      method:'POST', mode:'no-cors', signal:controller.signal, headers:{'Content-Type':'text/plain;charset=UTF-8'},
      body:JSON.stringify({...assignment, studentName:name, score, correct, wrong, blank, formatted}),
    });
    get('result-student').textContent = name;
    get('result-score').textContent = score + ' / 100';
    const writtenScore = Math.round(writtenCorrect * pointsPerQuestion);
    get('result-parts').textContent = 'Yazılı çeviri ' + writtenScore + '/50 · Çoktan seçmeli ' + (score - writtenScore) + '/50';
    get('result-detail').textContent = correct + ' doğru · ' + wrong + ' yanlış · ' + blank + ' boş';
    show('sc-result');
  } catch {
    error.textContent = controller.signal.aborted
      ? 'Gönderim zaman aşımına uğradı. Çevirilerin duruyor. Ödev Takip Merkezi’nden sonucu kontrol edebilir veya yeniden deneyebilirsin.'
      : 'Sonuç gönderilemedi. Çevirilerin duruyor, yeniden deneyebilirsin.';
    error.hidden = false;
  } finally {
    window.clearTimeout(timeout);
    sending = false;
    submit.disabled = false;
    back.disabled = false;
    confirmName.disabled = false;
    submit.textContent = '✔ Evet, Teslim Et';
  }
});
