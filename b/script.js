const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results');
const resultCount = document.getElementById('result-count');
const dialog = document.getElementById('details-dialog');
const closeBtn = document.getElementById('dialog-close');

let items = [];
const saved = new Set();
let lastOpener = null;

const heartSvg =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.5 1.1 4.2 2.6h2C13.7 6.1 15.2 5 17.2 5c3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z"/>' +
  '</svg>';

function renderResults() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query)
  );

  resultsList.innerHTML = '';
  matches.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'card';

    const body = document.createElement('div');
    body.className = 'card-body';

    const h3 = document.createElement('h3');
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'card-open';
    openBtn.textContent = item.name;
    openBtn.addEventListener('click', () => openDetails(item, openBtn));
    h3.appendChild(openBtn);

    const brand = document.createElement('p');
    brand.className = 'brand';
    brand.textContent = item.brand;

    body.append(h3, brand);

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.alt;
    img.loading = 'lazy';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'save-btn';
    saveBtn.setAttribute('aria-label', `Save ${item.name}`);
    saveBtn.setAttribute('aria-pressed', String(saved.has(item.id)));
    saveBtn.innerHTML = heartSvg;
    saveBtn.addEventListener('click', () => {
      if (saved.has(item.id)) saved.delete(item.id);
      else saved.add(item.id);
      saveBtn.setAttribute('aria-pressed', String(saved.has(item.id)));
    });

    li.append(body, img, saveBtn);
    resultsList.appendChild(li);
  });

  resultCount.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
}

function openDetails(item, opener) {
  lastOpener = opener;
  document.getElementById('dialog-title').textContent = item.name;
  const img = document.getElementById('dialog-image');
  img.src = item.image;
  img.alt = item.alt;
  document.getElementById('dialog-brand').textContent = item.brand;
  document.getElementById('dialog-year').textContent = item.year;
  document.getElementById('dialog-country').textContent = item.country;
  document.getElementById('dialog-material').textContent = item.material;
  document.getElementById('dialog-description').textContent = item.description;
  dialog.showModal();
  closeBtn.focus();
}

closeBtn.addEventListener('click', () => dialog.close());
// Escape is handled natively by <dialog>; restore focus on any close.
dialog.addEventListener('close', () => {
  if (lastOpener && document.body.contains(lastOpener)) lastOpener.focus();
});

searchInput.addEventListener('input', renderResults);

fetch('items.json')
  .then((res) => {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .then((data) => {
    items = data;
    renderResults();
  })
  .catch(() => {
    resultCount.textContent = 'Could not load handbags. Please try again later.';
  });

/* Sign-up form */
const form = document.getElementById('signup-form');
const formStatus = document.getElementById('form-status');

function setError(field, errorEl, message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
  const targets = field instanceof NodeList || Array.isArray(field) ? field : [field];
  targets.forEach((el) => {
    if (message) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', errorEl.id);
    } else {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    }
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = '';

  const name = form.elements.name;
  const email = form.elements.email;
  const radios = form.querySelectorAll('input[name="style"]');
  const consent = form.elements.consent;
  const firstInvalid = [];

  const nameMsg = name.value.trim() ? '' : 'Error: Enter your name.';
  setError(name, document.getElementById('name-error'), nameMsg);
  if (nameMsg) firstInvalid.push(name);

  let emailMsg = '';
  if (!email.value.trim()) emailMsg = 'Error: Enter your email address.';
  else if (!email.validity.valid) emailMsg = 'Error: Enter an email address like name@example.com.';
  setError(email, document.getElementById('email-error'), emailMsg);
  if (emailMsg) firstInvalid.push(email);

  const styleChosen = [...radios].some((r) => r.checked);
  const styleMsg = styleChosen ? '' : 'Error: Choose a favourite style.';
  setError(radios, document.getElementById('style-error'), styleMsg);
  if (styleMsg) firstInvalid.push(radios[0]);

  const consentMsg = consent.checked ? '' : 'Error: Tick the box to agree to receive emails.';
  setError(consent, document.getElementById('consent-error'), consentMsg);
  if (consentMsg) firstInvalid.push(consent);

  if (firstInvalid.length) {
    firstInvalid[0].focus();
    return;
  }

  form.reset();
  formStatus.textContent = 'Thanks! You are signed up.';
});
