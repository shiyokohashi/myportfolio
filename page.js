/**
 * Category / inner pages — renders from projects.json.
 * Index pages: set window.PORTFOLIO_PAGE (projects | journalism | artPaintings | artSketches)
 * Detail pages: work.html?section=…&slug=…  (project.html also works for projects)
 */

const PAGE_KEY = window.PORTFOLIO_PAGE;
const WORK_SECTION = window.WORK_SECTION
  || new URLSearchParams(window.location.search).get('section')
  || (/project\.html$/i.test(window.location.pathname) ? 'projects' : null);
const WORK_SLUG = window.WORK_SLUG
  || window.PROJECT_SLUG
  || new URLSearchParams(window.location.search).get('slug');

const WORK_BACK_LINKS = {
  projects: { href: 'projects.html', label: '← projects' },
  journalism: { href: 'journalism.html', label: '← journalism' },
  artPaintings: { href: 'art-paintings.html', label: '← paintings' },
  artSketches: { href: 'art-sketches.html', label: '← sketches' },
};

function findWorkItem(data, section, slug) {
  const page = data.pages?.[section];
  if (!page) return null;
  const items = page.items || page.groups?.flatMap((g) => g.items) || [];
  return items.find((item) => item.slug === slug) || null;
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function populateHeader(data) {
  const { site } = data;
  if (site?.name) {
    const pageLabel = document.querySelector('title')?.textContent?.split(' — ').slice(1).join(' — ') || 'portfolio';
    document.title = `${site.name} — ${pageLabel}`;
  }
  populateContact(data);
}

function createSlideshow(slides, options = {}) {
  const rich = options.rich === true;
  const items = slides.map((slide) => (
    typeof slide === 'string' ? { image: slide } : slide
  ));

  const wrap = document.createElement('div');
  wrap.className = 'slideshow';

  const frame = document.createElement('div');
  frame.className = 'slideshow-frame';

  items.forEach((slide, i) => {
    const img = document.createElement('img');
    img.src = slide.image;
    img.alt = slide.title || '';
    img.loading = i === 0 ? 'eager' : 'lazy';
    if (i === 0) img.classList.add('is-active');
    frame.appendChild(img);
  });

  let index = 0;
  const imgs = () => [...frame.querySelectorAll('img')];

  const caption = document.createElement('div');
  caption.className = rich ? 'slideshow-caption slideshow-caption--rich' : 'slideshow-caption';

  function updateCaption() {
    const slide = items[index];
    caption.textContent = '';
    caption.hidden = !slide?.title && !(rich && slide?.details?.length);

    if (caption.hidden) return;

    if (slide.title) {
      if (slide.link) {
        const a = document.createElement('a');
        a.href = slide.link;
        a.textContent = slide.title;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        caption.appendChild(a);
      } else {
        const title = document.createElement('p');
        title.className = 'slideshow-caption-title';
        title.textContent = slide.title;
        caption.appendChild(title);
      }
    }

    if (rich && slide.details?.length) {
      slide.details.forEach((line) => {
        const p = document.createElement('p');
        p.className = 'slideshow-caption-detail';
        p.textContent = line;
        caption.appendChild(p);
      });
    }
  }

  const controls = document.createElement('div');
  controls.className = 'slideshow-controls';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'slideshow-btn';
  prev.setAttribute('aria-label', 'Previous image');
  prev.textContent = '←';

  const counter = document.createElement('span');
  counter.className = 'slideshow-counter';
  counter.textContent = `1 / ${items.length}`;

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'slideshow-btn';
  next.setAttribute('aria-label', 'Next image');
  next.textContent = '→';

  function show(i) {
    index = (i + items.length) % items.length;
    imgs().forEach((el, n) => el.classList.toggle('is-active', n === index));
    counter.textContent = `${index + 1} / ${items.length}`;
    updateCaption();
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  controls.append(prev, counter, next);
  updateCaption();
  wrap.append(frame, caption, controls);
  return wrap;
}

function createExternalLink(item) {
  const a = document.createElement('a');
  a.href = item.url || item.link;
  a.textContent = item.title;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}

function createLinkRow(links) {
  const row = document.createElement('p');
  row.className = 'journalism-link-row';

  const prefix = document.createElement('span');
  prefix.className = 'journalism-link-row-label';
  prefix.textContent = 'In order: ';
  row.appendChild(prefix);

  links.forEach((item, i) => {
    if (i > 0) {
      row.appendChild(document.createTextNode(', '));
    }
    row.appendChild(createExternalLink(item));
  });

  return row;
}

function renderJournalismEditorial(sectionEl, sec) {
  sectionEl.appendChild(createSlideshow(sec.slides, { rich: true }));
}

function renderFeatureStory(sectionEl, images) {
  const grid = document.createElement('div');
  grid.className = 'journalism-feature-story';

  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Feature story';
    img.loading = 'lazy';
    img.className = `journalism-feature-story-item journalism-feature-story-item--${i + 1}`;
    grid.appendChild(img);
  });

  sectionEl.appendChild(grid);
}

