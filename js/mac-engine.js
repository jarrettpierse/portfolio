/**
 * mac-engine.js — Window manager, animations, and UI logic.
 * This file reads from CONTENT (defined in content.js) and
 * builds + wires up the entire desktop UI at runtime.
 * You should not need to edit this file.
 */

/* ============================================================
   BOOTSTRAP — runs after DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyMeta();
  buildMenubar();
  buildDesktop();
  buildModals();
  buildMobileSite();
  buildShutdownWindow();
  buildDontClickWindow();
  buildCVView();
  initWindowManager();
  startClock();
  staggerOpenWindows();
});

/* ============================================================
   META & TITLE
   ============================================================ */
function applyMeta() {
  document.title = CONTENT.site.title;
}

/* ============================================================
   CLOCK
   ============================================================ */
function startClock() {
  function tick() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = (h % 12) || 12;
    const timeStr = `${h12}:${m} ${ampm}`;
    document.querySelectorAll('.js-clock').forEach(el => el.textContent = timeStr);
  }
  tick();
  setInterval(tick, 10000);
}

/* ============================================================
   MENU BAR
   ============================================================ */
function buildMenubar() {
  const bar = document.getElementById('menubar');
  bar.innerHTML = `
    <div class="menu-apple menu-item" id="menu-apple">
      &#63743;
      <div class="dropdown">
        <div class="dropdown-item">About This Mac</div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item">System Preferences…</div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item" onclick="resetWindows()">Reset Windows</div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item">Sleep</div>
        <div class="dropdown-item">Restart…</div>
        <div class="dropdown-item">Shut Down…</div>
      </div>
    </div>
    <div class="menu-item" id="menu-file">
      File
      <div class="dropdown">
        <div class="dropdown-item" onclick="newFinderWindow()">New Finder Window<span class="shortcut">⌘N</span></div>
        <div class="dropdown-item" onclick="newUselessFolder()">New Folder<span class="shortcut">⇧⌘N</span></div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item" onclick="closeFocusedWindow()">Close Window<span class="shortcut">⌘W</span></div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item">Move to Trash<span class="shortcut">⌘⌫</span></div>
      </div>
    </div>
    <div class="menu-item" id="menu-edit">
      Edit
      <div class="dropdown">
        <div class="dropdown-item disabled">Undo<span class="shortcut">⌘Z</span></div>
        <div class="dropdown-item disabled">Redo<span class="shortcut">⇧⌘Z</span></div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item disabled">Cut<span class="shortcut">⌘X</span></div>
        <div class="dropdown-item disabled">Copy<span class="shortcut">⌘C</span></div>
        <div class="dropdown-item disabled">Paste<span class="shortcut">⌘V</span></div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item">Select All<span class="shortcut">⌘A</span></div>
      </div>
    </div>
    <div class="menu-item" id="menu-view">
      View
      <div class="dropdown">
        <div class="dropdown-item">as Icons<span class="shortcut">⌘1</span></div>
        <div class="dropdown-item">as List<span class="shortcut">⌘2</span></div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item">Show Toolbar<span class="shortcut">⌥⌘T</span></div>
        <div class="dropdown-item">Show Status Bar<span class="shortcut">⌘/</span></div>
      </div>
    </div>
    <div class="menu-item" id="menu-go">
      Go
      <div class="dropdown">
        <div class="dropdown-item">Back<span class="shortcut">⌘[</span></div>
        <div class="dropdown-item">Forward<span class="shortcut">⌘]</span></div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item">Home<span class="shortcut">⇧⌘H</span></div>
        <div class="dropdown-item">Desktop<span class="shortcut">⇧⌘D</span></div>
        <div class="dropdown-item">Applications<span class="shortcut">⇧⌘A</span></div>
      </div>
    </div>
    <div class="menu-item" id="menu-window">
      Window
      <div class="dropdown">
        <div class="dropdown-item" onclick="location.reload()">Reset All Windows</div>
        <div class="dropdown-separator"></div>
        <div class="dropdown-item" onclick="openWindow('win-portrait')">Jarrett Pierse</div>
        <div class="dropdown-item" onclick="openWindow('win-about')">About Me</div>
        <div class="dropdown-item" onclick="openWindow('win-work')">Work Experience</div>
        <div class="dropdown-item" onclick="openWindow('win-services')">Services</div>
        <div class="dropdown-item" onclick="openWindow('win-contact')">Contact</div>
        ${CONTENT.paper && CONTENT.paper.enabled ? `<div class="dropdown-item" onclick="openWindow('win-paper')">Research Paper</div>` : ''}
      </div>
    </div>
    <div class="menu-item" id="menu-help">
      Help
      <div class="dropdown">
        <div class="dropdown-item">Mac Help<span class="shortcut">⌘?</span></div>
      </div>
    </div>
    <div id="menubar-right">
      <span class="js-clock"></span>
    </div>
  `;
  initMenuDropdowns();
}

function initMenuDropdowns() {
  let activeMenu = null;

  function closeMenu() {
    if (activeMenu) { activeMenu.classList.remove('active'); activeMenu = null; }
  }

  function openMenu(item) {
    if (activeMenu && activeMenu !== item) activeMenu.classList.remove('active');
    item.classList.add('active');
    activeMenu = item;
  }

  const items = document.querySelectorAll('#menubar .menu-item, #menubar .menu-apple');

  items.forEach(item => {
    // Open menu on mousedown on the top-level label
    item.addEventListener('mousedown', e => {
      // Only react to clicks directly on the menu label, not children in dropdown
      if (e.target.closest('.dropdown')) return;
      e.preventDefault();
      e.stopPropagation();
      if (item.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu(item);
      }
    });

    item.addEventListener('mouseenter', () => {
      if (activeMenu && activeMenu !== item) openMenu(item);
    });
  });

  // Handle dropdown item clicks — use mousedown so it fires before anything closes the menu
  document.addEventListener('mousedown', e => {
    const dropdownItem = e.target.closest('.dropdown-item');
    if (dropdownItem) {
      e.preventDefault();
      e.stopPropagation();
      if (dropdownItem.classList.contains('disabled')) return;
      // Execute the onclick manually if present
      const onclickAttr = dropdownItem.getAttribute('onclick');
      if (onclickAttr) {
        closeMenu();
        // Use setTimeout so the menu visually closes before the action runs
        setTimeout(() => { eval(onclickAttr); }, 10);
      } else {
        closeMenu();
      }
      return;
    }
    // Click outside — close menu
    closeMenu();
  });
}

/* ============================================================
   DESKTOP WINDOWS + ICONS
   ============================================================ */
const WINDOW_DEFS = [
  { id: 'win-portrait', title: '🖼 Jarrett Pierse',    ...CONTENT.layout.portrait },
  { id: 'win-about',    title: '🙋 About Me',          ...CONTENT.layout.about    },
  { id: 'win-work',     title: '💼 Work Experience',   ...CONTENT.layout.work     },
  { id: 'win-services', title: '⚡ Services',           ...CONTENT.layout.services },
];

