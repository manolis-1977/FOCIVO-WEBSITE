(() => {
  const routeKey = location.pathname.split('/').filter(Boolean).pop() || 'home';
  const supported = new Set(['en','el']);
  const saved = localStorage.getItem('focivo-language');
  let lang = supported.has(saved) ? saved : ((document.documentElement.lang || 'en').toLowerCase().startsWith('el') ? 'el' : 'en');

  const copy = {
    en: {
      skip:'Skip to content',
      navLabel:'Primary navigation',
      about:'About FOCIVO', how:'How it works', features:'Features', learn:'Learn', support:'Support',
      more:'More', ideas:'Help Shape FOCIVO', whatsNew:"What's New", security:'Security', login:'LOGIN', get:'GET FOCIVO', home:'Home',
      note:'This category has been structurally prepared. Final content and category-specific UX will be completed and accepted in its dedicated phase before release.',
      structure:'FOCIVO WEB FOUNDATION', rights:'All rights reserved.',
      routes:{
        about:'About FOCIVO','how-it-works':'How FOCIVO works',features:'FOCIVO Features',learn:'FOCIVO Learn / Academy',support:'FOCIVO Support',ideas:'Help Shape FOCIVO','whats-new':"What's New",security:'Security & Protection','get-focivo':'Get FOCIVO',login:'FOCIVO LOGIN'
      }
    },
    el: {
      skip:'Μετάβαση στο περιεχόμενο',
      navLabel:'Κύρια πλοήγηση',
      about:'Ποιοι είμαστε', how:'Πώς λειτουργεί', features:'Λειτουργίες', learn:'Μάθε το FOCIVO', support:'Υποστήριξη',
      more:'Περισσότερα', ideas:'Βοήθησε να γίνει καλύτερο', whatsNew:'Τι νέο υπάρχει', security:'Ασφάλεια', login:'LOGIN', get:'GET FOCIVO', home:'Αρχική',
      note:'Η δομή της κατηγορίας έχει προετοιμαστεί. Το τελικό περιεχόμενο και η ειδική εμπειρία της κατηγορίας θα ολοκληρωθούν και θα ελεγχθούν στο αντίστοιχο phase πριν από την κυκλοφορία.',
      structure:'FOCIVO WEB FOUNDATION', rights:'Με επιφύλαξη παντός δικαιώματος.',
      routes:{
        about:'Ποιοι είμαστε','how-it-works':'Πώς λειτουργεί το FOCIVO',features:'Λειτουργίες FOCIVO',learn:'Μάθε το FOCIVO / Academy',support:'Υποστήριξη FOCIVO',ideas:'Βοήθησε να γίνει το FOCIVO καλύτερο','whats-new':'Τι νέο υπάρχει',security:'Ασφάλεια & Προστασία','get-focivo':'Απόκτησε το FOCIVO',login:'FOCIVO LOGIN'
      }
    }
  };

  const root = '../';
  const href = key => `${root}${key}/`;
  const navItems = [
    ['about','about'],['how-it-works','how'],['features','features'],['learn','learn'],['support','support']
  ];
  const moreItems = [
    ['ideas','ideas'],['whats-new','whatsNew'],['security','security']
  ];

  function navLink(route, labelKey, extra='') {
    const active = routeKey === route;
    return `<a class="shell-link ${extra} ${active ? 'is-active' : ''}" href="${href(route)}"${active ? ' aria-current="page"' : ''}>${copy[lang][labelKey]}</a>`;
  }

  function renderHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    header.innerHTML = `
      <div class="shell shell-nav-row">
        <a class="shell-brand" href="${root}" aria-label="FOCIVO ${copy[lang].home}"><img src="${root}assets/focivo-symbol.webp" alt="" /><span>FOCIVO</span></a>
        <nav class="shell-desktop-nav" aria-label="${copy[lang].navLabel}">
          ${navItems.map(([r,k]) => navLink(r,k)).join('')}
          <details class="shell-more"><summary>${copy[lang].more}</summary><div class="shell-more-panel">${moreItems.map(([r,k]) => navLink(r,k,'panel-link')).join('')}</div></details>
        </nav>
        <div class="shell-actions">
          <div class="shell-language" role="group" aria-label="Language"><button type="button" data-lang="en" class="${lang==='en'?'is-active':''}">EN</button><span>/</span><button type="button" data-lang="el" class="${lang==='el'?'is-active':''}">ΕΛ</button></div>
          ${navLink('login','login','shell-login')}
          <a class="shell-cta ${routeKey==='get-focivo'?'is-active':''}" href="${href('get-focivo')}">${copy[lang].get}</a>
          <button class="shell-menu-button" type="button" aria-expanded="false" aria-controls="shellMobileNav" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
      <nav class="shell-mobile-nav" id="shellMobileNav" aria-label="${copy[lang].navLabel}">
        <div class="shell shell-mobile-inner">
          ${navItems.concat(moreItems).map(([r,k]) => navLink(r,k)).join('')}
          ${navLink('login','login')}
          <a class="shell-mobile-cta" href="${href('get-focivo')}">${copy[lang].get}</a>
        </div>
      </nav>`;

    header.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
    const menuButton = header.querySelector('.shell-menu-button');
    const mobileNav = header.querySelector('.shell-mobile-nav');
    menuButton?.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      mobileNav?.classList.toggle('is-open', !open);
    });
    header.querySelectorAll('.shell-mobile-nav a').forEach(a => a.addEventListener('click', () => {
      menuButton?.setAttribute('aria-expanded','false');
      mobileNav?.classList.remove('is-open');
    }));
  }

  function renderFooter() {
    const footer = document.getElementById('siteFooter');
    if (!footer) return;
    footer.innerHTML = `
      <div class="shell shell-footer-grid">
        <div class="shell-footer-brand"><img src="${root}assets/focivo-symbol.webp" alt="" /><strong>FOCIVO</strong><span>Focus. Organize. Move forward.</span></div>
        <div class="shell-footer-group"><strong>${copy[lang].features}</strong><a href="${href('how-it-works')}">${copy[lang].how}</a><a href="${href('features')}">${copy[lang].features}</a><a href="${href('learn')}">${copy[lang].learn}</a></div>
        <div class="shell-footer-group"><strong>${copy[lang].support}</strong><a href="${href('support')}">${copy[lang].support}</a><a href="${href('security')}">${copy[lang].security}</a><a href="${href('ideas')}">${copy[lang].ideas}</a></div>
        <div class="shell-footer-group"><strong>FOCIVO</strong><a href="${href('about')}">${copy[lang].about}</a><a href="${href('whats-new')}">${copy[lang].whatsNew}</a><a href="${href('login')}">${copy[lang].login}</a></div>
        <div class="shell-footer-end"><span>© 2026 FOCIVO</span><span>${copy[lang].rights}</span></div>
      </div>`;
  }

  function renderPageCopy() {
    document.documentElement.lang = lang;
    const skip = document.querySelector('.shell-skip');
    if (skip) skip.textContent = copy[lang].skip;
    const kicker = document.querySelector('[data-shell-kicker]');
    const title = document.querySelector('[data-shell-title]');
    const note = document.querySelector('[data-shell-note]');
    if (kicker) kicker.textContent = copy[lang].structure;
    if (title) title.textContent = copy[lang].routes[routeKey] || 'FOCIVO';
    if (note) note.textContent = copy[lang].note;
    document.title = `${copy[lang].routes[routeKey] || 'FOCIVO'} — FOCIVO`;
  }

  function setLanguage(next) {
    if (!supported.has(next) || next === lang) return;
    lang = next;
    localStorage.setItem('focivo-language', lang);
    renderPageCopy();
    renderHeader();
    renderFooter();
  }

  renderPageCopy();
  renderHeader();
  renderFooter();
})();