function renderImagePair(sectionEl, images) {
  const pair = document.createElement('div');
  pair.className = 'journalism-image-pair';

  images.forEach((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    pair.appendChild(img);
  });

  sectionEl.appendChild(pair);
}

function renderBanner(sectionEl, sec) {
  if (sec.links?.length) {
    const links = document.createElement('div');
    links.className = 'journalism-banner-links';

    sec.links.forEach((item) => {
      const line = document.createElement('p');
      line.className = 'journalism-banner-link-line';
      line.appendChild(createExternalLink(item));
      links.appendChild(line);
    });

    sectionEl.appendChild(links);
  }

  if (sec.images?.[0]) {
    const img = document.createElement('img');
    img.src = sec.images[0];
    img.alt = sec.links?.map((l) => l.title).join(' ') || '';
    img.loading = 'lazy';
    img.className = 'journalism-banner-image';
    sectionEl.appendChild(img);
  }
}

let workLightboxReady = false;

function ensureWorkLightbox() {
  if (document.getElementById('work-lightbox')) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'work-lightbox';
  lightbox.className = 'work-lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="work-lightbox-backdrop" data-close="true"></div>
    <figure class="work-lightbox-frame" role="dialog" aria-modal="true" aria-label="Expanded image">
      <button type="button" class="work-lightbox-close" aria-label="Close">×</button>
      <img class="work-lightbox-image" src="" alt="" />
      <figcaption class="work-lightbox-caption"></figcaption>
    </figure>`;
  document.body.appendChild(lightbox);

  if (!workLightboxReady) {
    const close = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    lightbox.querySelector('.work-lightbox-close')?.addEventListener('click', close);
    lightbox.querySelector('[data-close]')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hidden) close();
    });
    workLightboxReady = true;
  }
}

function openWorkLightbox({ src, alt, caption }) {
  ensureWorkLightbox();
  const lightbox = document.getElementById('work-lightbox');
  const img = lightbox.querySelector('.work-lightbox-image');
  const cap = lightbox.querySelector('.work-lightbox-caption');

  img.src = src;
  img.alt = alt || '';
  cap.textContent = caption || '';
  cap.hidden = !caption;

  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.work-lightbox-close')?.focus();
}

let paintingViewerReady = false;

function ensurePaintingViewer() {
  if (document.getElementById('painting-viewer')) return;

  const viewer = document.createElement('div');
  viewer.id = 'painting-viewer';
  viewer.className = 'painting-viewer';
  viewer.innerHTML = `
    <div class="painting-viewer-backdrop" data-close="true"></div>
    <div class="painting-viewer-panel" role="dialog" aria-modal="true" aria-label="Expanded painting">
      <button type="button" class="painting-viewer-close" aria-label="Close">×</button>
      <figure class="painting-viewer-figure">
        <img class="painting-viewer-image" src="" alt="" />
        <figcaption class="painting-viewer-caption">
          <div class="painting-viewer-title"></div>
          <div class="painting-viewer-details"></div>
        </figcaption>
      </figure>
    </div>`;
  document.body.appendChild(viewer);

  if (!paintingViewerReady) {
    const close = () => {
      viewer.classList.remove('is-open', 'painting-viewer--wide');
      document.body.style.overflow = '';
    };

    viewer.querySelector('.painting-viewer-close')?.addEventListener('click', close);
    viewer.querySelector('[data-close]')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && viewer.classList.contains('is-open')) close();
    });
    paintingViewerReady = true;
  }
}

function openPaintingViewer({ src, alt, title, details, wide = false }) {
  ensurePaintingViewer();
  const viewer = document.getElementById('painting-viewer');
  const img = viewer.querySelector('.painting-viewer-image');
  const titleEl = viewer.querySelector('.painting-viewer-title');
  const detailsEl = viewer.querySelector('.painting-viewer-details');

  viewer.classList.toggle('painting-viewer--wide', wide);
  img.src = src;
  img.alt = alt || title || '';
  titleEl.textContent = title || '';
  detailsEl.textContent = details || '';
  titleEl.hidden = !title;
  detailsEl.hidden = !details;
  viewer.querySelector('.painting-viewer-caption')?.toggleAttribute('hidden', !title && !details);

  viewer.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  viewer.querySelector('.painting-viewer-close')?.focus();
}

function bindArtFigureExpand(figure, item, isWide, hideCaption = false) {
  const img = figure.querySelector('img');
  if (!img) return;

  figure.classList.add('work-detail-figure--expandable');
  figure.setAttribute('tabindex', '0');
  figure.setAttribute('role', 'button');
  figure.setAttribute('aria-label', hideCaption ? 'Expand image' : `Expand ${item.title}`);

  const open = () => {
    openPaintingViewer({
      src: img.currentSrc || img.src,
      alt: img.alt,
      title: hideCaption ? '' : item.title,
      details: hideCaption ? '' : (item.summary || item.description),
      wide: isWide,
    });
  };

  figure.addEventListener('click', open);
  figure.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}

function createExpandableFigure({ image, title, description }) {
  const figure = document.createElement('figure');
  figure.className = 'project-section-item';
  const label = title || 'image';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'project-section-thumb';
  btn.setAttribute('aria-label', title ? `View ${title}` : 'View image');

  const img = document.createElement('img');
  img.src = image;
  img.alt = title || '';
  img.loading = 'lazy';
  btn.appendChild(img);

  btn.addEventListener('click', () => {
    const caption = title && description
      ? `${title} — ${description}`
      : (title || description || '');
    openWorkLightbox({
      src: image,
      alt: label,
      caption,
    });
  });

  figure.appendChild(btn);

  if (title) {
    const heading = document.createElement('figcaption');
    heading.className = 'project-section-item-title';
    heading.textContent = title;
    figure.appendChild(heading);
  }

  if (description) {
    const p = document.createElement('p');
    p.className = 'project-section-item-desc';
    p.textContent = description;
    figure.appendChild(p);
  }

  return figure;
}

function ensurePdfJs() {
  if (typeof pdfjsLib === 'undefined') return false;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  return true;
}

async function renderProjectPdf(parent, item) {
  const wrap = document.createElement('div');
  wrap.className = 'work-detail-pdf';
  parent.appendChild(wrap);

  if (!item.pdf || !ensurePdfJs()) {
    const fallback = document.createElement('p');
    fallback.className = 'work-detail-pdf-fallback';
    const link = document.createElement('a');
    link.href = item.pdf || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open case study PDF';
    fallback.appendChild(link);
    wrap.appendChild(fallback);
    return;
  }

  let pdfDoc = null;

  async function drawPages() {
    wrap.innerHTML = '';
    if (!pdfDoc) {
      pdfDoc = await pdfjsLib.getDocument(item.pdf).promise;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum += 1) {
      const page = await pdfDoc.getPage(pageNum);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = (displayWidth / baseViewport.width) * dpr;
      const viewport = page.getViewport({ scale });

      const pageEl = document.createElement('div');
      pageEl.className = 'work-detail-pdf-page';

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';

      pageEl.appendChild(canvas);
      wrap.appendChild(pageEl);

      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
      }).promise;
    }
  }

  await drawPages();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawPages().catch((err) => console.error('PDF resize render failed:', err));
    }, 150);
  });
}

function createCaseStudyNote(text) {
  const p = document.createElement('p');
  p.className = 'case-study-note';
  p.textContent = text;
  return p;
}

function createCaseStudyImage(src, alt) {
  const figure = document.createElement('figure');
  figure.className = 'case-study-figure';
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.loading = 'lazy';
  figure.appendChild(img);
  return figure;
}

function renderCaseStudy(parent, item) {
  const wrap = document.createElement('div');
  wrap.className = 'case-study-collage';

  (item.caseStudy || []).forEach((block) => {
    if (block.type === 'feature') {
      const feature = document.createElement('div');
      feature.className = 'case-study-feature';
      if (block.image) {
        feature.appendChild(createCaseStudyImage(block.image, block.alt));
      }
      if (block.note) {
        feature.appendChild(createCaseStudyNote(block.note));
      }
      wrap.appendChild(feature);
      return;
    }

    if (block.type === 'note') {
      wrap.appendChild(createCaseStudyNote(block.text));
      return;
    }

    if (block.type === 'grid-2') {
      const row = document.createElement('div');
      row.className = 'case-study-row';

      block.columns.forEach((col) => {
        const cell = document.createElement('div');
        cell.className = 'case-study-cell';

        (col.notes || []).forEach((text) => {
          cell.appendChild(createCaseStudyNote(text));
        });

        if (col.image) {
          cell.appendChild(createCaseStudyImage(col.image, col.alt));
        }

        (col.notesAfter || []).forEach((text) => {
          cell.appendChild(createCaseStudyNote(text));
        });

        if (col.note) {
          cell.appendChild(createCaseStudyNote(col.note));
        }

        row.appendChild(cell);
      });

      wrap.appendChild(row);
    }
  });

  parent.appendChild(wrap);
}

function renderProjectSections(parent, item) {
  ensureWorkLightbox();

  const wrap = document.createElement('div');
  wrap.className = 'project-sections';

  item.sections.forEach((sec) => {
    const block = document.createElement('section');
    block.className = 'project-section';
    if (sec.variant === 'banner') block.classList.add('project-section--banner');
    if (sec.variant === 'slides') block.classList.add('project-section--slides');

    if (sec.title) {
      const heading = document.createElement('h3');
      heading.className = 'project-section-title';
      heading.textContent = sec.title;
      block.appendChild(heading);
    }

    if (sec.description) {
      const intro = document.createElement('p');
      intro.className = 'project-section-desc';
      intro.textContent = sec.description;
      block.appendChild(intro);
    }

    const grid = document.createElement('div');
    grid.className = 'project-section-grid';

    (sec.items || []).forEach((entry) => {
      grid.appendChild(createExpandableFigure({
        image: entry.image,
        title: entry.title,
        description: entry.description,
      }));
    });

    block.appendChild(grid);
    wrap.appendChild(block);
  });

  parent.appendChild(wrap);
}

function renderArtNav(nav) {
  const el = document.createElement('nav');
  el.className = 'category-nav';
  el.setAttribute('aria-label', 'Art categories');

  nav.forEach((item, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.textContent = '·';
      el.appendChild(sep);
    }
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.active) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
    el.appendChild(a);
  });

  return el;
}

function createCommissionLink(page, email) {
  const commission = page.commission;
  if (!commission || !email) return null;

  const wrap = document.createElement('p');
  wrap.className = 'work-commission';

  const a = document.createElement('a');
  a.className = 'work-commission-link';
  a.href = `mailto:${email}${commission.subject ? `?subject=${encodeURIComponent(commission.subject)}` : ''}`;
  a.textContent = commission.label || 'commission me';
  wrap.appendChild(a);

  return wrap;
}

function renderInlineJournalismBlock(section, item, { showTitle = false } = {}) {
  const block = document.createElement('article');
  block.className = 'work-inline-block';

  if (showTitle && item.title) {
    const h = document.createElement('h3');
    h.className = 'work-inline-title';
    h.textContent = item.title;
    block.appendChild(h);
  }

  if (item.summary && showTitle) {
    const p = document.createElement('p');
    p.className = 'work-inline-summary';
    p.textContent = item.summary;
    block.appendChild(p);
  }

  const content = document.createElement('div');
  content.className = 'work-inline-content';
  appendWorkDetailContent(content, item, 'journalism');
  block.appendChild(content);
  section.appendChild(block);
}

function renderWorkIndex(page, root, { columns = 'auto', sketches = false, contactEmail = '' } = {}) {
  if (page.nav) root.appendChild(renderArtNav(page.nav));

  const header = document.createElement('header');
  header.className = 'work-header';

  const titleRow = document.createElement('div');
  titleRow.className = 'work-title-row';

  const title = document.createElement('h1');
  title.className = 'work-title';
  title.textContent = page.title || 'Projects';
  titleRow.appendChild(title);

  if (page.selectedLabel) {
    const selected = document.createElement('span');
    selected.className = 'work-selected-label';
    selected.textContent = page.selectedLabel;
    titleRow.appendChild(selected);
  }

  header.appendChild(titleRow);

  if (page.subtitle) {
    const subtitle = document.createElement('p');
    subtitle.className = 'work-subtitle';
    subtitle.textContent = page.subtitle;
    header.appendChild(subtitle);
  }

  if (page.countLabel) {
    const count = document.createElement('p');
    count.className = 'work-count';
    count.textContent = page.countLabel;
    header.appendChild(count);
  }

  const groups = page.groups?.length ? page.groups : [{ label: null, items: page.items || [] }];
  const labeledGroups = groups.filter((g) => g.label);

  if (labeledGroups.length > 1) {
    header.appendChild(createWorkSectionJumpNav(labeledGroups));
  } else if (page.commission && contactEmail) {
    const commission = createCommissionLink(page, contactEmail);
    if (commission) {
      commission.classList.add('work-commission--header');
      header.appendChild(commission);
    }
  } else if (page.tagline) {
    const tag = document.createElement('p');
    tag.className = 'work-tagline';
    tag.textContent = page.tagline;
    header.appendChild(tag);
  }

  root.appendChild(header);

  groups.forEach((group, groupIndex) => {
    const sectionId = group.id || (group.label ? slugify(group.label) : null);
    const section = document.createElement('section');
    section.className = 'work-group';
    if (sectionId) {
      section.id = sectionId;
      section.classList.add('work-group--anchored');
    }

    if (group.label) {
      const heading = document.createElement('h2');
      heading.className = 'work-group-title';
      if (sectionId) {
        const jump = document.createElement('a');
        jump.className = 'work-group-title-link';
        jump.href = `#${sectionId}`;
        jump.textContent = group.label;
        heading.appendChild(jump);
      } else {
        heading.textContent = group.label;
      }
      section.appendChild(heading);
    }

    if (group.description) {
      const desc = document.createElement('p');
      desc.className = 'work-group-desc';
      desc.textContent = group.description;
      section.appendChild(desc);
    }

    if (group.inline) {
      const showItemTitles = group.items.length > 1;
      group.items.forEach((item) => {
        renderInlineJournalismBlock(section, item, { showTitle: showItemTitles });
      });
    } else {
      const index = document.createElement('div');
      index.className = columns === 3 ? 'work-index work-index--three' : 'work-index';
      if (groupIndex > 0 || group.label) index.classList.add('work-index--section');
      if (group.cardAspect === 'square') index.classList.add('work-index--square');
      if (sketches) index.classList.add('work-index--sketches');
      index.setAttribute('aria-label', group.label || 'Featured work');

      group.items.forEach((item) => {
        index.appendChild(createWorkCard({
          ...item,
          cardAspect: item.cardAspect || group.cardAspect || (sketches ? 'contain' : undefined),
          containImage: group.containImages,
        }, { hideCaption: sketches }));
      });

      section.appendChild(index);
    }

    root.appendChild(section);
  });
}

