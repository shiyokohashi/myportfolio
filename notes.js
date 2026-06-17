/**
 * About me + resume sticky notes — shared across all pages.
 */

let resumePdfUrl = null;
let resumeRendered = false;
let notesInitialized = false;
let portfolioChromeInitialized = false;

const PORTFOLIO_NOTES_HTML = `
<div id="about-note" class="about-note" hidden>
  <button id="about-note-tab" class="about-note-tab" type="button" aria-expanded="false" aria-controls="about-note-panel">
    about me
  </button>
  <div id="about-note-backdrop" class="about-note-backdrop" aria-hidden="true"></div>
  <div
    id="about-note-panel"
    class="about-note-panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="about-note-title"
    aria-hidden="true"
  >
    <button id="about-note-close" class="about-note-close" type="button" aria-label="Close about me">×</button>
    <h2 id="about-note-title" class="about-note-title">about me</h2>
    <div class="about-note-content">
      <img id="about-note-image" class="about-note-image" src="" alt="" hidden />
      <p id="about-note-text" class="about-note-text"></p>
      <div id="about-note-links" class="about-note-links"></div>
    </div>
  </div>
</div>

<div id="resume-note" class="resume-note" hidden>
  <button id="resume-note-tab" class="resume-note-tab" type="button" aria-expanded="false" aria-controls="resume-note-panel">
    resume
  </button>
  <div id="resume-note-backdrop" class="resume-note-backdrop" aria-hidden="true"></div>
  <div
    id="resume-note-panel"
    class="resume-note-panel"
    role="dialog"
    aria-modal="true"
    aria-label="Resume"
    aria-hidden="true"
  >
    <button id="resume-note-close" class="resume-note-close" type="button" aria-label="Close resume">×</button>
    <div id="resume-note-sheet" class="resume-note-sheet">
      <div class="resume-note-page">
        <canvas id="resume-note-canvas"></canvas>
        <div id="resume-note-link-layer" class="resume-note-link-layer"></div>
      </div>
    </div>
  </div>
</div>

<div id="home-note" class="home-note" hidden>
  <a href="index.html?return=1" class="home-note-tab">home</a>
</div>`;

function ensureNotesDom() {
  if (!document.getElementById('about-note')) {
    document.body.insertAdjacentHTML('beforeend', PORTFOLIO_NOTES_HTML);
    return;
  }
  if (!document.getElementById('home-note')) {
    document.body.insertAdjacentHTML('beforeend', `
<div id="home-note" class="home-note" hidden>
  <a href="index.html?return=1" class="home-note-tab">home</a>
</div>`);
  }
}

function closeStickyNote(root) {
  const tab = root.querySelector('[id$="-tab"]');
  const panel = root.querySelector('[id$="-panel"]');
  const backdrop = root.querySelector('[id$="-backdrop"]');

  root.classList.remove('is-open');
  tab?.setAttribute('aria-expanded', 'false');
  panel?.setAttribute('aria-hidden', 'true');
  backdrop?.setAttribute('aria-hidden', 'true');
}

function closeAllStickyNotes() {
  document.querySelectorAll('.about-note, .resume-note').forEach((root) => {
    if (root.classList.contains('is-open')) closeStickyNote(root);
  });
  document.body.style.overflow = '';
}

function bindStickyNote(root, { onOpen } = {}) {
  if (root.dataset.noteBound === 'true') return;

  const tab = root.querySelector('[id$="-tab"]');
  const panel = root.querySelector('[id$="-panel"]');
  const backdrop = root.querySelector('[id$="-backdrop"]');
  const closeBtn = root.querySelector('[id$="-close"]');
  if (!tab || !panel || !backdrop || !closeBtn) return;

  function openStickyNote() {
    closeAllStickyNotes();
    root.classList.add('is-open');
    tab.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    onOpen?.();
    closeBtn.focus();
  }

  function closeNote() {
    closeStickyNote(root);
    if (!document.querySelector('.about-note.is-open, .resume-note.is-open')) {
      document.body.style.overflow = '';
    }
    tab.focus();
  }

  tab.addEventListener('click', openStickyNote);
  closeBtn.addEventListener('click', closeNote);
  backdrop.addEventListener('click', closeNote);
  root.dataset.noteBound = 'true';

  return { openStickyNote, closeNote };
}

function revealNote(root) {
  if (!root) return;
  root.removeAttribute('hidden');
}

