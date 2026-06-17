/**
 * Portfolio homepage — content from projects.json.
 * Intro: StPageFlip cover open → zoom into white page → reveal homepage.
 */

let pageFlip = null;
let introTimeline = null;
let introFinished = false;

/* ── DOM builders ── */

function getFoldoutItems(data) {
  if (data.foldoutBanner?.items?.length) {
    return data.foldoutBanner.items;
  }

  const projects = (data.projects?.items || []).map((item) => ({
    title: item.title,
    image: item.image,
    link: item.link || data.projects?.seeMore || 'projects.html',
  }));

  const paintings = (data.pages?.artPaintings?.works || []).map((work) => ({
    title: work.title,
    image: work.image,
    link: data.art?.seeMore || 'art-paintings.html',
    wide: work.span === 'wide',
  }));

  return [...projects, ...paintings];
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createFoldoutSlide(item) {
  const slide = document.createElement(item.link ? 'a' : 'div');
  slide.className = 'book-foldout-slide';
  if (item.wide) slide.classList.add('book-foldout-slide--wide');

  if (item.link) {
    slide.href = item.link;
    slide.target = '_blank';
    slide.rel = 'noopener noreferrer';
  }

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    slide.appendChild(img);
  }

  const overlay = document.createElement('div');
  overlay.className = 'book-foldout-slide__overlay';
  overlay.setAttribute('aria-hidden', 'true');

  if (item.title) {
    const title = document.createElement('span');
    title.className = 'book-foldout-slide__title';
    title.textContent = item.title;
    overlay.appendChild(title);
  }

  if (item.description) {
    const desc = document.createElement('span');
    desc.className = 'book-foldout-slide__desc';
    desc.textContent = item.description;
    overlay.appendChild(desc);
  }

  slide.appendChild(overlay);
  return slide;
}

function createFoldoutRow(items) {
  const row = document.createElement('div');
  row.className = 'book-foldout-row';
  items.forEach((item) => row.appendChild(createFoldoutSlide(item)));
  items.forEach((item) => row.appendChild(createFoldoutSlide(item)));
  return row;
}

function syncFoldoutSeams(strip) {
  const book = strip.closest('.book-open');
  if (!book) return;

  const bookWidth = book.clientWidth;
  if (!bookWidth) return;

  const bookStyles = getComputedStyle(book);
  const stripStyles = getComputedStyle(strip);
  const pageLeft = (parseFloat(bookStyles.getPropertyValue('--book-page-left')) / 100) * bookWidth;
  const pageRightInset = (parseFloat(bookStyles.getPropertyValue('--book-page-right')) / 100) * bookWidth;
  const pageRight = bookWidth - pageRightInset;
  const foldoutWidthPct = parseFloat(stripStyles.getPropertyValue('--foldout-width')) / 100;
  const bannerWidth = bookWidth * foldoutWidthPct;
  const bannerLeft = bookWidth * 0.5 - bannerWidth * 0.5;

  const leftSeam = pageLeft - bannerLeft;
  const rightSeam = pageRight - bannerLeft;
  const leftShare = Math.max(0, (leftSeam / bannerWidth) * 100);
  const centerShare = Math.max(0, ((rightSeam - leftSeam) / bannerWidth) * 100);
  const rightShare = Math.max(0, 100 - leftShare - centerShare);

  const segments = [...strip.querySelectorAll('.book-foldout-segment')];
  if (segments[0]) segments[0].style.flex = `0 0 ${leftShare}%`;
  if (segments[1]) segments[1].style.flex = `0 0 ${centerShare}%`;
  if (segments[2]) segments[2].style.flex = `0 0 ${rightShare}%`;
}

function syncFoldoutOffsets(drape) {
  drape.querySelectorAll('.book-foldout-segment').forEach((segment) => {
    const offsetEl = segment.querySelector('.book-foldout-row-offset');
    if (!offsetEl) return;
    offsetEl.style.transform = `translateX(${-segment.offsetLeft}px)`;
  });
}

