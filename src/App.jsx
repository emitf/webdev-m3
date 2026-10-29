import { useEffect, useState } from 'react'
import BookResults from './components/BookResults.jsx'
import SearchForm from './components/SearchForm.jsx'
import SectionHeading from './components/SectionHeading.jsx'
import ShelfPanel from './components/ShelfPanel.jsx'
import useBookSearch from './hooks/useBookSearch.js'
import { loadLibraryState, saveLibraryState } from './services/libraryStorage.js'
import {
  addBookToWantToRead,
  changeBookRating,
  hideBook,
  markBookAsRead,
  moveBookToWantToRead,
  removeBookFromShelf,
  restoreBook,
} from './data/libraryState.js'

export default function App() {
  const [libraryState, setLibraryState] = useState(loadLibraryState)
  const [storageError, setStorageError] = useState('')
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    searchState,
    searchInputRef,
    handleSearch,
    cancelSearch,
  } = useBookSearch()

  // localStorage is external to React; show its write error when shelf syncing fails.
  useEffect(() => {
    const wasSaved = saveLibraryState(libraryState)
    setStorageError(wasSaved ? '' : 'Your shelves could not be saved in this browser.')
  }, [libraryState])

  const savedBookKeys = new Set(
    [...libraryState.wantToRead, ...libraryState.read].map((book) => book.key),
  )
  const hiddenBookKeys = new Set(libraryState.hiddenBooks.map((book) => book.key))
  const visibleSearchBooks = searchState.books.filter((book) => !hiddenBookKeys.has(book.key))

  function updateLibrary(update) {
    setLibraryState((currentState) => update(currentState))
  }

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

        <SearchForm
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSubmit={handleSearch}
          onCancel={cancelSearch}
          inputRef={searchInputRef}
          isSearching={searchState.status === 'loading'}
          isInvalid={searchState.status === 'invalid'}
        />

        <BookResults
          status={searchState.status}
          books={visibleSearchBooks}
          query={searchState.query}
          error={searchState.error}
          savedBookKeys={savedBookKeys}
          onSave={(book) => updateLibrary((state) => addBookToWantToRead(state, book))}
          onHide={(book) => updateLibrary((state) => hideBook(state, book))}
        />

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
              shelf="wantToRead"
              onMarkAsRead={(key, rating) => updateLibrary((state) => markBookAsRead(state, key, rating))}
              onRemove={(key) => updateLibrary((state) => removeBookFromShelf(state, key))}
            />
            <ShelfPanel
              eyebrow="STORIES YOU'VE FINISHED"
              title="Read"
              id="read-title"
              books={libraryState.read}
              emptyMessage="Books you mark as read, along with your ratings, will appear here."
              shelf="read"
              onChangeRating={(key, rating) => updateLibrary((state) => changeBookRating(state, key, rating))}
              onMoveBack={(key) => updateLibrary((state) => moveBookToWantToRead(state, key))}
              onRemove={(key) => updateLibrary((state) => removeBookFromShelf(state, key))}
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
          <ShelfPanel
            eyebrow="OUT OF YOUR DISCOVERY LIST"
            title="Hidden books"
            id="hidden-title"
            books={libraryState.hiddenBooks}
            emptyMessage="Books you hide from discovery can be restored here."
            shelf="hidden"
            onRestore={(key) => updateLibrary((state) => restoreBook(state, key))}
          />
        </section>
      </main>

      <footer className="site-footer">
        <span>paper trail<span className="footer-dot">.</span></span>
        <span>Find a story. Keep a story.</span>
      </footer>
    </div>
  )
}
