// frontend/assets/js/news-list.js
// Renders the news LIST (headlines) with links to article.html

async function renderNewsList() {
  const container = document.getElementById('public-news');
  if (!container) return;

  const news = await sb.get('news');
  const lang = i18n.getLang();

  // Sort newest first
  news.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (news.length === 0) {
    container.innerHTML = '<p style="color:#888;">No news yet.</p>';
    return;
  }

  container.innerHTML = '';

  // Featured article (first one)
  const featured = news[0];
  const featTitle = featured[`title_${lang}`] || featured.title_bi || featured.title_en || '';
  const featCat = featured.category || '';
  const featAuthor = featured.author || '';

  container.innerHTML += `
    <a href="article.html?id=${featured.id}" class="news-featured">
      ${featured.image_url ? `<div class="news-featured-img" style="background-image:url('${featured.image_url}');"></div>` : ''}
      <div class="news-featured-body">
        ${featCat ? `<div class="news-cat">${featCat}</div>` : ''}
        <h2 class="news-featured-title">${featTitle}</h2>
        <div class="news-meta">
          ${featAuthor ? `<span>${featAuthor}</span>` : ''}
          <span>${featured.date}</span>
        </div>
      </div>
    </a>
  `;

  // Rest of the articles
  const rest = news.slice(1);
  if (rest.length > 0) {
    container.innerHTML += '<div class="news-grid">';
    rest.forEach(n => {
      const title = n[`title_${lang}`] || n.title_bi || n.title_en || '';
      const cat = n.category || '';
      const author = n.author || '';

      container.innerHTML += `
        <a href="article.html?id=${n.id}" class="news-card">
          ${n.image_url ? `<div class="news-card-img" style="background-image:url('${n.image_url}');"></div>` : '<div class="news-card-img news-card-img-empty"></div>'}
          <div class="news-card-body">
            ${cat ? `<div class="news-cat">${cat}</div>` : ''}
            <h3 class="news-card-title">${title}</h3>
            <div class="news-meta">
              ${author ? `<span>${author}</span>` : ''}
              <span>${n.date}</span>
            </div>
          </div>
        </a>
      `;
    });
    container.innerHTML += '</div>';
  }
}

window.addEventListener('load', () => {
  setTimeout(renderNewsList, 300);

  if (window.i18n) {
    const originalSetLang = i18n.setLang;
    i18n.setLang = function(lang) {
      originalSetLang(lang);
      renderNewsList();
    };
  }
});