function createWorkSectionJumpNav(groups) {
  const nav = document.createElement('nav');
  nav.className = 'work-section-jump';
  nav.setAttribute('aria-label', 'Jump to section');

  groups.forEach((group, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.className = 'work-section-jump-sep';
      sep.textContent = '·';
      sep.setAttribute('aria-hidden', 'true');
      nav.appendChild(sep);
    }

    const id = group.id || slugify(group.label);
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = group.label;
    nav.appendChild(a);
  });

  return nav;
}

function renderProjects(page, root) {
  renderWorkIndex(page, root, { columns: 3 });
}

function renderWorkDetail(item, data, root, section) {
  populateHeader(data);
  document.title = `${data.site?.name || 'portfolio'} — ${item.title}`;

  if (section === 'artPaintings' || section === 'artSketches') {
    root.classList.add('work-page--art');
    if (section === 'artSketches') root.classList.add('work-page--sketches');
  }

  if (item.layout === 'pdf') {
    root.classList.add('work-page--pdf');
  }

  if (item.layout === 'case-study') {
    root.classList.add('work-page--case-study');
  }

  const backInfo = WORK_BACK_LINKS[section] || WORK_BACK_LINKS.projects;
  const back = document.createElement('a');
  back.className = 'back-projects';
  back.href = backInfo.href;
  back.textContent = backInfo.label;
  root.appendChild(back);

  root.appendChild(createWorkDetail(item, section));
}

