const heartSvg =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/>' +
  '</svg>';

let bags = [];
const saved = new Set();
let lastOpener = null;

const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results');
const resultCount = document.getElementById('result-count');
const dialog = document.getElementById('details-dialog');
const closeBtn = document.getElementById('dialog-close');

/* ---------- Search + results ---------- */

function renderResults() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = bags.filter(
    (bag) =>
      bag.name.toLowerCase().includes(query) ||
      bag.brand.toLowerCase().includes(query)
  );

  resultsList.innerHTML = '';
  matches.forEach((bag) => {
    const li = document.createElement('li');
    li.className = 'card';

    const h3 = document.createElement('h3');
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'card-open';
    openBtn.textContent = bag.name;
    openBtn.dataset.id = bag.id;
    openBtn.addEventListener('click', () => openDetails(bag, openBtn));
    h3.appendChild(openBtn);

    const brand = document.createElement('p');
    brand.className = 'card-brand';
    brand.textContent = bag.brand;

    const img = document.createElement('img');
    img.src = bag.image;
    img.alt = bag.alt;
    img.loading = 'lazy';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'save-btn';
    saveBtn.setAttribute('aria-label', `Save ${bag.name}`);
    saveBtn.setAttribute('aria-pressed', String(saved.has(bag.id)));
    saveBtn.innerHTML = heartSvg;
    saveBtn.addEventListener('click', () => {
      if (saved.has(bag.id)) saved.delete(bag.id);
      else saved.add(bag.id);
      saveBtn.setAttribute('aria-pressed', String(saved.has(bag.id)));
    });

    li.append(h3, brand, img, saveBtn);
    resultsList.appendChild(li);
  });

  resultCount.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
}

searchInput.addEventListener('input', renderResults);

/* ---------- Details dialog ---------- */

function openDetails(bag, opener) {
  lastOpener = opener;
  document.getElementById('dialog-title').textContent = bag.name;
  document.getElementById('dialog-brand').textContent = bag.brand;
  document.getElementById('dialog-year').textContent = bag.year;
  document.getElementById('dialog-country').textContent = bag.country;
  document.getElementById('dialog-material').textContent = bag.material;
  document.getElementById('dialog-description').textContent = bag.description;
  const img = document.getElementById('dialog-image');
  img.src = bag.image;
  img.alt = bag.alt;

  dialog.showModal(); // modal <dialog> traps focus and closes on Escape
  closeBtn.focus();
}

closeBtn.addEventListener('click', () => dialog.close());

// Click on the backdrop closes the dialog too
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener('close', () => {
  if (lastOpener && document.body.contains(lastOpener)) {
    lastOpener.focus();
  }
});

/* ---------- Sign-up form ---------- */

const form = document.getElementById('signup-form');
const success = document.getElementById('signup-success');
let triedSubmit = false;

const checks = [
  {
    input: () => document.getElementById('name'),
    error: 'name-error',
    validate: (el) => (el.value.trim() ? '' : 'Please enter your name.'),
  },
  {
    input: () => document.getElementById('email'),
    error: 'email-error',
    validate: (el) => {
      const value = el.value.trim();
      if (!value) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'Please enter a valid email address, for example name@example.com.';
      return '';
    },
  },
  {
    input: () => form.querySelector('input[name="style"]'),
    group: () => form.querySelectorAll('input[name="style"]'),
    error: 'style-error',
    validate: () =>
      form.querySelector('input[name="style"]:checked')
        ? ''
        : 'Please choose your favourite style.',
  },
  {
    input: () => document.getElementById('consent'),
    error: 'consent-error',
    validate: (el) => (el.checked ? '' : 'Please agree to receive emails to sign up.'),
  },
];

function showErrors() {
  let firstInvalid = null;
  checks.forEach((check) => {
    const el = check.input();
    const message = check.validate(el);
    const errorEl = document.getElementById(check.error);
    errorEl.textContent = message;
    errorEl.hidden = !message;

    const targets = check.group ? check.group() : [el];
    targets.forEach((t) => {
      if (message) t.setAttribute('aria-invalid', 'true');
      else t.removeAttribute('aria-invalid');
    });

    if (message && !firstInvalid) firstInvalid = el;
  });
  return firstInvalid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  triedSubmit = true;
  success.textContent = '';

  const firstInvalid = showErrors();
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  success.textContent = 'Thanks! You are signed up.';
  form.reset();
  triedSubmit = false;
});

// After the first submit attempt, update errors as the user fixes them
form.addEventListener('input', () => {
  if (triedSubmit) showErrors();
});
form.addEventListener('change', () => {
  if (triedSubmit) showErrors();
});

/* ---------- Load data ---------- */

fetch('items.json')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    bags = data;
    renderResults();
  })
  .catch(() => {
    resultCount.textContent = 'Could not load the handbags. Please try again later.';
  });
