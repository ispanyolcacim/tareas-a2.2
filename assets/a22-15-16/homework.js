import { homework, hasTargetStructure } from './homework-data.js';

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

function countCorrect() {
  return [...answers.values()].filter(Boolean).length;
}

function submissionTotals() {
  let correct = 0;
  let wrong = 0;
  let blank = 0;
  for (const [i, draft] of drafts.entries()) {
    if (!draft.trim()) {
      blank++;
    } else {
      const matched = answers.get(i) ?? hasTargetStructure(draft, homework[i][2]);
      if (matched) correct++;
      else wrong++;
    }
  }
  return {correct, wrong, blank};
}

function updateProgress() {
  const correct = countCorrect();
  get('correct').textContent = correct;
  get('incorrect').textContent = answers.size - correct;
  get('progress').value = answers.size;
  get('progress-note').textContent = answers.size + ' / ' + homework.length;
  for (const [i, jump] of jumps.entries()) {
    jump.dataset.checked = String(answers.has(i));
    jump.setAttribute('aria-label', (i + 1) + '. soru' + (answers.has(i) ? ', kontrol edildi' : ''));
  }
}

function renderQuestion(i, focus = false) {
  index = i;
  const [prompt, model] = homework[i];
  get('prompt').textContent = prompt;
  input.value = drafts[i];
  input.readOnly = answers.has(i);
  check.disabled = answers.has(i);
  feedback.hidden = !answers.has(i);
  if (!feedback.hidden) {
    const matched = answers.get(i);
    feedback.dataset.match = String(matched);
    get('feedback-status').textContent = matched ? '✓ Hedef fiil yapısı bulundu.' : 'Hedef fiil yapısını örnekle karşılaştır.';
    get('model').textContent = model;
  }
  get('question-number').textContent = (i + 1) + ' / ' + homework.length;
  get('prev-question').disabled = i === 0;
  get('next-question').disabled = i === homework.length - 1;
  for (const [position, jump] of jumps.entries()) {
    if (position === i) jump.setAttribute('aria-current', 'step');
    else jump.removeAttribute('aria-current');
  }
  if (focus) input.focus();
}

for (const [i] of homework.entries()) {
  const jump = document.createElement('button');
  jump.type = 'button';
  jump.textContent = i + 1;
  jump.addEventListener('click', () => renderQuestion(i, true));
  get('jump-buttons').append(jump);
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
input.addEventListener('input', () => { drafts[index] = input.value; });
get('question-form').addEventListener('submit', event => {
  event.preventDefault();
  if (answers.has(index)) return;
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }
  drafts[index] = value;
  answers.set(index, hasTargetStructure(value, homework[index][2]));
  updateProgress();
  renderQuestion(index);
  const forward = get('next-question');
  (forward.disabled ? get('review') : forward).focus();
});
get('prev-question').addEventListener('click', () => renderQuestion(index - 1, true));
get('next-question').addEventListener('click', () => renderQuestion(index + 1, true));

get('review').addEventListener('click', () => {
  drafts[index] = input.value;
  const {blank} = submissionTotals();
  get('submit-summary').textContent = (homework.length - blank) + ' yanıt değerlendirilecek · ' + blank + ' soru boş';
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
    const {correct, wrong, blank} = submissionTotals();
    const score = Math.round(correct / homework.length * 100);
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
    get('result-detail').textContent = correct + ' doğru hedef yapı · ' + wrong + ' farklı yapı · ' + blank + ' boş';
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
