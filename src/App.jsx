import { useEffect, useState } from 'react'
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
  const visibleRecommendationBooks = filterAvailableRecommendations(
    recommendationState.books,
    hiddenBookKeys,
    savedBookKeys,
  )

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
