import { useState } from 'react'
import BookResults from './components/BookResults.jsx'
import LibrarySections from './components/LibrarySections.jsx'
import SearchForm from './components/SearchForm.jsx'
import useBookSearch from './hooks/useBookSearch.js'
import useRecommendations from './hooks/useRecommendations.js'
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
import { filterAvailableRecommendations, getWeightedGenre } from './data/recommendations.js'

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
  const genreSummary = getWeightedGenre(libraryState.read)
  const {
    recommendationState,
    findRecommendations,
    readShelfSignature,
  } = useRecommendations(libraryState.read)

  const savedBookKeys = new Set(
    [...libraryState.wantToRead, ...libraryState.read].map((book) => book.key),
  )
  const hiddenBookKeys = new Set(libraryState.hiddenBooks.map((book) => book.key))
  const visibleSearchBooks = searchState.books.filter((book) => !hiddenBookKeys.has(book.key))
  const visibleRecommendationBooks = filterAvailableRecommendations(
    recommendationState.books,
    hiddenBookKeys,
    savedBookKeys,
  )

  function updateLibrary(update) {
    // Save with the user action that changes the shelves so failures can be reported without effect-driven state.
    const nextState = update(libraryState)
    const wasSaved = saveLibraryState(nextState)
    setLibraryState(nextState)
    setStorageError(wasSaved ? '' : 'Your shelves could not be saved in this browser.')
  }

  return (
    <div id="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Paper Trail home">
          paper trail<span>.</span>
        </a>
        <a className="saved-link" href="#shelves" aria-label="Go to your shelves" title="Your shelves">
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <path d="M12 6.2c-2.2-1.7-5.1-2.2-8-1.5v13c2.9-.7 5.8-.2 8 1.5m0-13c2.2-1.7 5.1-2.2 8-1.5v13c-2.9-.7-5.8-.2-8 1.5m0-13v13" />
          </svg>
        </a>
      </header>

      <nav className="section-nav" aria-label="Page sections">
        <a href="#search">Search</a>
        <a href="#shelves">Your shelves</a>
        <a href="#recommendations">Recommendations</a>
        <a href="#hidden-books">Hidden books</a>
      </nav>

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

        <LibrarySections
          libraryState={libraryState}
          storageError={storageError}
          genreSummary={genreSummary}
          recommendationState={recommendationState}
          readShelfSignature={readShelfSignature}
          visibleRecommendationBooks={visibleRecommendationBooks}
          savedBookKeys={savedBookKeys}
          onFindRecommendations={() => findRecommendations(genreSummary)}
          onSaveBook={(book) => updateLibrary((state) => addBookToWantToRead(state, book))}
          onHideBook={(book) => updateLibrary((state) => hideBook(state, book))}
          onMarkAsRead={(key, rating) => updateLibrary((state) => markBookAsRead(state, key, rating))}
          onChangeRating={(key, rating) => updateLibrary((state) => changeBookRating(state, key, rating))}
          onMoveBack={(key) => updateLibrary((state) => moveBookToWantToRead(state, key))}
          onRemoveBook={(key) => updateLibrary((state) => removeBookFromShelf(state, key))}
          onRestoreBook={(key) => updateLibrary((state) => restoreBook(state, key))}
        />
      </main>

      <footer className="site-footer">
        <span>paper trail<span className="footer-dot">.</span></span>
        <span>Find a story. Keep a story.</span>
      </footer>
    </div>
  )
}
