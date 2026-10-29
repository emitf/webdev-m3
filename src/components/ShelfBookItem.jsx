import { useState } from 'react'
import { getBookAuthor } from '../data/bookData.js'
import StarRating from './StarRating.jsx'

export default function ShelfBookItem({
  book,
  shelf,
  onMarkAsRead,
  onChangeRating,
  onMoveBack,
  onRemove,
  onRestore,
}) {
  const [rating, setRating] = useState('')
  const author = getBookAuthor(book)

  return (
    <li className="shelf-book-item">
      <div>
        <span className="shelf-book-title">{book.title}</span>
        <span className="shelf-book-details">
          {author}{shelf === 'read' ? ` · ${book.rating}/5` : ''}
        </span>
      </div>

      {shelf === 'wantToRead' && (
        <div className="shelf-actions">
          <div className="rating-form">
            <span className="rating-label">Your rating</span>
            <StarRating
              bookTitle={book.title}
              value={Number(rating) || 0}
              onChange={(nextRating) => setRating(String(nextRating))}
            />
          </div>
          <div className="shelf-action-buttons">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onMarkAsRead(book.key, Number(rating))
                setRating('')
              }}
            >
              <button type="submit" disabled={!rating}>Mark as read</button>
            </form>
            <button type="button" className="text-button" onClick={() => onRemove(book.key)}>Remove</button>
          </div>
        </div>
      )}

      {shelf === 'read' && (
        <div className="shelf-actions">
          <div className="rating-form">
            <span className="rating-label">Your rating</span>
            <StarRating
              bookTitle={book.title}
              value={book.rating}
              onChange={(rating) => onChangeRating(book.key, rating)}
            />
          </div>
          <div className="shelf-action-buttons">
            <button type="button" onClick={() => onMoveBack(book.key)}>Move to Want to read</button>
            <button type="button" className="text-button" onClick={() => onRemove(book.key)}>Remove</button>
          </div>
        </div>
      )}

      {shelf === 'hidden' && (
        <div className="shelf-actions">
          <button type="button" onClick={() => onRestore(book.key)}>Restore to discovery</button>
        </div>
      )}
    </li>
  )
}
