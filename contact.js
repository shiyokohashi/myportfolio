function buildContactLinks(contact = {}) {
  const links = [];

  if (contact.phone) {
    const phone = document.createElement('a');
    phone.href = `tel:${contact.phone.replace(/\D/g, '')}`;
    phone.textContent = contact.phone;
    phone.className = 'contact-link hover:opacity-70 transition-opacity';
    links.push(phone);
  }

  if (contact.email) {
    const email = document.createElement('a');
    email.href = `mailto:${contact.email}`;
    email.textContent = contact.email;
    email.className = 'contact-link hover:opacity-70 transition-opacity';
    links.push(email);
  }

  if (contact.linkedin) {
    const linkedin = document.createElement('a');
    linkedin.href = contact.linkedin;
    linkedin.textContent = 'linkedin';
    linkedin.target = '_blank';
    linkedin.rel = 'noopener noreferrer';
    linkedin.className = 'contact-link hover:opacity-70 transition-opacity';
    links.push(linkedin);
  }

  return links;
}

function populateAboutNoteLinks(data) {
  const { contact } = data;
  const el = document.getElementById('about-note-links');
  if (!el || !contact) return;

  const links = buildContactLinks(contact).filter((link) => {
    const href = link.getAttribute('href') || '';
    return href.startsWith('mailto:') || href.includes('linkedin.com');
  });

  el.innerHTML = '';
  links.forEach((link, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.className = 'contact-sep';
      sep.textContent = '·';
      sep.setAttribute('aria-hidden', 'true');
      el.appendChild(sep);
    }
    el.appendChild(link);
  });
}

function populateContact(data) {
  const { contact } = data;
  if (!contact) return;

  document.getElementById('contact-title')?.remove();

  const links = buildContactLinks(contact);
  const el = document.getElementById('contact-info');
  if (!el) return;
  el.innerHTML = '';
  links.forEach((link, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.className = 'contact-sep';
      sep.textContent = '·';
      sep.setAttribute('aria-hidden', 'true');
      el.appendChild(sep);
    }
    el.appendChild(link);
  });
}
