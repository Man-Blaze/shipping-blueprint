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

  // ---- SLIDESHOW ----
  initSlideshow();
});

// SLIDESHOW LOGIC
let currentSlide = 0;
let slideTimer = null;

function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  const dotsContainer = document.getElementById('slide-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    });
  }

  startAutoSlide();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  if (slides.length === 0) return;

  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');

  restartAutoSlide();
}

function slideNext() { goToSlide(currentSlide + 1); }
function slidePrev() { goToSlide(currentSlide - 1); }

function startAutoSlide() {
  slideTimer = setInterval(() => slideNext(), 4000);
}

function restartAutoSlide() {
  clearInterval(slideTimer);
  startAutoSlide();
}