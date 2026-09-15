// frontend/assets/js/app.js

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.initI18n();

  function updateLangButtons() {
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === i18n.getLang());
    });
  }

  updateLangButtons();

  const originalSetLang = i18n.setLang;
  i18n.setLang = function(lang) {
    originalSetLang(lang);
    updateLangButtons();
  };
});