function initFoldoutWarp(strip) {
  const drape = strip.querySelector('.book-foldout-drape');
  const book = strip.closest('.book-open');
  if (!drape) return;

  const sync = () => {
    syncFoldoutSeams(strip);
    syncFoldoutOffsets(drape);
  };
  sync();

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(sync);
    observer.observe(drape);
    if (book) observer.observe(book);
  } else {
    window.addEventListener('resize', sync);
  }
}

function buildFoldoutStrip(data) {
  const strip = document.createElement('div');
  strip.id = 'book-foldout';
  strip.className = 'book-foldout';
  strip.setAttribute('aria-label', 'Featured projects and paintings');

  const items = getFoldoutItems(data);
  if (!items.length) return strip;

  if (data.foldoutBanner?.speed) {
    strip.style.setProperty('--foldout-duration', `${data.foldoutBanner.speed}s`);
  }

  const shadow = document.createElement('div');
  shadow.className = 'book-foldout-shadow';
  shadow.setAttribute('aria-hidden', 'true');

  const drape = document.createElement('div');
  drape.className = 'book-foldout-drape';

  [
    { side: 'left' },
    { side: 'center' },
    { side: 'right' },
  ].forEach(({ side }) => {
    const segment = document.createElement('div');
    segment.className = `book-foldout-segment book-foldout-segment--${side}`;
    segment.dataset.side = side;

    const offset = document.createElement('div');
    offset.className = 'book-foldout-row-offset';
    offset.appendChild(createFoldoutRow(items));

    segment.appendChild(offset);
    drape.appendChild(segment);
  });

  strip.append(shadow, drape);
  requestAnimationFrame(() => {
    syncFoldoutSeams(strip);
    syncFoldoutOffsets(drape);
  });
  return strip;
}

function populateHeader(data) {
  const { site } = data;
  if (site?.name) {
    const siteName = document.getElementById('site-name');
    if (siteName) siteName.textContent = site.name;
    document.title = `${site.name} — design portfolio`;
  }
  populateContact(data);
}

function initBookPageDate() {
  const dateEl = document.getElementById('book-page-date');
  if (!dateEl) return;

  const now = new Date();
  dateEl.textContent = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now);
  dateEl.dateTime = now.toISOString().slice(0, 10);
}

function renderAll(data) {
  populateHeader(data);
  initBookPageDate();
  const foldoutMount = document.getElementById('book-foldout');
  if (foldoutMount) {
    const strip = buildFoldoutStrip(data);
    foldoutMount.replaceWith(strip);
    initFoldoutWarp(strip);
  }
  initPortfolioNotes(data);
}

/* ── PageFlip ── */

function initPageFlip() {
  return new Promise((resolve) => {
    const bookEl = document.getElementById('sketchbook');
    const pageW = Math.min(520, Math.floor(window.innerWidth * 0.88));
    const pageH = Math.round(pageW * (540 / 400));

    pageFlip = new St.PageFlip(bookEl, {
      width: pageW,
      height: pageH,
      size: 'stretch',
      minWidth: 300,
      maxWidth: 520,
      minHeight: 405,
      maxHeight: 702,
      showCover: true,
      maxShadowOpacity: 0.28,
      flippingTime: 1100,
      drawShadow: true,
      usePortrait: true,
      disableFlipByClick: true,
      useMouseEvents: false,
      mobileScrollSupport: false,
      autoSize: true,
    });

    pageFlip.on('init', () => resolve());
    pageFlip.loadFromHTML(document.querySelectorAll('#sketchbook .page'));
  });
}

async function flipCoverOpen() {
  return new Promise((resolve) => {
    const onState = (e) => {
      if (e.data === 'read') {
        pageFlip.off('changeState', onState);
        resolve();
      }
    };
    pageFlip.on('changeState', onState);
    pageFlip.flipNext('top');

    setTimeout(() => {
      pageFlip.off('changeState', onState);
      resolve();
    }, 1400);
  });
}

