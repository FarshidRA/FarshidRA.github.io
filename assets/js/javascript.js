async function fetchNews() {
  try {
    const response = await fetch('https://rss.dw.com/rdf/rss-en-all');
    const text = await response.text();

    // تبدیل RSS به XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // دریافت تمام عناصر <item>
    const items = xmlDoc.getElementsByTagName('item');
    const newsContainer = document.getElementById('news-container');

    // ایجاد لیست اخبار
    let newsHtml = '';
    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName('title')[0].textContent;
      const link = items[i].getElementsByTagName('link')[0].textContent;
      const description = items[i].getElementsByTagName('description')[0].textContent;
      const image = items[i].getElementsByTagName('media:content')[0]?.getAttribute('url') || '';

      newsHtml += `
        <div class="news-item">
          <h3><a href="${link}" target="_blank">${title}</a></h3>
          ${image ? `<img src="${image}" alt="${title}" />` : ''}
          <p>${description}</p>
        </div>
      `;
    }

    newsContainer.innerHTML = newsHtml;
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

fetchNews();
