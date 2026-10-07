const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const root = resolve(__dirname, '..');
const html = readFileSync(resolve(root, 'contact.html'), 'utf8');
const script = readFileSync(resolve(root, 'js/main.js'), 'utf8');

function setup(t) {
  const dom = new JSDOM(html, {
    url: 'https://gbl.test/contact.html', runScripts: 'outside-only',
  });
  t.after(() => dom.window.close());
  dom.window.eval(script);
  const document = dom.window.document;
  const form = document.querySelector('[data-contact-form]');
  return { window: dom.window, document, form,
    feedback: form.querySelector('[role="status"]') };
}

function fill(form) {
  form.elements.parent.value = 'Test Parent';
  form.elements.email.value = 'parent@example.com';
  form.elements.message.value = 'Which program is suitable?';
}

function values(form) {
  return Array.from(form.elements, element => element.value);
}

for (const invalid of ['parent', 'email', 'message', 'malformed email']) {
  test(`rejects ${invalid} without clearing entries or showing feedback`, t => {
    const { form, feedback } = setup(t);
    fill(form);
    form.elements[invalid === 'malformed email' ? 'email' : invalid].value =
      invalid === 'malformed email' ? 'not-an-email' : '';
    const before = values(form);
    assert.equal(form.noValidate, false);
    let submitted = false;
    form.addEventListener('submit', () => { submitted = true; });
    form.requestSubmit();
    assert.equal(submitted, false, 'native validation must block submit');
    assert.equal(feedback.classList.contains('is-visible'), false);
    assert.deepEqual(values(form), before);
  });
}

test('submit handler also rejects invalid synthetic submissions', t => {
  const { window, form, feedback } = setup(t);
  form.elements.parent.value = 'Keep this entry';
  const before = values(form);
  const event = new window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(feedback.classList.contains('is-visible'), false);
  assert.deepEqual(values(form), before);
});

test('valid entries show accurate feedback and remain available', t => {
  const { form, feedback } = setup(t);
  fill(form); // Optional phone remains empty.
  const before = values(form);
  form.requestSubmit();
  assert.equal(feedback.classList.contains('is-visible'), true);
  assert.match(feedback.textContent, /has not sent or saved your message/);
  assert.doesNotMatch(feedback.textContent, /recorded locally/);
  assert.deepEqual(values(form), before);
});

for (const eventType of ['input', 'change', 'invalid']) {
  test(`${eventType} clears stale validation feedback`, t => {
    const { window, form, feedback } = setup(t);
    fill(form);
    form.requestSubmit();
    assert.equal(feedback.classList.contains('is-visible'), true);
    form.elements.email.dispatchEvent(new window.Event(eventType, {
      bubbles: eventType !== 'invalid',
    }));
    assert.equal(feedback.classList.contains('is-visible'), false);
  });
}

test('menu label and expanded state track opening and both closing paths', t => {
  const { document } = setup(t);
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  function expectState(open) {
    assert.equal(links.classList.contains('is-open'), open);
    assert.equal(toggle.getAttribute('aria-expanded'), String(open));
    assert.equal(toggle.getAttribute('aria-label'), open ? 'Close menu' : 'Open menu');
  }
  expectState(false);
  toggle.click();
  expectState(true);
  toggle.click();
  expectState(false);
  toggle.click();
  const link = links.querySelector('a');
  link.addEventListener('click', event => event.preventDefault());
  link.click();
  expectState(false);
});
