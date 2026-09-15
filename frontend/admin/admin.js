// frontend/admin/admin.js

// ---- AUTH ----
function checkAuth() {
  if (localStorage.getItem('admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('admin_logged_in');
  window.location.href = 'login.html';
}

// ---- DATA (localStorage for now) ----
function getData(key, fallback = []) {
  const raw = localStorage.getItem('admin_' + key);
  return raw ? JSON.parse(raw) : fallback;
}

function saveData(key, value) {
  localStorage.setItem('admin_' + key, JSON.stringify(value));
}

// ---- LANGUAGE TABS ----
function initLangTabs() {
  document.querySelectorAll('.lang-tabs').forEach(tabs => {
    tabs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        const parent = tabs.parentElement;

        // Deactivate all tabs in this group
        tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all panes, show selected
        parent.querySelectorAll('.lang-pane').forEach(p => p.classList.remove('active'));
        parent.querySelector(`.lang-pane[data-lang="${lang}"]`).classList.add('active');
      });
    });
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.requireAuth === 'true') {
    checkAuth();
  }
  initLangTabs();
});