// Contact window always rendered
WINDOW_DEFS.push({ id: 'win-contact', title: '📬 Get In Touch', ...CONTENT.layout.contact });

// Inject the PDF window only if enabled
if (CONTENT.paper && CONTENT.paper.enabled) {
  WINDOW_DEFS.push({
    id:    'win-paper',
    title: CONTENT.paper.title,
    ...CONTENT.layout.paper,
  });
}

const ICON_DEFS = [
  { id: 'win-portrait', label: 'Jarrett Pierse',   top:  16, svgFn: iconPortrait },
  { id: 'win-about',    label: 'About Me',          top: 108, svgFn: iconAbout    },
  { id: 'win-work',     label: 'Work Experience',   top: 200, svgFn: iconWork     },
  { id: 'win-services', label: 'Services',          top: 292, svgFn: iconServices },
  { id: 'win-contact',  label: 'Contact',           top: 384, svgFn: iconContact  },
];

// Add desktop icon for paper window if enabled
if (CONTENT.paper && CONTENT.paper.enabled) {
  ICON_DEFS.push({ id: 'win-paper', label: 'Research Paper', top: 476, svgFn: iconPaper });
}

function buildDesktop() {
  const desktop = document.getElementById('desktop');

  // Windows
  WINDOW_DEFS.forEach(def => {
    const win = document.createElement('div');
    win.className = 'finder-window';
    win.id = def.id;
    win.style.cssText = `left:${def.left}px; top:${def.top}px; width:${def.w}px; height:${def.h}px;`;
    win.innerHTML = buildWindowShell(def) + buildWindowContent(def.id);
    desktop.appendChild(win);
  });

  // Desktop icons (right column)
  ICON_DEFS.forEach(icon => {
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.style.cssText = `right:16px; top:${icon.top}px;`;
    el.innerHTML = `${icon.svgFn()}<span class="icon-label-desk">${icon.label}</span>`;
    el.addEventListener('click', () => {
      animateOnce(el, 'icon-anim-bounce', 420);
      openWindow(icon.id);
    });
    desktop.appendChild(el);
  });
}

function buildWindowShell(def) {
  return `
    <div class="window-titlebar">
      <div class="win-btn win-btn-close" onclick="closeWindow('${def.id}')"></div>
      <div class="win-btn win-btn-min"   onclick="minimiseWindow('${def.id}')"></div>
      <div class="win-btn win-btn-max"   onclick="maxWindow('${def.id}')"></div>
      <span class="window-title">${def.title}</span>
    </div>
    <div class="window-toolbar">
      <button class="toolbar-btn">◀</button>
      <button class="toolbar-btn">▶</button>
      <div class="toolbar-sep"></div>
      <button class="toolbar-btn">⊞ Icons</button>
      <button class="toolbar-btn">☰ List</button>
    </div>
  `;
}

function buildWindowContent(id) {
  switch (id) {
    case 'win-portrait':  return buildPortraitContent();
    case 'win-about':    return buildAboutContent();
    case 'win-work':     return buildWorkContent();
    case 'win-services': return buildServicesContent();
    case 'win-contact':  return buildContactContent();
    case 'win-paper':    return buildPaperContent();
    default: return '';
  }
}