function setupAboutNote(data) {
  const about = data.about;
  if (!about?.text) return;

  const root = document.getElementById('about-note');
  const tab = document.getElementById('about-note-tab');
  const title = document.getElementById('about-note-title');
  const text = document.getElementById('about-note-text');
  const image = document.getElementById('about-note-image');
  if (!root || !tab || !title || !text || !image) return;

  title.textContent = about.title || 'about me';
  tab.textContent = about.title || 'about me';
  if (about.intro) {
    text.innerHTML = `<strong>${about.intro}</strong> ${about.text}`;
  } else {
    text.textContent = about.text;
  }

  if (about.image) {
    image.src = about.image;
    image.alt = 'Portrait';
    image.hidden = false;
  } else {
    image.hidden = true;
  }

  populateAboutNoteLinks(data);

  revealNote(root);
  bindStickyNote(root);
}

function setupResumeNote(data) {
  const resume = data.resume;
  if (!resume?.file) return;

  resumePdfUrl = resume.file;
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const root = document.getElementById('resume-note');
  const tab = document.getElementById('resume-note-tab');
  if (!root || !tab) return;

  tab.textContent = resume.title || 'resume';

  revealNote(root);
  bindStickyNote(root, {
    onOpen: () => {
      renderResumeSheet().catch((err) => console.error('Resume render failed:', err));
    },
  });
}

async function renderResumeSheet() {
  if (resumeRendered || !resumePdfUrl || typeof pdfjsLib === 'undefined') return;

  const canvas = document.getElementById('resume-note-canvas');
  const linkLayer = document.getElementById('resume-note-link-layer');
  if (!canvas || !linkLayer) return;

  const displayWidth = Math.min(592, Math.floor(window.innerWidth * 0.8));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const pdf = await pdfjsLib.getDocument(resumePdfUrl).promise;
  const page = await pdf.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = (displayWidth / baseViewport.width) * dpr;
  const viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${viewport.height / dpr}px`;

  await page.render({
    canvasContext: canvas.getContext('2d'),
    viewport,
  }).promise;

  linkLayer.innerHTML = '';
  linkLayer.style.width = canvas.style.width;
  linkLayer.style.height = canvas.style.height;

  const annotations = await page.getAnnotations({ intent: 'display' });
  annotations.forEach((annotation) => {
    if (annotation.subtype !== 'Link') return;

    const url = annotation.url || annotation.unsafeUrl;
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Resume link');

    const [left, top, right, bottom] = viewport.convertToViewportRectangle(annotation.rect);
    link.style.left = `${Math.min(left, right) / dpr}px`;
    link.style.top = `${Math.min(top, bottom) / dpr}px`;
    link.style.width = `${Math.abs(right - left) / dpr}px`;
    link.style.height = `${Math.abs(bottom - top) / dpr}px`;

    linkLayer.appendChild(link);
  });

  resumeRendered = true;
}

function setupHomeTab() {
  if (!document.body.classList.contains('category-page')) return;
  revealNote(document.getElementById('home-note'));
}

function initPortfolioNotes(data) {
  ensureNotesDom();

  if (!notesInitialized) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllStickyNotes();
    });
    notesInitialized = true;
  }

  setupAboutNote(data);
  setupResumeNote(data);
  setupHomeTab();
}

function initPortfolioChrome(data) {
  if (portfolioChromeInitialized) return;
  portfolioChromeInitialized = true;

  try {
    ensureNotesDom();
    setupHomeTab();
    if (typeof populateContact === 'function') populateContact(data);
    initPortfolioNotes(data);
    document.body.classList.add('portfolio-chrome-ready');
  } catch (err) {
    portfolioChromeInitialized = false;
    console.error('Portfolio chrome failed to initialize:', err);
  }
}

let portfolioDataPromise = null;

function fetchPortfolioData() {
  if (!portfolioDataPromise) {
    portfolioDataPromise = fetch(new URL('projects.json', window.location.href))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
  }
  return portfolioDataPromise;
}

async function bootstrapPortfolioChrome() {
  if (!document.body.classList.contains('category-page')) return;

  ensureNotesDom();
  setupHomeTab();

  try {
    initPortfolioChrome(await fetchPortfolioData());
  } catch (err) {
    console.error('Portfolio chrome failed to load:', err);
  }
}

window.initPortfolioNotes = initPortfolioNotes;
window.initPortfolioChrome = initPortfolioChrome;
window.fetchPortfolioData = fetchPortfolioData;
window.ensureNotesDom = ensureNotesDom;
window.setupHomeTab = setupHomeTab;
window.bootstrapPortfolioChrome = bootstrapPortfolioChrome;

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('category-page')) {
    bootstrapPortfolioChrome();
  }
});
