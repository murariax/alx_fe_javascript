let quotes = [];
let selectedCategory = 'all';
const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Simulated endpoint

window.addEventListener('DOMContentLoaded', () => {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }

  selectedCategory = localStorage.getItem('selectedCategory') || 'all';

  populateCategories();
  document.getElementById('categoryFilter').value = selectedCategory;
  renderQuotes();
  startAutoSync(); // ⏱️ begin syncing
});

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function addQuote() {
  const text = document.getElementById('newQuote').value.trim();
  const category = document.getElementById('quoteCategory').value.trim();

  if (text && category) {
    const newQuote = { text, category, id: Date.now() };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    renderQuotes();
    document.getElementById('newQuote').value = '';
    document.getElementById('quoteCategory').value = '';
  } else {
    alert('Please enter both a quote and a category.');
  }
}

function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];

  const currentValue = select.value;
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.value = currentValue;
}

function filterQuotes() {
  selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  renderQuotes();
}

function renderQuotes() {
  const list = document.getElementById('quoteList');
  list.innerHTML = '';

  quotes.forEach((quote) => {
    if (selectedCategory === 'all' || quote.category === selectedCategory) {
      const li = document.createElement('li');
      li.textContent = `"${quote.text}" (${quote.category})`;

      li.addEventListener('click', () => {
        sessionStorage.setItem('lastViewedQuote', quote.text);
        alert('You clicked: ' + quote.text);
      });

      list.appendChild(li);
    }
  });
}

function showSyncNotice(message) {
  const notice = document.getElementById('syncNotice');
  notice.textContent = message;
  setTimeout(() => {
    notice.textContent = '';
  }, 4000);
}

function startAutoSync() {
  setInterval(syncWithServer, 10000); // every 10 seconds
}

async function syncWithServer() {
  try {
    // Simulate fetching server data
    const response = await fetch(apiUrl);
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: 'server',
      id: post.id
    }));

    const newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));

    if (newQuotes.length > 0) {
      quotes = [...newQuotes, ...quotes];
      saveQuotes();
      populateCategories();
      renderQuotes();
      showSyncNotice(`${newQuotes.length} new quote(s) synced from server.`);
    }
  } catch (err) {
    console.error('Sync error:', err);
    showSyncNotice('⚠️ Failed to sync with server.');
  }
}