/* ---- Portrait window ---- */
function buildPortraitContent() {
  const a = CONTENT.about;
  const imgSrc = a.portraitUrl || '';
  const imgEl = imgSrc
    ? `<img src="${imgSrc}" alt="${CONTENT.site.name}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
    : `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#c8c8c8 0%,#a0a0a0 100%);color:#555;font-size:11px;gap:6px;">
         <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
           <circle cx="30" cy="22" r="14" fill="#888"/>
           <ellipse cx="30" cy="52" rx="22" ry="12" fill="#888"/>
         </svg>
         <span>No portrait set</span>
       </div>`;

  return `
    <div class="window-path">Macintosh HD &rsaquo; ${CONTENT.site.name} &rsaquo; headshot.jpeg</div>
    <div class="window-content" style="padding:0;display:block;overflow:hidden;background:#1a1a1a;">
      <div style="width:100%;height:100%;background:#1a1a1a;display:flex;align-items:center;justify-content:center;overflow:hidden;">
        ${imgEl}
      </div>
    </div>
    <div class="window-statusbar" style="background:#2a2a2a;border-top-color:#444;color:#aaa;">
      <span>${CONTENT.site.name} — headshot.jpeg</span>
    </div>
    <div class="resize-handle"></div>
  `;
}

/* ---- About Me ---- */
function buildAboutContent() {
  const a  = CONTENT.about;
  const portrait = a.portraitUrl
    ? `<img src="${a.portraitUrl}" alt="Portrait" />`
    : `<div class="portrait-placeholder">
         <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
           <circle cx="18" cy="13" r="7" fill="#aaa"/>
           <ellipse cx="18" cy="30" rx="12" ry="7" fill="#aaa"/>
         </svg>
         <span style="margin-top:4px;">portrait.jpg</span>
         <span style="font-size:8px;">(click to preview)</span>
       </div>`;

  const skills = a.skills.map(s => `<span style="background:#000;color:#fff;font-size:9px;padding:2px 6px;">${s}</span>`).join('');

  return `
    <div class="window-path">Macintosh HD &rsaquo; Users &rsaquo; ${CONTENT.site.name} &rsaquo; About Me</div>
    <div class="window-content" style="display:block;padding:0;">
      <div class="about-grid">
        <div class="portrait-area">
          <div class="portrait-frame" onclick="openPreview()" title="Click to preview">${portrait}</div>
          <span class="portrait-label">portrait.jpg</span>
          <div class="txt-file-icon" onclick="openAboutTxt()" style="margin-top:6px;">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect x="4" y="2" width="20" height="26" fill="#fffff8" stroke="#888" stroke-width="1" rx="1"/>
              <polygon points="20,2 24,6 20,6" fill="#e8e8e8" stroke="#888" stroke-width="1"/>
              <line x1="7" y1="10" x2="21" y2="10" stroke="#bbb" stroke-width="1"/>
              <line x1="7" y1="13" x2="21" y2="13" stroke="#bbb" stroke-width="1"/>
              <line x1="7" y1="16" x2="18" y2="16" stroke="#bbb" stroke-width="1"/>
              <line x1="7" y1="19" x2="21" y2="19" stroke="#bbb" stroke-width="1"/>
              <text x="5" y="28" font-size="4.5" fill="#555">TXT</text>
            </svg>
            <span>about me.txt</span>
          </div>
        </div>
        <div style="padding-top:4px;font-size:11px;line-height:1.6;color:#333;user-select:text;">
          <div style="font-weight:bold;font-size:13px;margin-bottom:4px;">Hi, I'm ${CONTENT.site.name} 👋</div>
          <div style="font-size:10px;color:#666;margin-bottom:8px;">${a.tagline}</div>
          <p style="margin-bottom:6px;">${a.intro}</p>
          <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">${skills}</div>
        </div>
      </div>
    </div>
    <div class="window-statusbar">
      <span>2 items</span><span>${CONTENT.site.location}</span>
    </div>
    <div class="resize-handle"></div>
  `;
}

/* ---- Work Experience ---- */
function buildWorkContent() {
  const rows = CONTENT.workExperience.map(job => `
    <div class="work-list-item" onclick="openCaseStudy('${job.id}')">
      <svg width="16" height="16" viewBox="0 0 32 32">
        <rect x="4" y="2" width="20" height="26" fill="#fffff8" stroke="#888" stroke-width="1" rx="1"/>
        <polygon points="20,2 24,6 20,6" fill="#e8e8e8" stroke="#888" stroke-width="1"/>
      </svg>
      <div class="work-item-info">
        <div>${job.company}</div>
        <div class="work-item-role">${job.role}</div>
      </div>
      <div class="work-item-date">${job.period}</div>
    </div>
  `).join('');

  return `
    <div class="window-path">Macintosh HD &rsaquo; ${CONTENT.site.name} &rsaquo; Work Experience</div>
    <div class="window-content list-view">
      <div class="list-header">
        <span></span><span>Company</span><span>Role</span><span>Period</span>
      </div>
      ${rows}
    </div>
    <div class="window-statusbar">
      <span>${CONTENT.workExperience.length} items</span>
      <span style="font-size:9px;color:#aaa;">Click to open</span>
    </div>
    <div class="resize-handle"></div>
  `;
}

/* ---- Services ---- */
function buildServicesContent() {
  const cards = CONTENT.services.map((svc, i) => `
    <div class="service-card" onclick="openService(${i})">
      <div class="service-card-icon">${svc.icon}</div>
      <div class="service-card-title">${svc.title}</div>
      <div class="service-card-desc">${svc.desc}</div>
    </div>
  `).join('');

  return `
    <div class="window-path">Macintosh HD &rsaquo; ${CONTENT.site.name} &rsaquo; Services</div>
    <div class="window-content" style="padding:0;display:block;overflow-y:auto;">
      <div class="services-grid">${cards}</div>
    </div>
    <div class="window-statusbar"><span>${CONTENT.services.length} services</span></div>
    <div class="resize-handle"></div>
  `;
}

/* ---- Contact ---- */
function buildContactContent() {
  const contactIcons = {
    Email:    emailSVG(),
    LinkedIn: linkedinSVG(),
    GitHub:   githubSVG(),
    Website:  websiteSVG(),
  };

  const rows = CONTENT.contact.map(c => `
    <div class="contact-row" onclick="window.open('${c.href}', '_blank')">
      <div class="contact-icon-wrap">${contactIcons[c.label] || '🔗'}</div>
      <div class="contact-info">
        <div class="contact-label">${c.label}</div>
        <div class="contact-value">${c.value}</div>
      </div>
      <div class="contact-arrow">›</div>
    </div>
  `).join('');

  return `
    <div class="window-path">Macintosh HD &rsaquo; ${CONTENT.site.name} &rsaquo; Contact</div>
    <div class="window-content" style="display:block;padding:0;">${rows}</div>
    <div class="window-statusbar"><span>${CONTENT.contact.length} items</span></div>
    <div class="resize-handle"></div>
  `;
}

/* ---- Research Paper (PDF iframe) ---- */
function buildPaperContent() {
  const p = CONTENT.paper;
  return `
    <div class="window-path">Macintosh HD &rsaquo; ${CONTENT.site.name} &rsaquo; ${p.title}</div>
    <div class="window-content" style="padding:0;display:block;overflow:hidden;flex:1;position:relative;">
      <iframe
        src="${p.filename}"
        style="width:100%;height:100%;border:none;display:block;background:#525659;"
        title="${p.title}"
      >
        <div style="padding:16px;font-size:11px;color:#555;text-align:center;">
          <p style="margin-bottom:8px;">Your browser cannot display this PDF inline.</p>
          <a href="${p.filename}" target="_blank"
             style="color:#000080;text-decoration:underline;font-weight:bold;">
            Open ${p.filename} in a new tab ↗
          </a>
        </div>
      </iframe>
      <div class="iframe-focus-guard" onmousedown="iframeFocusGuard(event,this)"></div>
    </div>
    <div class="window-statusbar">
      <span>${p.filename}</span>
      <a href="${p.filename}" target="_blank"
         style="color:#000080;text-decoration:underline;font-size:9px;cursor:pointer;">
        Open in new tab ↗
      </a>
    </div>
    <div class="resize-handle"></div>
  `;
}

/* ============================================================
   MODALS
   ============================================================ */
function buildModals() {
  const container = document.getElementById('modals');

  // Portrait Preview
  const portraitContent = CONTENT.about.portraitUrl
    ? `<img class="preview-img" src="${CONTENT.about.portraitUrl}" alt="Portrait" />`
    : `<div class="preview-placeholder">
         <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
           <circle cx="30" cy="22" r="14" fill="#555"/>
           <ellipse cx="30" cy="52" rx="22" ry="12" fill="#555"/>
         </svg>
         <div>headshot.jpeg</div>
         <div style="font-size:9px;margin-top:4px;">Set portraitUrl in content.js to use your photo</div>
       </div>`;

  container.innerHTML = `
    <!-- Portrait Preview -->
    <div class="modal-overlay" id="modal-preview">
      <div class="preview-modal finder-window" id="modal-preview-win" style="left:50%;top:50%;transform:translate(-50%,-50%);">
        <div class="window-titlebar">
          <div class="win-btn win-btn-close" onclick="closeModal('modal-preview')"></div>
          <div class="win-btn win-btn-min"></div><div class="win-btn win-btn-max"></div>
          <span class="window-title">Preview — portrait.jpg</span>
        </div>
        <div class="preview-content">${portraitContent}</div>
        <div class="window-statusbar" style="background:#333;color:#aaa;border-top-color:#555;">
          <span>portrait.jpg — 1 of 1</span><span>100%</span>
        </div>
      </div>
    </div>

    <!-- TextEdit: about me.txt -->
    <div class="modal-overlay" id="modal-txt">
      <div class="textedit-modal finder-window" id="modal-txt-win" style="left:50%;top:50%;transform:translate(-50%,-50%);">
        <div class="window-titlebar">
          <div class="win-btn win-btn-close" onclick="closeModal('modal-txt')"></div>
          <div class="win-btn win-btn-min"></div><div class="win-btn win-btn-max"></div>
          <span class="window-title">TextEdit — about me.txt</span>
        </div>
        <div class="textedit-toolbar">
          <span style="font-family:monospace;font-size:10px;">Plain Text</span>
          <div class="toolbar-sep"></div>
          <span>about me.txt</span>
        </div>
        <div class="textedit-body" id="modal-bio-body"></div>
      </div>
    </div>

    <!-- Case Study -->
    <div class="modal-overlay" id="modal-casestudy">
      <div class="casestudy-modal finder-window" id="modal-cs-win" style="left:50%;top:50%;transform:translate(-50%,-50%);">
        <div class="window-titlebar">
          <div class="win-btn win-btn-close" onclick="closeModal('modal-casestudy')"></div>
          <div class="win-btn win-btn-min"></div><div class="win-btn win-btn-max"></div>
          <span class="window-title" id="cs-title">Case Study</span>
        </div>
        <div class="window-toolbar">
          <button class="toolbar-btn">◀</button><button class="toolbar-btn">▶</button>
          <div class="toolbar-sep"></div>
          <span style="font-size:9px;color:#888;">Work Experience</span>
        </div>
        <div class="window-path" id="cs-path"></div>
        <div class="casestudy-body" id="cs-body"></div>
        <div class="window-statusbar">
          <span id="cs-period"></span>
        </div>
      </div>
    </div>
  `;

  // Populate bio text
  document.getElementById('modal-bio-body').textContent = CONTENT.about.bio;
}

/* ============================================================
   MOBILE SITE
   ============================================================ */
function buildMobileSite() {
  const el = document.getElementById('mobile-site');
  const a  = CONTENT.about;

  const mPortrait = a.portraitUrl
    ? `<img src="${a.portraitUrl}" alt="Portrait" />`
    : `<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
         <circle cx="18" cy="13" r="7" fill="#aaa"/>
         <ellipse cx="18" cy="30" rx="12" ry="7" fill="#aaa"/>
       </svg>
       <span style="margin-top:3px;font-size:7px;">portrait.jpg</span>`;

  const mSkills = a.skills.map(s => `<span class="m-tag">${s}</span>`).join('');

  const mWorkItems = CONTENT.workExperience.map(job => `
    <div class="m-work-item" onclick="mOpenSheet('${job.id}')">
      <svg class="m-work-file" viewBox="0 0 32 32">
        <rect x="4" y="2" width="20" height="26" fill="#fffff8" stroke="#888" stroke-width="1" rx="1"/>
        <polygon points="20,2 24,6 20,6" fill="#e8e8e8" stroke="#888" stroke-width="1"/>
      </svg>
      <div class="m-work-info">
        <div class="m-work-name">${job.company}</div>
        <div class="m-work-role">${job.role}</div>
      </div>
      <div class="m-work-date">${job.period}</div>
      <div class="m-work-arrow">›</div>
    </div>
  `).join('');

  const mServiceCards = CONTENT.services.map(svc => `
    <div class="m-service-card">
      <div class="m-service-icon">${svc.icon}</div>
      <div class="m-service-title">${svc.title}</div>
      <div class="m-service-desc">${svc.desc}</div>
    </div>
  `).join('');

  const mContactItems = CONTENT.contact.map(c => `
    <div class="m-contact-row" onclick="window.open('${c.href}', '_blank')">
      <div>
        <div class="m-contact-label">${c.label}</div>
        <div class="m-contact-value">${c.value}</div>
      </div>
      <div class="m-contact-arrow">›</div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="m-navbar">
      <span class="m-navbar-logo">&#63743;</span>
      <span class="m-navbar-title">${CONTENT.site.name} — Portfolio</span>
      <span class="m-navbar-time js-clock"></span>
    </div>
    <div class="m-page">

      <div class="m-window">
        <div class="m-titlebar">
          <div class="m-tb-btn"></div><div class="m-tb-btn"></div><div class="m-tb-btn"></div>
          <span class="m-tb-title">🙋 About Me</span>
        </div>
        <div class="m-path">Macintosh HD › ${CONTENT.site.name} › About Me</div>
        <div class="m-content">
          <div class="m-about-top">
            <div class="m-portrait">${mPortrait}</div>
            <div>
              <div class="m-name">Hi, I'm ${CONTENT.site.name} 👋</div>
              <div class="m-role">${a.tagline}</div>
            </div>
          </div>
          <p class="m-bio">${a.intro}</p>
          <div class="m-tags">${mSkills}</div>
        </div>
        <div class="m-statusbar"><span>${CONTENT.site.location}</span><span>${CONTENT.site.status}</span></div>
      </div>

      <div class="m-window">
        <div class="m-titlebar">
          <div class="m-tb-btn"></div><div class="m-tb-btn"></div><div class="m-tb-btn"></div>
          <span class="m-tb-title">💼 Work Experience</span>
        </div>
        <div class="m-path">Macintosh HD › ${CONTENT.site.name} › Work Experience</div>
        <div class="m-content">${mWorkItems}</div>
        <div class="m-statusbar"><span>${CONTENT.workExperience.length} items</span><span>Tap to open</span></div>
      </div>

      <div class="m-window">
        <div class="m-titlebar">
          <div class="m-tb-btn"></div><div class="m-tb-btn"></div><div class="m-tb-btn"></div>
          <span class="m-tb-title">⚡ Services</span>
        </div>
        <div class="m-path">Macintosh HD › ${CONTENT.site.name} › Services</div>
        <div class="m-content"><div class="m-services-grid">${mServiceCards}</div></div>
        <div class="m-statusbar"><span>${CONTENT.services.length} services</span></div>
      </div>

      <div class="m-window">
        <div class="m-titlebar">
          <div class="m-tb-btn"></div><div class="m-tb-btn"></div><div class="m-tb-btn"></div>
          <span class="m-tb-title">📬 Get In Touch</span>
        </div>
        <div class="m-path">Macintosh HD › ${CONTENT.site.name} › Contact</div>
        <div class="m-content">${mContactItems}</div>
        <div class="m-statusbar"><span>${CONTENT.contact.length} items</span></div>
      </div>

    </div>

    <!-- Mobile case study sheet -->
    <div class="m-sheet-overlay" id="m-sheet-overlay" onclick="mCloseSheet(event)">
      <div class="m-sheet">
        <div class="m-sheet-handle-bar">
          <div class="m-sheet-close" onclick="mCloseSheet()"></div>
          <span class="m-sheet-title" id="m-sheet-title"></span>
        </div>
        <div class="m-sheet-body" id="m-sheet-body"></div>
        <div class="m-sheet-statusbar" id="m-sheet-status"></div>
      </div>
    </div>
  `;
}

function mOpenSheet(id) {
  const job = CONTENT.workExperience.find(j => j.id === id);
  if (!job) return;
  document.getElementById('m-sheet-title').textContent  = job.company;
  document.getElementById('m-sheet-body').innerHTML     = job.body;
  document.getElementById('m-sheet-status').textContent = job.period + ' · ' + job.role;
  document.getElementById('m-sheet-overlay').classList.add('open');
}

function mCloseSheet(e) {
  if (!e || e.target === document.getElementById('m-sheet-overlay')) {
    document.getElementById('m-sheet-overlay').classList.remove('open');
  }
}

/* ============================================================
   WINDOW MANAGER
   ============================================================ */
let zTop = 200;
const minimised = {};
const maximised = {};

function initWindowManager() {
  document.querySelectorAll('.finder-window').forEach(win => {
    initDrag(win);
    initResize(win);
  });
}

function staggerOpenWindows() {
  const ids = WINDOW_DEFS.map(d => d.id);
  ids.forEach((id, i) => {
    const win = document.getElementById(id);
    if (!win) return;
    win.style.opacity = '0';
    setTimeout(() => {
      win.style.opacity = '1';
      animateOnce(win, 'win-anim-open', 220);
      bringToFront(win);
    }, i * 120);
  });
  setTimeout(() => bringToFront(document.getElementById(ids[0])), ids.length * 120 + 50);
}

function bringToFront(win) {
  zTop++;
  win.style.zIndex = zTop;
  document.querySelectorAll('.finder-window').forEach(w => {
    w.classList.remove('focused');
    // Show iframe guard on all unfocused windows that have one
    const g = w.querySelector('.iframe-focus-guard');
    if (g) g.style.display = 'block';
  });
  win.classList.add('focused');
  // Keep iframe guard visible on focused window — user must click it once
  // to enter PDF interaction mode (iframeFocusGuard handles the second click)
  const tb = win.querySelector('.window-titlebar');
  if (tb) {
    tb.classList.remove('win-anim-focus');
    void tb.offsetWidth;
    tb.classList.add('win-anim-focus');
    setTimeout(() => tb.classList.remove('win-anim-focus'), 300);
  }
}

function iframeFocusGuard(e, guardEl) {
  // First click: bring to front. Guard stays visible so user sees it's focused.
  // Second click on guard: hide it to allow PDF interaction.
  const win = guardEl.closest('.finder-window');
  if (!win) return;
  if (win.classList.contains('focused')) {
    // Already focused — user wants to interact with PDF, hide the guard
    guardEl.style.display = 'none';
  } else {
    bringToFront(win);
    // bringToFront will hide guard on focused win — re-show it so user
    // knows to click again to interact with PDF
    requestAnimationFrame(() => { guardEl.style.display = 'block'; });
  }
}

// Per-element animation timeout map — prevents stale timeouts from
// cancelling a newer animation that started on the same element.
const _animTimers = new WeakMap();

function animateOnce(el, cls, duration, callback) {
  // Cancel any in-flight animation timeout on this element
  if (_animTimers.has(el)) {
    clearTimeout(_animTimers.get(el));
    _animTimers.delete(el);
  }
  el.classList.remove(cls);
  void el.offsetWidth;           // force reflow so animation restarts cleanly
  el.classList.add(cls);
  const tid = setTimeout(() => {
    _animTimers.delete(el);
    el.classList.remove(cls);
    if (callback) callback();
  }, duration);
  _animTimers.set(el, tid);
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  const isHidden = win.style.display === 'none';
  if (minimised[id]) {
    const savedH = minimised[id];
    delete minimised[id];
    win.style.display = '';
    win.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      animateOnce(win, 'win-anim-restore', 230, () => {
        win.style.height = savedH;
        win.style.overflow = '';
      });
    });
  } else if (isHidden) {
    win.style.display = '';
    win.style.overflow = 'hidden';
    animateOnce(win, 'win-anim-restore', 240, () => { win.style.overflow = ''; });
  } else {
    // Already visible — just bring to front with a subtle bounce
    animateOnce(win, 'win-anim-restore', 180);
  }
  bringToFront(win);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  animateOnce(win, 'win-anim-close', 190, () => {
    win.style.display = 'none';
    win.style.transform = '';
  });
}

function minimiseWindow(id) {
  const win = document.getElementById(id);
  if (minimised[id]) {
    const savedH = minimised[id];
    delete minimised[id];
    win.style.height = '21px';
    win.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      animateOnce(win, 'win-anim-restore', 230, () => {
        win.style.height = savedH;
        win.style.overflow = '';
      });
    });
  } else {
    minimised[id] = win.style.height || (win.offsetHeight + 'px');
    win.style.overflow = 'hidden';
    animateOnce(win, 'win-anim-min', 200, () => {
      win.style.height = '21px';
      win.style.transform = '';
      win.style.overflow = '';
    });
  }
}

function maxWindow(id) {
  const win = document.getElementById(id);
  const desktop = document.getElementById('desktop');
  animateOnce(win, 'win-anim-max', 200);
  if (maximised[id]) {
    Object.assign(win.style, maximised[id]);
    delete maximised[id];
  } else {
    maximised[id] = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
    win.style.left = '0px'; win.style.top = '0px';
    win.style.width = desktop.offsetWidth + 'px';
    win.style.height = desktop.offsetHeight + 'px';
  }
}


// ── Menu bar actions ──────────────────────────────────────────────────────────

let finderWindowCount = 0;
let uselessFolderCount = 0;

function newFinderWindow() {
  finderWindowCount++;
  const desktop = document.getElementById('desktop');
  const id = 'win-finder-' + finderWindowCount;
  const win = document.createElement('div');
  win.className = 'finder-window';
  win.id = id;
  const offset = 40 * finderWindowCount;
  win.style.cssText = `left:${120 + offset}px; top:${80 + offset}px; width:460px; height:300px; z-index:100;`;
  win.innerHTML = `
    <div class="window-titlebar">
      <div class="win-btn win-btn-close" onclick="closeWindow('${id}')"></div>
      <div class="win-btn win-btn-min"   onclick="minimiseWindow('${id}')"></div>
      <div class="win-btn win-btn-max"   onclick="maxWindow('${id}')"></div>
      <span class="window-title">Finder</span>
    </div>
    <div class="window-toolbar">
      <button class="toolbar-btn">◀</button>
      <button class="toolbar-btn">▶</button>
      <div class="toolbar-sep"></div>
      <button class="toolbar-btn">⊞ Icons</button>
      <button class="toolbar-btn">☰ List</button>
    </div>
    <div style="padding:32px; text-align:center; color:var(--color-text-muted, #888); font-size:13px; margin-top:40px;">
      <div style="font-size:48px; margin-bottom:12px;">📂</div>
      <div>No items</div>
    </div>
  `;
  desktop.appendChild(win);
  initDrag(win);
  animateOnce(win, 'win-anim-open', 220);
  bringToFront(win);
}

function newUselessFolder() {
  uselessFolderCount++;
  const desktop = document.getElementById('desktop');
  const id = 'folder-useless-' + uselessFolderCount;
  const label = 'Useless Folder ' + uselessFolderCount;

  // Create a desktop icon for the folder
  const el = document.createElement('div');
  el.className = 'desktop-icon';
  el.id = id + '-icon';
  // Stack them near bottom-left of desktop
  const desktopEl = desktop.getBoundingClientRect();
  el.style.cssText = `position:absolute; left:${20 + ((uselessFolderCount - 1) % 5) * 90}px; bottom:${60 + Math.floor((uselessFolderCount - 1) / 5) * 80}px;`;
  el.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="14" width="44" height="30" rx="4" fill="#5ba3f5"/>
      <rect x="2" y="14" width="44" height="30" rx="4" fill="url(#fgrad${uselessFolderCount})"/>
      <path d="M2 18 Q2 14 6 14 L18 14 L22 10 L42 10 Q46 10 46 14 L46 14 L2 14 Z" fill="#7bbcff"/>
      <defs>
        <linearGradient id="fgrad${uselessFolderCount}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7bbcff"/>
          <stop offset="100%" stop-color="#4a90d9"/>
        </linearGradient>
      </defs>
    </svg>
    <span class="icon-label-desk">${label}</span>
  `;
  el.addEventListener('click', () => {
    animateOnce(el, 'icon-anim-bounce', 420);
    openUselessFolderWindow(id, label);
  });
  desktop.appendChild(el);
  animateOnce(el, 'icon-anim-bounce', 420);
}

