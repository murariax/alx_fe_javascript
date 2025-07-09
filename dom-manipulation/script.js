let quotes = [];
let selectedCategory = 'all';

// Load from localStorage when page loads
window.addEventListener('DOMContentLoaded', () => {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }

  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    selectedCategory = savedFilter;
  }

  populateCategories();
  document.getElementById('categoryFilter').value = selectedCategory;
  renderQuotes();
});

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Add a quote with category
function addQuote() {
  const quoteText = document.getElementById('newQuote').value.trim();
  const category = document.getElementById('quoteCategory').value.trim();

  if (quoteText && category) {
    quotes.push({ text: quoteText, category });
    saveQuotes();
    document.getElementById('newQuote').value = '';
    document.getElementById('quoteCategory').value = '';
    populateCategories();
    renderQuotes();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Populate unique categories into the dropdown
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Save current selection
  const currentValue = categorySelect.value;

  // Reset and re-populate
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Restore previously selected filter
  categorySelect.value = currentValue;
}

// Filter and render quotes
function filterQuotes() {
  selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  renderQuotes();
}

// Render quotes based on selected category
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

