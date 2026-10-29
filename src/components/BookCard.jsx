import { useState } from 'react'

function getAuthor(book) {
  return Array.isArray(book.author_name) && book.author_name.length > 0
    ? book.author_name[0]
    : 'Author unknown'
}

function BookCover({ book }) {
  const [coverStatus, setCoverStatus] = useState(Number.isInteger(book.cover_i) ? 'loading' : 'unavailable')

  if (coverStatus === 'unavailable') {
    return <div className="book-cover">Cover unavailable</div>
  }

  return (
    <div className="book-cover">
      {coverStatus === 'loading' && <span className="book-cover-placeholder">Loading cover…</span>}
      <img
        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onLoad={() => setCoverStatus('loaded')}
        onError={() => setCoverStatus('unavailable')}
      />
    </div>
  )
}

export default function BookCard({ book, isSaved, onSave, onHide }) {
  return (
    <article className="book-card">
      <BookCover book={book} />
      <div className="book-details">
        <h3>{book.title}</h3>
        <p className="book-author">{getAuthor(book)}</p>
        <p className="book-year">
          {Number.isInteger(book.first_publish_year)
            ? `First published ${book.first_publish_year}`
            : 'Publication year unknown'}
        </p>
        <div className="book-actions">
          <button
            className="save-button"
            type="button"
            onClick={() => onSave(book)}
            disabled={isSaved}
          >
            {isSaved ? 'On your shelf' : 'Save for later'}
          </button>
          <button className="text-button hide-button" type="button" onClick={() => onHide(book)}>
            Hide from results
          </button>
        </div>
      </div>
    </article>
  )
}