function openUselessFolderWindow(id, label) {
  const existing = document.getElementById(id + '-win');
  if (existing) {
    openWindow(id + '-win');
    return;
  }
  const desktop = document.getElementById('desktop');
  const win = document.createElement('div');
  win.className = 'finder-window';
  win.id = id + '-win';
  const n = parseInt(id.split('-').pop());
  const offset = 30 * n;
  win.style.cssText = `left:${160 + offset}px; top:${100 + offset}px; width:400px; height:260px; z-index:100;`;
  win.innerHTML = `
    <div class="window-titlebar">
      <div class="win-btn win-btn-close" onclick="closeWindow('${id}-win')"></div>
      <div class="win-btn win-btn-min"   onclick="minimiseWindow('${id}-win')"></div>
      <div class="win-btn win-btn-max"   onclick="maxWindow('${id}-win')"></div>
      <span class="window-title">${label}</span>
    </div>
    <div class="window-toolbar">
      <button class="toolbar-btn">◀</button>
      <button class="toolbar-btn">▶</button>
      <div class="toolbar-sep"></div>
      <button class="toolbar-btn">⊞ Icons</button>
      <button class="toolbar-btn">☰ List</button>
    </div>
    <div style="padding:32px; text-align:center; color:var(--color-text-muted, #888); font-size:13px; margin-top:30px;">
      <div style="font-size:40px; margin-bottom:10px;">🤷</div>
      <div>This folder is completely useless.</div>
    </div>
  `;
  desktop.appendChild(win);
  initDrag(win);
  animateOnce(win, 'win-anim-open', 220);
  bringToFront(win);
}

