const form = document.querySelector('#request');
const machine = form.elements.namedItem('Техника');
const draft = document.querySelector('#draft');
const draftText = document.querySelector('#draftText');
const draftEmail = document.querySelector('#draftEmail');
const copyStatus = document.querySelector('#copyStatus');

function hideDraft() {
  draft.hidden = true;
  draftText.value = '';
  draftEmail.href = form.action;
  copyStatus.textContent = '';
}

document.querySelectorAll('[data-equipment]').forEach(link => {
  link.addEventListener('click', () => {
    machine.value = link.dataset.equipment;
    hideDraft();
  });
});

form.addEventListener('input', event => {
  if (event.target.matches('input[required]:not([type="checkbox"])')) {
    event.target.setCustomValidity('');
  }
  hideDraft();
});

form.addEventListener('submit', event => {
  event.preventDefault();

  for (const field of form.querySelectorAll('input[required]:not([type="checkbox"])')) {
    field.setCustomValidity(field.value.trim() ? '' : 'Заполните это поле.');
  }
  if (!form.reportValidity()) return;

  const message = ['Заявка на аренду спецтехники — ГРАВИОН', ''];
  for (const [label, value] of new FormData(form)) {
    const text = value.trim();
    if (text) message.push(label + ': ' + text);
  }

  draftText.value = message.join('\n');
  const subject = encodeURIComponent(message[0]);
  const body = encodeURIComponent(message.slice(2).join('\r\n'));
  draftEmail.href = form.action + '?subject=' + subject + '&body=' + body;
  copyStatus.textContent = '';
  draft.hidden = false;
  draftText.focus();
});

document.querySelector('#copyDraft').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draftText.value);
    copyStatus.textContent = 'Текст скопирован. Откройте Telegram и вставьте его в чат.';
  } catch {
    draftText.focus();
    draftText.select();
    copyStatus.textContent = 'Текст выделен. Скопируйте его и вставьте в чат.';
  }
});
