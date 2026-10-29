export default function StarRating({ bookTitle, value, onChange }) {
  return (
    <div className="star-rating" role="group" aria-label={`Rate ${bookTitle}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="star-button"
          type="button"
          aria-label={`${star} out of 5 stars`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
        >
          <span aria-hidden="true">{star <= value ? '★' : '☆'}</span>
        </button>
      ))}
    </div>
  )
}