function closeFocusedWindow() {
  // Find the topmost (highest z-index) visible window
  let topWin = null, topZ = -1;
  document.querySelectorAll('.finder-window').forEach(w => {
    if (w.style.display === 'none') return;
    const z = parseInt(w.style.zIndex || 0);
    if (z > topZ) { topZ = z; topWin = w; }
  });
  if (topWin) closeWindow(topWin.id);
}

// ── End menu bar actions ──────────────────────────────────────────────────────

function resetWindows() {
  WINDOW_DEFS.forEach(def => {
    const win = document.getElementById(def.id);
    if (!win) return;
    win.style.display = '';
    win.style.transform = '';
    win.style.left   = def.left + 'px';
    win.style.top    = def.top  + 'px';
    win.style.width  = def.w   + 'px';
    win.style.height = def.h   + 'px';
    delete minimised[def.id];
    delete maximised[def.id];
    animateOnce(win, 'win-anim-open', 220);
  });
}

function initDrag(win) {
  const titlebar = win.querySelector('.window-titlebar');
  if (!titlebar) return;
  let dragging = false, startX, startY, origLeft, origTop;

  titlebar.addEventListener('mousedown', e => {
    if (e.target.classList.contains('win-btn')) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    origLeft = win.offsetLeft; origTop = win.offsetTop;
    bringToFront(win);
    titlebar.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let newLeft = origLeft + (e.clientX - startX);
    let newTop  = origTop  + (e.clientY - startY);
    if (!win.closest('.modal-overlay')) {
      const desktop = document.getElementById('desktop');
      newLeft = Math.max(0, Math.min(newLeft, desktop.offsetWidth  - win.offsetWidth));
      newTop  = Math.max(0, Math.min(newTop,  desktop.offsetHeight - 30));
    }
    win.style.left = newLeft + 'px';
    win.style.top  = newTop  + 'px';
    win.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; titlebar.style.cursor = 'grab'; }
  });

  win.addEventListener('mousedown', () => bringToFront(win));
}

