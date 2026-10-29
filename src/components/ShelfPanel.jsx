import ShelfBookItem from './ShelfBookItem.jsx'

export default function ShelfPanel({
  eyebrow,
  title,
  id,
  books,
  emptyMessage,
  listClassName = '',
  shelf,
  onMarkAsRead,
  onChangeRating,
  onMoveBack,
  onRemove,
  onRestore,
}) {
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
        <ul className={`shelf-book-list ${listClassName}`.trim()}>
          {books.map((book) => (
            <ShelfBookItem
              key={book.key}
              book={book}
              shelf={shelf}
              onMarkAsRead={onMarkAsRead}
              onChangeRating={onChangeRating}
              onMoveBack={onMoveBack}
              onRemove={onRemove}
              onRestore={onRestore}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
