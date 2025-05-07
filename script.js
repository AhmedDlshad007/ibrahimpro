// Global variables
let books = [];
let filteredBooks = [];
let currentPage = 1;
const itemsPerPage = 4;

// DOM Elements
const container = document.getElementById('data-container');
const searchInput = document.getElementById('search');
const genreFilter = document.getElementById('genre-filter');
const sortSelect = document.getElementById('sort');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Fetch data from JSON file
async function fetchBooks() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        books = await response.json();
        filteredBooks = [...books];
        
        // Initialize genre filter options
        initializeGenreFilter();
        
        // Initial render
        renderBooks();
        updatePagination();
    } catch (error) {
        container.innerHTML = `<p class="error">Error loading books: ${error.message}</p>`;
    }
}

// Initialize genre filter dropdown
function initializeGenreFilter() {
    const genres = [...new Set(books.map(book => book.genre))];
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// Create book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    card.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="book-info">
            <h2 class="book-title">${book.title}</h2>
            <p class="book-author">${book.author}</p>
            <p class="book-description">${book.description}</p>
            <span class="book-genre">${book.genre}</span>
            <div class="book-rating">
                ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}
                (${book.rating})
            </div>
        </div>
    `;
    
    return card;
}

// Render books based on current page
function renderBooks() {
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    booksToShow.forEach(book => {
        container.appendChild(createBookCard(book));
    });
}

// Filter books based on search and genre
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    
    filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.description.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });
    
    currentPage = 1;
    renderBooks();
    updatePagination();
}

// Sort books
function sortBooks() {
    const sortBy = sortSelect.value;
    
    filteredBooks.sort((a, b) => {
        if (sortBy === 'rating') {
            return b.rating - a.rating;
        }
        return a[sortBy].localeCompare(b[sortBy]);
    });
    
    renderBooks();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event Listeners
searchInput.addEventListener('input', filterBooks);
genreFilter.addEventListener('change', filterBooks);
sortSelect.addEventListener('change', sortBooks);

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
        updatePagination();
    }
});

nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderBooks();
        updatePagination();
    }
});

// Initialize the application
fetchBooks(); 