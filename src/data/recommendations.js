import { filterValidBooks } from './bookData.js'
import { isValidRating } from './libraryState.js'

const GENERAL_SUBJECTS = new Set([
  'fiction',
  'juvenile fiction',
  'young adult fiction',
  'accessible book',
  'protected daisy',
  'large type books',
])

const GENRE_GROUPS = {
  Romance: ['romance', 'romantic fiction', 'rom-com', 'love stories'],
  Mystery: ['mystery', 'detective'],
  Crime: ['crime'],
  Thriller: ['thriller', 'suspense'],
  Dystopian: ['dystop'],
  'Science fiction': ['science fiction', 'science-fiction', 'sci-fi', 'scifi'],
  Fantasy: ['fantasy'],
  Horror: ['horror'],
  Adventure: ['adventure'],
}

const GENRE_ORDER = Object.keys(GENRE_GROUPS)

function getBookGenres(book) {
  const subjects = Array.isArray(book.subject) ? book.subject : []
  const matchedGenres = subjects.flatMap((subject) => {
    if (typeof subject !== 'string') return []
    const cleanSubject = subject.trim().toLowerCase()
    if (!cleanSubject || GENERAL_SUBJECTS.has(cleanSubject)) return []

    return GENRE_ORDER.filter((genre) =>
      GENRE_GROUPS[genre].some((hint) => cleanSubject.includes(hint)),
    )
  })
  const bookGenres = new Set(matchedGenres)

  // Keep a specific dystopian label from also inflating its broader sci-fi genre.
  if (bookGenres.has('Dystopian')) bookGenres.delete('Science fiction')
  return bookGenres
}

export function getWeightedGenre(readBooks) {
  const genreTotals = filterValidBooks(readBooks)
    .filter((book) => isValidRating(book.rating))
    .reduce((totals, book) => {
      getBookGenres(book).forEach((genre) => {
        totals[genre] = (totals[genre] ?? 0) + book.rating
      })
      return totals
    }, {})

  return GENRE_ORDER.reduce((best, genre) => {
    const total = genreTotals[genre] ?? 0
    if (total === 0 || (best && total <= best.total)) return best
    return { genre, total }
  }, null)
}

export function createReadShelfSignature(readBooks) {
  return JSON.stringify(readBooks.map(({ key, rating }) => [key, rating]))
}

export function filterAvailableRecommendations(books, hiddenBookKeys, savedBookKeys) {
  return filterValidBooks(books).filter(
    (book) => !hiddenBookKeys.has(book.key) && !savedBookKeys.has(book.key),
  )
}
