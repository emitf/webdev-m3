export default function SearchForm({
  query,
  onQueryChange,
  onSubmit,
  onCancel,
  inputRef,
  isSearching,
  isInvalid,
}) {
  return (
    <form className="search-section" role="search" aria-label="Search for books" onSubmit={onSubmit} noValidate>
      <label htmlFor="book-search">What would you like to read?</label>
      <div className="search-row">
        <input
          ref={inputRef}
          id="book-search"
          name="q"
          type="search"
          placeholder="Try a title, author, or subject"
          autoComplete="off"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-invalid={isInvalid}
          aria-describedby="search-message"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching…' : 'Search'} <span aria-hidden="true">↗</span>
        </button>
        {isSearching && (
          <button className="cancel-search-button" type="button" onClick={onCancel}>
            Cancel search
          </button>
        )}
      </div>
      <p className="search-hint">For example: “mystery”, “Octavia Butler”, or “gardening”</p>
    </form>
  )
}