function renderProjectDetail(project, data, root) {
  renderWorkDetail(project, data, root, 'projects');
}

function createWorkTags(tags) {
  const el = document.createElement('ul');
  el.className = 'work-tags';
  el.setAttribute('aria-label', 'Disciplines');

  tags.forEach((tag) => {
    const li = document.createElement('li');
    li.textContent = tag;
    el.appendChild(li);
  });

  return el;
}

function createWorkCard(item, { hideCaption = false } = {}) {
  const card = document.createElement('a');
  card.className = 'work-card';
  card.href = item.href || `work.html?section=projects&slug=${item.slug}`;

  const media = document.createElement('div');
  media.className = 'work-card-media';
  if (item.cardAspect === 'square') media.classList.add('work-card-media--square');
  if (item.cardAspect === 'landscape') media.classList.add('work-card-media--landscape');
  if (item.cardAspect === 'contain' || item.containImage) media.classList.add('work-card-media--contain');

  const img = document.createElement('img');
  img.src = item.thumbnail || item.images[0];
  img.alt = hideCaption ? '' : item.title;
  img.loading = 'lazy';
  media.appendChild(img);
  card.appendChild(media);

  if (hideCaption) return card;

  const body = document.createElement('div');
  body.className = 'work-card-body';

  const h = document.createElement('h2');
  h.className = 'work-card-title';
  h.textContent = item.title;
  body.appendChild(h);

  if (item.summary) {
    const p = document.createElement('p');
    p.className = 'work-card-summary';
    p.textContent = item.summary;
    body.appendChild(p);
  }

  if (item.tags?.length) body.appendChild(createWorkTags(item.tags));
  card.appendChild(body);

  return card;
}