function isReturnHomeVisit() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('return') === '1') return true;

  const ref = document.referrer;
  if (!ref) return false;

  try {
    const refUrl = new URL(ref);
    if (refUrl.origin !== window.location.origin) return false;
    return /\/(projects|journalism|art-paintings|art-sketches)\.html(?:$|[?#])/.test(refUrl.pathname);
  } catch {
    return false;
  }
}

function clearReturnHomeParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('return')) return;
  url.searchParams.delete('return');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function gsapTo(target, vars) {
  return new Promise((resolve) => {
    gsap.to(target, { ...vars, onComplete: resolve });
  });
}

/* ── Intro animation ── */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getZoomScale() {
  const book = document.getElementById('sketchbook');
  const rect = book.getBoundingClientRect();
  return Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.25;
}

function finishIntro() {
  if (introFinished) return;
  introFinished = true;

  introTimeline?.kill();
  gsap.killTweensOf('#intro-stage');
  gsap.killTweensOf('#intro-scene');
  gsap.killTweensOf('#page-root');
  gsap.killTweensOf('.page-welcome-text');

  document.getElementById('skip-intro')?.classList.remove('show');

  const scene = document.getElementById('intro-scene');
  const pageRoot = document.getElementById('page-root');

  scene.classList.add('is-done');
  scene.setAttribute('aria-hidden', 'true');
  pageRoot.classList.remove('opacity-0');
  gsap.set(pageRoot, { opacity: 1 });
  clearReturnHomeParam();

  setTimeout(() => {
    pageFlip?.destroy();
    pageFlip = null;
  }, 600);
}

async function runZoomAndReveal() {
  const stage = document.getElementById('intro-stage');
  const scene = document.getElementById('intro-scene');
  const pageRoot = document.getElementById('page-root');
  const zoomScale = getZoomScale();

  gsap.set(stage, { transformPerspective: 1200, transformOrigin: '50% 50%' });

  introTimeline = gsap.timeline({ onComplete: finishIntro });

  // quick beat on the open white page
  introTimeline.to({}, { duration: 0.08 });

  // zoom into white until it fills the screen
  introTimeline.to(scene, {
    backgroundColor: '#ffffff',
    duration: 0.45,
    ease: 'power2.inOut',
  });

  introTimeline.to(
    stage,
    {
      scale: zoomScale,
      duration: 0.95,
      ease: 'power3.inOut',
    },
    '-=0.35'
  );

  introTimeline.to(
    '.page-welcome-text',
    { opacity: 0, duration: 0.95, ease: 'power2.inOut' },
    '<'
  );

  // crossfade to homepage
  introTimeline.to(
    scene,
    { opacity: 0, duration: 0.4, ease: 'power2.inOut' },
    '-=0.25'
  );

  introTimeline.to(
    pageRoot,
    { opacity: 1, duration: 0.4, ease: 'power2.out' },
    '<'
  );
}

async function runIntroSequence() {
  if (prefersReducedMotion()) {
    finishIntro();
    return;
  }

  document.getElementById('skip-intro').classList.add('show');

  await initPageFlip();
  await delay(200);
  await flipCoverOpen();
  await runZoomAndReveal();
}

function bindSkipIntro() {
  document.getElementById('skip-intro').addEventListener('click', finishIntro);
}

async function init() {
  try {
    const res = await fetch('projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderAll(await res.json());
    bindSkipIntro();
    try {
      if (isReturnHomeVisit()) {
        finishIntro();
      } else {
        await runIntroSequence();
      }
    } catch (introErr) {
      console.error('Intro failed:', introErr);
      finishIntro();
    }
  } catch (err) {
    console.error(err);
    document.getElementById('intro-scene')?.classList.add('is-done');
    const pageRoot = document.getElementById('page-root');
    if (pageRoot) {
      pageRoot.classList.remove('opacity-0');
      if (typeof gsap !== 'undefined') gsap.set(pageRoot, { opacity: 1 });
      else pageRoot.style.opacity = '1';
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