function initResize(win) {
  const handle = win.querySelector('.resize-handle');
  if (!handle) return;
  let resizing = false, startX, startY, origW, origH;

  handle.addEventListener('mousedown', e => {
    resizing = true;
    startX = e.clientX; startY = e.clientY;
    origW = win.offsetWidth; origH = win.offsetHeight;
    bringToFront(win);
    e.preventDefault(); e.stopPropagation();
  });

  document.addEventListener('mousemove', e => {
    if (!resizing) return;
    win.style.width  = Math.max(280, origW + (e.clientX - startX)) + 'px';
    win.style.height = Math.max(160, origH + (e.clientY - startY)) + 'px';
  });

  document.addEventListener('mouseup', () => { resizing = false; });
}

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
function openModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  overlay.classList.add('visible');
  const inner = overlay.querySelector('.finder-window');
  if (inner) {
    inner.style.left = '50%';
    inner.style.top  = '50%';
    inner.style.transform = 'translate(-50%, -50%)';
    inner.classList.remove('modal-anim-pop');
    void inner.offsetWidth;
    inner.classList.add('modal-anim-pop');
    setTimeout(() => inner.classList.remove('modal-anim-pop'), 250);
    bringToFront(inner);
  }
}

function closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  const inner   = overlay.querySelector('.finder-window');
  if (inner) {
    animateOnce(inner, 'win-anim-close', 180, () => {
      overlay.classList.remove('visible');
      inner.style.transform = 'translate(-50%, -50%)';
    });
  } else {
    overlay.classList.remove('visible');
  }
}

function openPreview()  { openModal('modal-preview'); }
function openAboutTxt() { openModal('modal-txt'); }

