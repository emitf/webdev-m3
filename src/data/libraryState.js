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
