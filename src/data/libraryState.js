import { filterValidBooks } from './bookData.js'

/**
 * The reading state keeps the two shelf types separate.
 * Read books include a `rating` number from 1 to 5.
 * Hidden book records stay separate so they can be restored after a reload.
 */
export function createEmptyLibraryState() {
  return {
    wantToRead: [],
    read: [],
    hiddenBooks: [],
  }
}

export function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

export function normalizeLibraryState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return createEmptyLibraryState()
  }

  const seenReadKeys = new Set()
  const read = filterValidBooks(value.read)
    .filter((book) => isValidRating(book.rating))
    .filter((book) => {
      if (seenReadKeys.has(book.key)) return false
      seenReadKeys.add(book.key)
      return true
    })

  const seenWantToReadKeys = new Set()
  const wantToRead = filterValidBooks(value.wantToRead)
    .filter((book) => !seenReadKeys.has(book.key) && !seenWantToReadKeys.has(book.key))
    .filter((book) => {
      seenWantToReadKeys.add(book.key)
      return true
    })

  const shelfBooks = [...wantToRead, ...read]
  const legacyHiddenBooks = Array.isArray(value.hiddenBookKeys)
    ? shelfBooks.filter((book) => value.hiddenBookKeys.includes(book.key))
    : []
  const hiddenBooks = filterValidBooks(value.hiddenBooks ?? legacyHiddenBooks)
    .filter((book, index, books) => books.findIndex((candidate) => candidate.key === book.key) === index)

  return { wantToRead, read, hiddenBooks }
}

export function addBookToWantToRead(state, book) {
  const savedKeys = new Set([...state.wantToRead, ...state.read].map((savedBook) => savedBook.key))
  if (savedKeys.has(book.key)) return state
  return { ...state, wantToRead: [...state.wantToRead, book] }
}

export function markBookAsRead(state, bookKey, rating) {
  if (!isValidRating(rating)) return state
  const book = state.wantToRead.find((item) => item.key === bookKey)
  if (!book) return state
  return {
    ...state,
    wantToRead: state.wantToRead.filter((item) => item.key !== bookKey),
    read: [...state.read, { ...book, rating }],
  }
}

export function changeBookRating(state, bookKey, rating) {
  if (!isValidRating(rating)) return state
  return {
    ...state,
    read: state.read.map((book) => book.key === bookKey ? { ...book, rating } : book),
  }
}

export function moveBookToWantToRead(state, bookKey) {
  const book = state.read.find((item) => item.key === bookKey)
  if (!book) return state
  const { rating: _rating, ...bookToRead } = book
  return {
    ...state,
    read: state.read.filter((item) => item.key !== bookKey),
    wantToRead: [...state.wantToRead, bookToRead],
  }
}

export function removeBookFromShelf(state, bookKey) {
  return {
    ...state,
    wantToRead: state.wantToRead.filter((book) => book.key !== bookKey),
    read: state.read.filter((book) => book.key !== bookKey),
  }
}

export function hideBook(state, book) {
  if (state.hiddenBooks.some((hiddenBook) => hiddenBook.key === book.key)) return state
  return { ...state, hiddenBooks: [...state.hiddenBooks, book] }
}

export function restoreBook(state, bookKey) {
  return {
    ...state,
    hiddenBooks: state.hiddenBooks.filter((book) => book.key !== bookKey),
  }
}