function openCaseStudy(id) {
  const job = CONTENT.workExperience.find(j => j.id === id);
  if (!job) return;
  document.getElementById('cs-title').textContent  = job.company + ' — Case Study';
  document.getElementById('cs-path').textContent   = `Macintosh HD › ${CONTENT.site.name} › Work Experience › ${job.company}`;
  document.getElementById('cs-period').textContent = job.period + ' · ' + job.role;
  document.getElementById('cs-body').innerHTML     = job.body;
  openModal('modal-casestudy');
}

function openService(index) {
  const svc = CONTENT.services[index];
  if (svc) alert(svc.detail);
}

/* ============================================================
   SVG ICON HELPERS
   ============================================================ */
function iconPortrait() {
  const src = CONTENT.about.portraitUrl;
  if (src) {
    return `<div style="width:44px;height:44px;border:1.5px solid #888;overflow:hidden;background:#ccc;">
      <img src="${src}" style="width:100%;height:100%;object-fit:cover;" />
    </div>`;
  }
  return `<svg width="44" height="44" viewBox="0 0 44 44">
    <rect width="44" height="44" fill="#c8c8c8"/>
    <circle cx="22" cy="16" r="9" fill="#888"/>
    <ellipse cx="22" cy="38" rx="15" ry="9" fill="#888"/>
  </svg>`;
}

function iconAbout() {
  return `<svg width="44" height="44" viewBox="0 0 44 44">
    <rect x="2" y="14" width="40" height="26" fill="#4a90e2" rx="2"/>
    <rect x="2" y="14" width="18" height="7" fill="#6aaef6" rx="2"/>
    <rect x="2" y="14" width="16" height="5" fill="#8ec5fa" rx="1"/>
    <circle cx="22" cy="24" r="5" fill="white" opacity="0.9"/>
    <ellipse cx="22" cy="35" rx="8" ry="5" fill="white" opacity="0.9"/>
  </svg>`;
}
function iconWork() {
  return `<svg width="44" height="44" viewBox="0 0 44 44">
    <rect x="4" y="16" width="36" height="24" fill="#666" rx="2"/>
    <rect x="14" y="11" width="16" height="7" fill="none" stroke="#555" stroke-width="2.5" rx="2"/>
    <rect x="4" y="26" width="36" height="3" fill="#888"/>
    <rect x="19" y="24" width="6" height="7" fill="#aaa" rx="1"/>
  </svg>`;
}
function iconServices() {
  return `<svg width="44" height="44" viewBox="0 0 44 44">
    <rect x="4" y="4" width="16" height="16" fill="#e8724a" rx="2"/>
    <rect x="24" y="4" width="16" height="16" fill="#4a90e2" rx="2"/>
    <rect x="4" y="24" width="16" height="16" fill="#5cb85c" rx="2"/>
    <rect x="24" y="24" width="16" height="16" fill="#f0ad4e" rx="2"/>
  </svg>`;
}
function iconContact() {
  return `<svg width="44" height="44" viewBox="0 0 44 44">
    <rect x="4" y="10" width="36" height="26" fill="#5ba3f5" rx="3"/>
    <polyline points="4,10 22,26 40,10" fill="none" stroke="white" stroke-width="2.5"/>
    <line x1="4" y1="36" x2="16" y2="22" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <line x1="40" y1="36" x2="28" y2="22" stroke="white" stroke-width="1.5" opacity="0.6"/>
  </svg>`;
}

function iconPaper() {
  return `<svg width="44" height="44" viewBox="0 0 44 44">
    <rect x="6" y="2" width="26" height="34" fill="#fffff8" stroke="#c00" stroke-width="1.5" rx="1"/>
    <polygon points="28,2 32,6 28,6" fill="#f8d0d0" stroke="#c00" stroke-width="1"/>
    <rect x="6" y="2" width="26" height="5" fill="#c00" rx="1"/>
    <line x1="10" y1="14" x2="28" y2="14" stroke="#bbb" stroke-width="1.2"/>
    <line x1="10" y1="18" x2="28" y2="18" stroke="#bbb" stroke-width="1.2"/>
    <line x1="10" y1="22" x2="28" y2="22" stroke="#bbb" stroke-width="1.2"/>
    <line x1="10" y1="26" x2="22" y2="26" stroke="#bbb" stroke-width="1.2"/>
    <text x="7" y="38" font-size="5.5" fill="#c00" font-weight="bold">PDF</text>
    <rect x="28" y="30" width="12" height="12" fill="#c00" rx="2"/>
    <text x="30" y="39" font-size="7" fill="white" font-weight="bold">R</text>
  </svg>`;
}

function emailSVG() {
  return `<svg width="24" height="24" viewBox="0 0 32 32">
    <rect x="2" y="7" width="28" height="20" fill="#4a90d9" rx="2"/>
    <polyline points="2,7 16,19 30,7" fill="none" stroke="white" stroke-width="2"/>
  </svg>`;
}
function linkedinSVG() {
  return `<svg width="24" height="24" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="#0077B5" rx="4"/>
    <rect x="7" y="13" width="4" height="13" fill="white"/>
    <circle cx="9" cy="9" r="2.5" fill="white"/>
    <path d="M14 13 h4 v2 c1-2 3-2.5 5-2.5 c4 0 5 2.5 5 6 v8 h-4 v-7 c0-2-0.5-3.5-2.5-3.5 c-2 0-3 1.5-3 3.5 v7 h-4 z" fill="white"/>
  </svg>`;
}
function githubSVG() {
  return `<svg width="24" height="24" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#24292e"/>
    <path d="M16 4C9.37 4 4 9.37 4 16c0 5.3 3.44 9.8 8.2 11.38c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61c-.55-1.39-1.34-1.76-1.34-1.76c-1.09-.74.08-.73.08-.73c1.2.09 1.84 1.24 1.84 1.24c1.07 1.83 2.8 1.3 3.49.99c.11-.78.42-1.3.76-1.6c-2.67-.3-5.47-1.33-5.47-5.93c0-1.31.47-2.38 1.24-3.22c-.12-.3-.54-1.52.12-3.18c0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4c2.29-1.55 3.3-1.23 3.3-1.23c.66 1.66.24 2.88.12 3.18c.77.84 1.24 1.91 1.24 3.22c0 4.61-2.81 5.63-5.49 5.92c.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C24.56 25.8 28 21.3 28 16C28 9.37 22.63 4 16 4z" fill="white"/>
  </svg>`;
}
function websiteSVG() {
  return `<svg width="24" height="24" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="#fff" stroke="#4a90d9" stroke-width="2"/>
    <ellipse cx="16" cy="16" rx="6" ry="14" fill="none" stroke="#4a90d9" stroke-width="1.5"/>
    <line x1="2" y1="16" x2="30" y2="16" stroke="#4a90d9" stroke-width="1.5"/>
    <path d="M4 10 Q16 13 28 10" fill="none" stroke="#4a90d9" stroke-width="1"/>
    <path d="M4 22 Q16 19 28 22" fill="none" stroke="#4a90d9" stroke-width="1"/>
  </svg>`;
}


