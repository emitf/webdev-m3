export default function ShelfPanel({ eyebrow, title, id, books, emptyMessage }) {
  return (
    <section className="shelf-panel" aria-labelledby={id}>
      <div className="shelf-panel-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h3 id={id}>{title}</h3>
        <span className="saved-count">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>
      {books.length === 0 ? (
        <p className="shelf-empty">{emptyMessage}</p>
      ) : (
        <ul className="shelf-book-list">
          {books.map((book) => (
            <li key={book.key}>
              <span className="shelf-book-title">{book.title}</span>
              <span className="shelf-book-details">
                {book.author_name?.[0] ?? 'Author unknown'}
                {book.rating ? ` · ${book.rating}/5` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
