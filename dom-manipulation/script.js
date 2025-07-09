let quotes = [];

// Load quotes from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    renderQuotes();
  }

  // Optional: Load last viewed quote from sessionStorage
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    alert('Last viewed quote: ' + lastQuote);
  }
});

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Add a new quote
function addQuote() {
  const input = document.getElementById('newQuote');
  const quote = input.value.trim();
  if (quote !== '') {
    quotes.push(quote);
    saveQuotes();
    renderQuotes();
    input.value = '';
  }
}

// Render quotes in the list
function renderQuotes() {
  const list = document.getElementById('quoteList');
  list.innerHTML = '';

  quotes.forEach((quote) => {
    const li = document.createElement('li');
    li.textContent = quote;

    // ✅ Use addEventListener to save quote to sessionStorage
    li.addEventListener('click', () => {
      sessionStorage.setItem('lastViewedQuote', quote);
      alert('You clicked: ' + quote);
    });

    list.appendChild(li);
  });
}

// Export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        renderQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format. Must be an array of quotes.');
      }
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

