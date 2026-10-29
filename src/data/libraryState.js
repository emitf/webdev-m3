import { filterValidBooks } from './bookData.js'

/**
 * The reading state keeps the two shelf types separate.
 * Read books include a `rating` number from 1 to 5.
 * Hidden book keys stay separate so hiding never removes a book from a shelf.
 */
export function createEmptyLibraryState() {
  return {
    wantToRead: [],
    read: [],
    hiddenBookKeys: [],
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
  const read = (Array.isArray(value.read) ? value.read : [])
    .filter((book) => isValidRating(book?.rating) && filterValidBooks([book]).length === 1)
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

  const hiddenBookKeys = Array.isArray(value.hiddenBookKeys)
    ? [...new Set(value.hiddenBookKeys.filter((key) => typeof key === 'string' && key.trim() !== ''))]
    : []

  return { wantToRead, read, hiddenBookKeys }
}
