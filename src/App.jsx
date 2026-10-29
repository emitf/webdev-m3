import { useEffect, useState } from 'react'
import { loadLibraryState, saveLibraryState } from './services/libraryStorage.js'

function SectionHeading({ eyebrow, title, id, aside }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {aside}
    </div>
  )
}

function ShelfPanel({ eyebrow, title, id, books, emptyMessage }) {
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

export default function App() {
  const [libraryState] = useState(loadLibraryState)
  const [storageError, setStorageError] = useState('')

  // localStorage is external to React; show its write error when shelf syncing fails.
  useEffect(() => {
    const wasSaved = saveLibraryState(libraryState)
    setStorageError(wasSaved ? '' : 'Your shelves could not be saved in this browser.')
  }, [libraryState])

  return (
    <div id="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Paper Trail home">
          paper trail<span>.</span>
        </a>
        <a className="saved-link" href="#shelves">
          Your shelves <span aria-hidden="true">♡</span>
        </a>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A BOOK DISCOVERY CORNER</p>
          <h1 id="page-title">Find your next<br /><em>favorite.</em></h1>
          <p className="intro-copy">
            A good read is closer than you think. Search the shelves and see where the story takes you.
          </p>
        </section>

        <section className="search-section" role="search" aria-label="Search for books">
          <label htmlFor="book-search">What would you like to read?</label>
          <div className="search-row">
            <input
              id="book-search"
              name="q"
              type="search"
              placeholder="Try a title, author, or subject"
              autoComplete="off"
            />
            <button type="button" disabled>Search <span aria-hidden="true">↗</span></button>
          </div>
          <p className="search-hint">For example: “mystery”, “Octavia Butler”, or “gardening”</p>
        </section>

        <section className="books-section" aria-labelledby="results-title">
          <SectionHeading eyebrow="THE LIBRARY" title="Books to explore" id="results-title" />
          <p className="search-message is-idle" role="status" aria-live="polite">
            Your search results will appear here.
          </p>
        </section>

        <section className="saved-section" id="shelves" aria-labelledby="shelves-title">
          <SectionHeading eyebrow="YOUR READING LIFE" title="Your shelves" id="shelves-title" />
          {storageError && <p className="storage-error" role="status">{storageError}</p>}

          <div className="shelf-grid">
            <ShelfPanel
              eyebrow="FOR ANOTHER DAY"
              title="Want to read"
              id="want-to-read-title"
              books={libraryState.wantToRead}
              emptyMessage="Books you save for later will be collected here."
            />
            <ShelfPanel
              eyebrow="STORIES YOU'VE FINISHED"
              title="Read"
              id="read-title"
              books={libraryState.read}
              emptyMessage="Books you mark as read, along with your ratings, will appear here."
            />
          </div>

          <section className="recommendation-section" aria-labelledby="recommendation-title">
            <div className="recommendation-heading">
              <div>
                <p className="eyebrow">BASED ON YOUR READ SHELF</p>
                <h2 id="recommendation-title">You might also like</h2>
              </div>
              <button className="recommend-button" type="button" disabled>
                Find recommendations
              </button>
            </div>
            <p className="recommendation-message">
              Mark a book as read to get recommendations based on its genre.
            </p>
          </section>
        </section>

        <section className="hidden-section" aria-labelledby="hidden-title">
          <SectionHeading eyebrow="OUT OF YOUR DISCOVERY LIST" title="Hidden books" id="hidden-title" />
          <p className="saved-empty">Books you hide from search and recommendations can be restored here.</p>
        </section>
      </main>

      <footer className="site-footer">
        <span>paper trail<span className="footer-dot">.</span></span>
        <span>Find a story. Keep a story.</span>
      </footer>
    </div>
  )
}
