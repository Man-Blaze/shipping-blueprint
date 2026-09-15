// frontend/assets/js/public-data.js
// Reads data from Supabase and renders on public pages

// ---- SETTINGS ----
async function renderCompanyName() {
  const rows = await sb.get('settings');
  const s = rows[0] || { name: 'Example Shipping Co' };

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

// ---- SCHEDULE ----
async function renderScheduleTable() {
  const table = document.getElementById('public-schedule');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  const trips = await sb.get('schedule');
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

// ---- LIVE BOARD ----
async function renderLiveBoard() {
  const container = document.getElementById('public-live');
  if (!container) return;

  const vessels = await sb.get('live');
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

// ---- NEWS ----
async function renderNews() {
  const container = document.getElementById('public-news');
  if (!container) return;

  const news = await sb.get('news');
  const lang = i18n.getLang();

  container.innerHTML = '';
  news.forEach(n => {
    const title = n[`title_${lang}`] || n.title_bi || n.title_en || '';
    const body = n[`body_${lang}`] || n.body_bi || n.body_en || '';
    container.innerHTML += `
      <article style="border-bottom: 1px solid #e0e4e8; padding-bottom: 16px; margin-bottom: 16px;">
        <h3 style="color:#003366;">${title}</h3>
        <p style="color:#666; font-size:13px;">${n.date}</p>
        <p>${body}</p>
      </article>
    `;
  });
}

// ---- JOBS ----
async function renderJobs() {
  const container = document.getElementById('public-jobs');
  if (!container) return;

  const jobs = await sb.get('jobs');
  const lang = i18n.getLang();

  container.innerHTML = '';
  jobs.forEach(j => {
    const title = j[`title_${lang}`] || j.title_bi || j.title_en || '';
    const reqs = (j[`req_${lang}`] || j.req_bi || j.req_en || '').split('\n').filter(Boolean);

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

// ---- RENDER ALL ----
async function renderAll() {
  await Promise.all([
    renderCompanyName(),
    renderScheduleTable(),
    renderLiveBoard(),
    renderNews(),
    renderJobs()
  ]);
}

window.addEventListener('load', renderAll);

if (window.i18n) {
  const originalSetLang = i18n.setLang;
  i18n.setLang = function(lang) {
    originalSetLang(lang);
    renderAll();
  };
}