function createWorkDetail(item, section) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'work-detail';
  sectionEl.id = item.slug;

  if (section === 'artPaintings' || section === 'artSketches') {
    sectionEl.classList.add('work-detail--art');
    if (section === 'artSketches') sectionEl.classList.add('work-detail--sketches');
    const isWide = item.span === 'wide'
      || (item.dimensions && /12\s*[×x]\s*36/.test(item.dimensions));
    if (isWide) sectionEl.classList.add('work-detail--wide');
  }

  if (item.layout === 'pdf') {
    sectionEl.classList.add('work-detail--pdf');
  }

  if (item.layout === 'case-study') {
    sectionEl.classList.add('work-detail--case-study');
  }

  const intro = document.createElement('div');
  intro.className = 'work-detail-intro';

  if (section !== 'artSketches') {
    const h = document.createElement('h2');
    h.className = 'work-detail-title';
    h.textContent = item.title;
    intro.appendChild(h);

    if (item.dateCreated) {
      const date = document.createElement('p');
      date.className = 'work-detail-date';
      date.textContent = item.dateCreated;
      intro.appendChild(date);
    }

    if (item.description) {
      const p = document.createElement('p');
      p.className = 'work-detail-desc';
      p.textContent = item.description;
      intro.appendChild(p);
    }

    if (item.tags?.length) intro.appendChild(createWorkTags(item.tags));
    sectionEl.appendChild(intro);
  }

  appendWorkDetailContent(sectionEl, item, section);
  return sectionEl;
}

