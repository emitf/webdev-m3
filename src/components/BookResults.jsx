import BookCard from './BookCard.jsx'
import SectionHeading from './SectionHeading.jsx'

function getSearchMessage(status, query, error, bookCount) {
  if (status === 'loading') return 'Searching the library…'
  if (status === 'invalid') return 'Type a title, author, or subject to search.'
  if (status === 'error') return error
  if (status === 'empty') return `No books found for “${query}”. Try another search.`
  if (status === 'success') {
    const bookLabel = bookCount === 1 ? 'book' : 'books'
    return `${bookCount} ${bookLabel} found for “${query}”.`
  }
  if (status === 'cancelled') return 'Search cancelled.'
  return 'Your search results will appear here.'
}

export default function BookResults({
  status,
  books,
  query,
  error,
  savedBookKeys,
  onSave,
  onHide,
}) {
  const isError = status === 'error' || status === 'invalid'

  return (
    <section className="books-section" aria-labelledby="results-title">
      <SectionHeading eyebrow="THE LIBRARY" title="Books to explore" id="results-title" />
      <p
        id="search-message"
        className={`search-message is-${status}`}
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
      >
        {getSearchMessage(status, query, error, books.length)}
      </p>
      {status === 'success' && (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book.key}
              book={book}
              isSaved={savedBookKeys.has(book.key)}
              onSave={onSave}
              onHide={onHide}
            />
          ))}
        </div>
      )}
    </section>
  )
}