/* ============================================================
   DOCK
   ============================================================ */
/* ============================================================
   SHUTDOWN WINDOW + CV VIEW
   ============================================================ */
function buildShutdownWindow() {
  const desktop = document.getElementById('desktop');
  const win = document.createElement('div');
  win.className = 'finder-window';
  win.id = 'win-shutdown';
  win.style.cssText = 'left:50%;top:50%;transform:translate(-50%,-50%);width:260px;height:160px;display:none;z-index:9990;';
  win.innerHTML = `
    <div class="window-titlebar">
      <div class="win-btn win-btn-close" onclick="closeWindow('win-shutdown')"></div>
      <div class="win-btn win-btn-min"></div>
      <div class="win-btn win-btn-max"></div>
      <span class="window-title">Shut Down</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 21px);gap:14px;padding:16px;background:#f0f0f0;">
      <div style="font-size:12px;text-align:center;color:#222;line-height:1.5;">Are you sure you want to<br>shut down this computer?</div>
      <div style="display:flex;gap:10px;">
        <button onclick="closeWindow('win-shutdown')" style="font-family:Geneva,Helvetica,sans-serif;font-size:11px;padding:4px 14px;border:1.5px solid #888;background:#e8e8e8;cursor:pointer;border-radius:3px;">Cancel</button>
        <button onclick="shutDown()" style="font-family:Geneva,Helvetica,sans-serif;font-size:11px;padding:4px 14px;border:1.5px solid #000;background:#000;color:#fff;cursor:pointer;border-radius:3px;font-weight:bold;">Shut Down</button>
      </div>
    </div>
    <div class="resize-handle"></div>
  `;
  desktop.appendChild(win);
  win.addEventListener('mousedown', () => bringToFront(win));
}

function buildDontClickWindow() {
  const desktop = document.getElementById('desktop');
  const win = document.createElement('div');
  win.className = 'finder-window';
  win.id = 'win-dontclick';
  const dc = (CONTENT.layout && CONTENT.layout.dontclick) || { left: 50, top: 780, w: 180, h: 110 };
  win.style.cssText = `left:${dc.left}px; top:${dc.top}px; width:${dc.w}px; height:${dc.h}px; z-index:9985;`;
  win.innerHTML = `
    <div class="window-titlebar">
      <div class="win-btn win-btn-close" onclick="closeWindow('win-dontclick')"></div>
      <div class="win-btn win-btn-min"   onclick="minimiseWindow('win-dontclick')"></div>
      <div class="win-btn win-btn-max"   onclick="maxWindow('win-dontclick')"></div>
      <span class="window-title">⚠️ Warning</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                height:calc(100% - 21px);background:#f8f8f8;gap:10px;padding:12px;">
      <button onclick="shutDown()" style="
        font-family: Geneva, Helvetica, sans-serif;
        font-size: 11px;
        font-weight: bold;
        padding: 7px 16px;
        background: #cc0000;
        color: #fff;
        border: 2px solid #880000;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.35);
        letter-spacing: 0.02em;
        transition: filter 0.1s;
      " onmouseover="this.style.filter='brightness(1.2)'"
         onmouseout="this.style.filter=''"
      >DO NOT CLICK</button>
    </div>
  `;
  desktop.appendChild(win);
  win.addEventListener('mousedown', () => bringToFront(win));
  initDrag(win);
}

function buildCVView() {
  const a = CONTENT.about;
  const work = CONTENT.workExperience;
  const services = CONTENT.services;
  const contact = CONTENT.contact;

  const workHTML = work.map(j => `
    <div class="cv-entry">
      <div class="cv-entry-header">
        <span class="cv-entry-company">${j.company}</span>
        <span class="cv-entry-period">${j.period}</span>
      </div>
      <div class="cv-entry-role">${j.role}</div>
    </div>
  `).join('');

  const servicesHTML = services.map(s => `
    <div class="cv-service">
      <span class="cv-service-title">${s.icon} ${s.title}</span>
      <span class="cv-service-desc">${s.desc}</span>
    </div>
  `).join('');

  const contactHTML = contact.map(c => `
    <div class="cv-contact-row">
      <span class="cv-contact-label">${c.label}:</span>
      <a href="${c.href}" class="cv-contact-val">${c.value}</a>
    </div>
  `).join('');

  const cv = document.createElement('div');
  cv.id = 'cv-view';
  cv.innerHTML = `
    <div class="cv-page">
      <div class="cv-header">
        ${a.portraitUrl ? `<img src="${a.portraitUrl}" class="cv-headshot" alt="${CONTENT.site.name}" />` : ''}
        <div class="cv-name">${CONTENT.site.name.toUpperCase()}</div>
        <div class="cv-tagline">${a.tagline}</div>
        <div class="cv-location">${CONTENT.site.location}</div>
      </div>
      <div class="cv-divider"></div>
      <div class="cv-section">
        <div class="cv-section-title">PROFILE</div>
        <div class="cv-bio">${a.intro}</div>
        <div class="cv-skills">${a.skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}</div>
      </div>
      <div class="cv-divider"></div>
      <div class="cv-section">
        <div class="cv-section-title">EXPERIENCE</div>
        ${workHTML}
      </div>
      <div class="cv-divider"></div>
      <div class="cv-section">
        <div class="cv-section-title">SERVICES</div>
        ${servicesHTML}
      </div>
      <div class="cv-divider"></div>
      <div class="cv-section">
        <div class="cv-section-title">CONTACT</div>
        ${contactHTML}
      </div>
      <div class="cv-footer">
        <button class="cv-restart-btn" onclick="bootUp()">↩ Return to Desktop</button>
      </div>
    </div>
  `;
  document.body.appendChild(cv);
}

function shutDown() {
  closeWindow('win-shutdown');
  const desktop = document.getElementById('desktop');
  const menubar = document.getElementById('menubar');
  const cv = document.getElementById('cv-view');

  // Wait for dialog close animation, then collapse desktop
  setTimeout(() => {
    [desktop, menubar].forEach(el => {
      if (el) el.classList.add('shutdown-collapse');
    });
  }, 220);

  setTimeout(() => {
    [desktop, menubar].forEach(el => {
      if (el) el.style.display = 'none';
    });
    cv.classList.add('cv-visible');
    requestAnimationFrame(() => cv.classList.add('cv-type-reveal'));
  }, 950);
}

function bootUp() {
  const desktop = document.getElementById('desktop');
  const menubar = document.getElementById('menubar');
  const cv = document.getElementById('cv-view');

  cv.classList.remove('cv-visible', 'cv-type-reveal');

  setTimeout(() => {
    [desktop, menubar].forEach(el => {
      if (el) {
        el.style.display = '';
        el.classList.remove('shutdown-collapse');
        el.classList.add('bootup-expand');
        setTimeout(() => el.classList.remove('bootup-expand'), 600);
      }
    });
  }, 200);
}