function appendWorkDetailContent(section, item, sectionKey) {
  if (item.link?.url) {
    const linked = document.createElement('p');
    linked.className = 'journalism-linked-title';
    linked.appendChild(createExternalLink({ title: item.link.title, url: item.link.url }));
    section.appendChild(linked);
  }

  if (item.details?.length) {
    item.details.forEach((line) => {
      const p = document.createElement('p');
      p.className = 'slideshow-caption-detail';
      p.textContent = line;
      section.appendChild(p);
    });
  }

  if (item.links?.length && !item.layout) {
    const group = document.createElement('div');
    group.className = 'journalism-link-group';

    item.links.forEach((linkItem) => {
      const line = document.createElement('p');
      line.className = 'journalism-link-line';
      line.appendChild(createExternalLink(linkItem));
      group.appendChild(line);
    });

    section.appendChild(group);
  }

  if (item.layout === 'pdf' && item.pdf) {
    renderProjectPdf(section, item).catch((err) => {
      console.error('PDF render failed:', err);
    });
  } else if (item.layout === 'case-study' && item.caseStudy?.length) {
    renderCaseStudy(section, item);
  } else if (item.layout === 'sections' && item.sections?.length) {
    renderProjectSections(section, item);
  } else if (item.layout === 'editorial' && item.slides?.length) {
    renderJournalismEditorial(section, item);
  } else if (item.layout === 'feature-story' && item.images?.length) {
    renderFeatureStory(section, item.images);
  } else if (item.layout === 'pair' && item.images?.length) {
    renderImagePair(section, item.images);
  } else if (item.layout === 'banner') {
    renderBanner(section, item);
  } else if (item.slides?.length) {
    section.appendChild(createSlideshow(item.slides));
  } else if (item.images?.length > 1) {
    const gallery = document.createElement('div');
    gallery.className = 'work-detail-gallery work-detail-gallery--multi';
    const hideCaption = sectionKey === 'artSketches';

    item.images.forEach((src, i) => {
      const figure = document.createElement('figure');
      figure.className = 'work-detail-figure';

      const img = document.createElement('img');
      img.src = src;
      img.alt = hideCaption ? '' : (item.captions?.[i] || item.title);
      img.loading = 'lazy';
      figure.appendChild(img);

      if (!hideCaption && item.captions?.[i]) {
        const figcap = document.createElement('figcaption');
        figcap.className = 'work-detail-caption';
        figcap.textContent = item.captions[i];
        figure.appendChild(figcap);
      }

      if (section.classList.contains('work-detail--art')) {
        bindArtFigureExpand(
          figure,
          item,
          section.classList.contains('work-detail--wide'),
          hideCaption,
        );
      }

      gallery.appendChild(figure);
    });

    section.appendChild(gallery);
  } else if (item.images?.length === 1) {
    const gallery = document.createElement('div');
    gallery.className = 'work-detail-gallery';
    const hideCaption = sectionKey === 'artSketches';

    const figure = document.createElement('figure');
    figure.className = 'work-detail-figure';

    const img = document.createElement('img');
    img.src = item.images[0];
    img.alt = hideCaption ? '' : (item.captions?.[0] || item.title);
    img.loading = 'lazy';
    figure.appendChild(img);

    if (!hideCaption && item.captions?.[0]) {
      const figcap = document.createElement('figcaption');
      figcap.className = 'work-detail-caption';
      figcap.textContent = item.captions[0];
      figure.appendChild(figcap);
    }

    if (section.classList.contains('work-detail--art')) {
      bindArtFigureExpand(
        figure,
        item,
        section.classList.contains('work-detail--wide'),
        hideCaption,
      );
    }

    gallery.appendChild(figure);
    section.appendChild(gallery);
  }

  if (item.links?.length && item.layout && item.layout !== 'banner') {
    const group = document.createElement('div');
    group.className = 'journalism-link-group';

    item.links.forEach((linkItem) => {
      const line = document.createElement('p');
      line.className = 'journalism-link-line';
      line.appendChild(createExternalLink(linkItem));
      group.appendChild(line);
    });

    section.appendChild(group);
  }

  item.linkRows?.forEach((row) => {
    section.appendChild(createLinkRow(row));
  });

  if (sectionKey !== 'artSketches') {
    item.captions?.forEach((cap, i) => {
      if (!cap) return;
      if (item.images?.length === 1 && i === 0) return;
      if (item.images?.length > 1) return;
      const c = document.createElement('p');
      c.className = 'section-caption';
      c.textContent = cap;
      section.appendChild(c);
    });
  }
}

