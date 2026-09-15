// frontend/i18n.js
// Language engine for Bislama, English, French

const locales = {};
let currentLang = 'bi';

// Load all 3 locale files
async function loadLocales() {
  const languages = ['bi', 'en', 'fr'];
  for (const lang of languages) {
    const response = await fetch(`/locales/${lang}.json`);
    locales[lang] = await response.json();
  }
}

// Get translation by key path (e.g., "nav.home")
function t(key, lang = currentLang) {
  const keys = key.split('.');
  let value = locales[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

// Get current language
function getLang() {
  return localStorage.getItem('lang') || 'bi';
}

// Set language and update page
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// Initialize on page load
async function initI18n() {
  await loadLocales();
  currentLang = getLang();
  document.documentElement.lang = currentLang;
  applyTranslations();
}

// Export for use in other files
window.i18n = { t, getLang, setLang, initI18n };