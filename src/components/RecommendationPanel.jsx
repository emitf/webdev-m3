import BookCard from './BookCard.jsx'

function getMessage({ readCount, status, genreSummary, genre, error, bookCount, isOutOfDate }) {
  if (isOutOfDate) return 'Your Read shelf changed. Find recommendations again to refresh them.'
  if (!genreSummary && !readCount) return 'Mark books as read and rate them to get recommendations.'
  if (!genreSummary) return 'Your Read books have no recognized genres yet. Try books with genre subjects.'
  if (status === 'loading') return `Finding books about “${genre}”…`
  if (status === 'error') return error
  if (status === 'empty') return `No books were found for “${genre}”. Try again later.`
  if (status === 'success' && bookCount === 0) {
    return `No new books are available for “${genre}”; the matches are already on your shelves or hidden.`
  }
  if (status === 'success') return `Suggestions based on “${genre}”, your highest weighted genre.`
  return `Your strongest match is ${genreSummary.genre} with a weighted score of ${genreSummary.total}.`
}

export default function RecommendationPanel({
  readCount,
  genreSummary,
  recommendationState,
  readShelfSignature,
  books,
  savedBookKeys,
  onFindRecommendations,
  onSave,
  onHide,
}) {
  const isOutOfDate = Boolean(
    recommendationState.sourceSignature
    && recommendationState.sourceSignature !== readShelfSignature,
  )
  const showBooks = recommendationState.status === 'success' && !isOutOfDate
  const message = getMessage({
    readCount,
    status: recommendationState.status,
    genreSummary,
    genre: recommendationState.genre || genreSummary?.genre,
    error: recommendationState.error,
    bookCount: books.length,
    isOutOfDate,
  })

  return (
    <section className="recommendation-section" aria-labelledby="recommendation-title">
      <div className="recommendation-heading">
        <div>
          <p className="eyebrow">BASED ON YOUR READ SHELF</p>
          <h2 id="recommendation-title">You might also like</h2>
        </div>
        <button
          className="recommend-button"
          type="button"
          onClick={onFindRecommendations}
          disabled={!genreSummary || recommendationState.status === 'loading'}
        >
          {recommendationState.status === 'loading' ? 'Finding books…' : 'Find recommendations'}
        </button>
      </div>
      <p
        className={`recommendation-message is-${recommendationState.status}`}
        role={recommendationState.status === 'error' ? 'alert' : 'status'}
        aria-live={recommendationState.status === 'error' ? 'assertive' : 'polite'}
      >
        {message}
      </p>
      {showBooks && books.length > 0 && (
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