function renderGraphicDesign(page, root) {
  const h = document.createElement('h2');
  h.className = 'section-title';
  h.textContent = 'logo work';
  root.appendChild(h);

  page.blocks.forEach((block) => {
    const el = document.createElement('article');
    el.className = 'category-section process-block';

    block.text.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      el.appendChild(p);
    });

    if (block.images?.length) {
      const imgs = document.createElement('div');
      imgs.className = 'process-images';
      block.images.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        imgs.appendChild(img);
      });
      el.appendChild(imgs);
    }

    root.appendChild(el);
  });
}

function renderPage(data) {
  const page = data.pages?.[PAGE_KEY];
  if (!page) throw new Error(`Unknown page: ${PAGE_KEY}`);

  populateHeader(data);

  const root = document.getElementById('category-content');
  root.innerHTML = '';

  if (PAGE_KEY === 'projects') renderProjects(page, root);
  else if (PAGE_KEY === 'journalism' || PAGE_KEY === 'artPaintings' || PAGE_KEY === 'artSketches') {
    renderWorkIndex(page, root, {
      contactEmail: data.contact?.email,
      ...(PAGE_KEY === 'artSketches' ? { columns: 3, sketches: true } : {}),
    });
  } else if (PAGE_KEY === 'graphicDesign') renderGraphicDesign(page, root);

  const hash = window.location.hash.slice(1);
  if (hash) {
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function isWorkDetailPage() {
  return Boolean(
    WORK_SLUG
    && (WORK_SECTION || /(?:project|work)\.html$/i.test(window.location.pathname))
  );
}

async function init() {
  let data;

  try {
    data = typeof fetchPortfolioData === 'function'
      ? await fetchPortfolioData()
      : await (async () => {
        const res = await fetch(new URL('projects.json', window.location.href));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })();
  } catch (err) {
    console.error(err);
    ensureNotesDom?.();
    setupHomeTab?.();
    const root = document.getElementById('category-content');
    if (root) {
      let detail = err?.message || 'Unknown error';
      if (window.location.protocol === 'file:') {
        detail = 'This page must be served over http:// (e.g. run python3 -m http.server in the project folder). Opening the .html file directly blocks loading projects.json.';
      }
      root.innerHTML = `<p class="text-center text-sm opacity-60 max-w-md mx-auto px-4">Could not load page content. ${detail}</p>`;
    }
    return;
  }

  loadNotesSafely(data);

  const root = document.getElementById('category-content');
  if (!root) return;

  try {
    if (isWorkDetailPage()) {
      root.innerHTML = '';
      const section = WORK_SECTION || 'projects';

      if (!WORK_SLUG) {
        root.innerHTML = '<p class="text-center text-sm opacity-60">Work not found.</p>';
        populateHeader(data);
        return;
      }

      const item = findWorkItem(data, section, WORK_SLUG);
      if (!item) {
        root.innerHTML = '<p class="text-center text-sm opacity-60">Work not found.</p>';
        populateHeader(data);
        return;
      }

      renderWorkDetail(item, data, root, section);
      return;
    }

    if (!PAGE_KEY) return;

    renderPage(data);
  } catch (err) {
    console.error(err);
    root.innerHTML = '<p class="text-center text-sm opacity-60">Could not load page content.</p>';
  }
}

function loadNotesSafely(data) {
  try {
    if (typeof initPortfolioChrome === 'function') {
      initPortfolioChrome(data);
    } else {
      initPortfolioNotes(data);
    }
  } catch (err) {
    console.error('Sticky notes failed to initialize:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
