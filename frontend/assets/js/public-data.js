// frontend/assets/js/public-data.js
// Reads admin data from localStorage and renders on public pages

function getAdminData(key, fallback) {
  const raw = localStorage.getItem('admin_' + key);
  return raw ? JSON.parse(raw) : fallback;
}

// Render company name everywhere
function renderCompanyName() {
  const s = getAdminData('settings', { name: 'Example Shipping Co' });
  document.querySelectorAll('.company-name').forEach(el => el.textContent = s.name);
  document.querySelectorAll('.footer-copyright').forEach(el => el.textContent = '© 2026 ' + s.name);
  document.querySelectorAll('.footer-phone').forEach(el => el.textContent = '📞 ' + (s.phone || ''));
  document.querySelectorAll('.footer-email').forEach(el => el.textContent = '✉️ ' + (s.email || ''));
  document.querySelectorAll('.footer-address').forEach(el => el.textContent = s.address || '');
  document.querySelectorAll('.contact-address').forEach(el => el.textContent = s.address || '');
  document.querySelectorAll('.contact-phone').forEach(el => el.textContent = s.phone || '');
  document.querySelectorAll('.contact-email').forEach(el => el.textContent = s.email || '');
  document.querySelectorAll('.contact-facebook').forEach(el => el.textContent = s.facebook || '');
}
// Render schedule table
function renderScheduleTable() {
  const table = document.getElementById('public-schedule');
  if (!table) return;

  const trips = getAdminData('schedule', []);
  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  const lang = i18n.getLang();
  const statusLabel = {
    'on-time': { bi: 'On taem', en: 'On time', fr: 'À l\'heure' },
    'delayed': { bi: 'I leit', en: 'Delayed', fr: 'Retardé' },
    'cancelled': { bi: 'I kansel', en: 'Cancelled', fr: 'Annulé' }
  };

  tbody.innerHTML = '';
  trips.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.vessel}</td>
        <td>${t.from}</td>
        <td>${t.to}</td>
        <td>${t.departure}</td>
        <td><span class="status ${t.status}">${statusLabel[t.status][lang]}</span></td>
      </tr>
    `;
  });
}

// Render live board
function renderLiveBoard() {
  const container = document.getElementById('public-live');
  if (!container) return;

  const vessels = getAdminData('live', []);
  container.innerHTML = '';

  vessels.forEach(v => {
    container.innerHTML += `
      <div class="route-card">
        <h3>🚢 ${v.name}</h3>
        <p><strong>Status:</strong> ${v.status}</p>
        <p><strong>Location:</strong> ${v.location}</p>
        <p><strong>Next:</strong> ${v.next}</p>
        <p><strong>Dinghy:</strong> ${v.dinghy}</p>
      </div>
    `;
  });
}

// Render news
function renderNews() {
  const container = document.getElementById('public-news');
  if (!container) return;

  const news = getAdminData('news', []);
  const lang = i18n.getLang();

  container.innerHTML = '';
  news.forEach(n => {
    const title = n.title[lang] || n.title.bi || n.title.en || '';
    const body = n.body[lang] || n.body.bi || n.body.en || '';
    container.innerHTML += `
      <article style="border-bottom: 1px solid #e0e4e8; padding-bottom: 16px; margin-bottom: 16px;">
        <h3 style="color:#003366;">${title}</h3>
        <p style="color:#666; font-size:13px;">${n.date}</p>
        <p>${body}</p>
      </article>
    `;
  });
}

// Render jobs
function renderJobs() {
  const container = document.getElementById('public-jobs');
  if (!container) return;

  const jobs = getAdminData('jobs', []);
  const lang = i18n.getLang();

  container.innerHTML = '';
  jobs.forEach(j => {
    const title = j.title[lang] || j.title.bi || j.title.en || '';
    const reqs = (j.req[lang] || j.req.bi || j.req.en || '').split('\n').filter(Boolean);

    container.innerHTML += `
      <div class="route-card">
        <h3>${title}</h3>
        <p><strong>Requirements:</strong></p>
        <ul style="margin-left:20px; font-size:14px;">
          ${reqs.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <p style="margin-top:12px;"><strong>Location:</strong> ${j.location || '—'}</p>
      </div>
    `;
  });
}

// Wait for i18n then render
window.addEventListener('load', () => {
  renderCompanyName();
  renderScheduleTable();
  renderLiveBoard();
  renderNews();
  renderJobs();
});

if (window.i18n) {
  const originalSetLang = i18n.setLang;
  i18n.setLang = function(lang) {
    originalSetLang(lang);
    renderCompanyName();
    renderScheduleTable();
    renderLiveBoard();
    renderNews();
    renderJobs();
  };
}