import { filterValidBooks } from '../data/bookData.js'
import { createEmptyLibraryState, normalizeLibraryState } from '../data/libraryState.js'

const LIBRARY_STATE_KEY = 'paper-trail-library-v1'
const LEGACY_SAVED_BOOKS_KEY = 'paper-trail-saved-books'

export function loadLibraryState() {
  try {
    const savedStateText = localStorage.getItem(LIBRARY_STATE_KEY)
    if (savedStateText !== null) {
      try {
        return normalizeLibraryState(JSON.parse(savedStateText))
      } catch {
        // Fall back to the old shelf if the new saved state is unreadable.
      }
    }

    const legacyBooksText = localStorage.getItem(LEGACY_SAVED_BOOKS_KEY)
    if (legacyBooksText === null) return createEmptyLibraryState()

    return normalizeLibraryState({
      ...createEmptyLibraryState(),
      wantToRead: filterValidBooks(JSON.parse(legacyBooksText)),
    })
  } catch {
    return createEmptyLibraryState()
  }
}

export function saveLibraryState(libraryState) {
  try {
    localStorage.setItem(LIBRARY_STATE_KEY, JSON.stringify(normalizeLibraryState(libraryState)))
    return true
  } catch {
    return false
  }
}
