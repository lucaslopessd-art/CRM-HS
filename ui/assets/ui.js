// Lightweight shell + Netlify Identity + theme toggle
export function renderShell({ active = 'home', content = '' } = {}) {
  const app = document.getElementById('app');
  if (!app) return;

  const nav = [
    { id:'home',       icon:'bi-grid',         label:'Início',         href:'/index.html' },
    { id:'pipeline',   icon:'bi-kanban',       label:'Pipeline',       href:'/pipeline.html' },
    { id:'agenda',     icon:'bi-calendar2-check', label:'Agenda',     href:'/agenda.html' },
    { id:'dashboard',  icon:'bi-graph-up',     label:'Dashboard',      href:'/painel.html' },
    { id:'config',     icon:'bi-gear',         label:'Configurações',  href:'/configurações.html' },
  ];

  // Theme
  const THEME_KEY = 'hscrm_theme';
  function setTheme(t) { document.documentElement.setAttribute('data-bs-theme', t); localStorage.setItem(THEME_KEY, t); }
  setTheme(localStorage.getItem(THEME_KEY) || 'dark');
  const themeBtn = `
    <button id="themeToggle" class="btn btn-sm btn-outline-secondary">
      <i class="bi bi-moon-stars" id="themeIcon"></i>
    </button>`;

  // Identity
  const idBtn = `
    <div class="d-flex align-items-center gap-2">
      <span id="who" class="text-body-secondary small"></span>
      <button id="loginBtn"  class="btn btn-sm btn-primary">Entrar</button>
      <button id="logoutBtn" class="btn btn-sm btn-outline-secondary d-none">Sair</button>
    </div>`;

  const sidebarLinks = nav.map(i =>
    `<a class="nav-link ${active===i.id?'active':''}" href="${i.href}">
       <i class="bi ${i.icon}"></i><span>${i.label}</span>
     </a>`
  ).join('');

  app.innerHTML = `
  <header class="app-topbar">
    <nav class="navbar container-fluid">
      <div class="d-flex align-items-center gap-3">
        <span class="navbar-brand mb-0 h1">HS CRM</span>
        <span class="text-body-secondary small d-none d-md-inline">v0.1</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        ${themeBtn}
        ${idBtn}
      </div>
    </nav>
  </header>

  <div class="app-layout">
    <aside class="app-sidebar p-3">
      <div class="mb-2 text-uppercase small text-body-secondary">Menu</div>
      <nav class="nav flex-column">
        ${sidebarLinks}
      </nav>
    </aside>

    <main class="app-main">
      <div class="app-content container-fluid">
        ${content}
      </div>
    </main>
  </div>
  `;

  // Theme toggle behaviour
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-bs-theme') || 'dark';
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  // Netlify Identity (optional)
  try {
    const IDENTITY_URL = `${location.origin}/.netlify/identity`;
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init({ APIUrl: IDENTITY_URL });

      const who = document.getElementById('who');
      const loginBtn = document.getElementById('loginBtn');
      const logoutBtn = document.getElementById('logoutBtn');

      function sync(user) {
        if (user) {
          who.textContent = user.email || user.user_metadata?.full_name || 'Logado';
          loginBtn.classList.add('d-none');
          logoutBtn.classList.remove('d-none');
        } else {
          who.textContent = '';
          loginBtn.classList.remove('d-none');
          logoutBtn.classList.add('d-none');
        }
      }

      sync(window.netlifyIdentity.currentUser());

      window.netlifyIdentity.on('login', user => { sync(user); });
      window.netlifyIdentity.on('logout', () => { sync(null); });

      loginBtn?.addEventListener('click', () => window.netlifyIdentity.open('login'));
      logoutBtn?.addEventListener('click', () => window.netlifyIdentity.logout());
    }
  } catch {}
}

