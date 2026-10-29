import { isValidRating } from './libraryState.js'

const GENERAL_SUBJECTS = new Set([
  'fiction',
  'fiction in english',
  'literature',
  'novels',
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
  'Historical fiction': ['historical fiction', 'historical novels'],
  'Contemporary fiction': ['contemporary fiction'],
  'Literary fiction': ['literary fiction'],
  'Young adult': ['young adult'],
  'Children’s fiction': [
    'juvenile fiction',
    'children’s fiction',
    "children's fiction",
    'childrens fiction',
  ],
  'LGBTQ+ fiction': ['lgbtq', 'lesbian fiction', 'gay fiction', 'queer fiction'],
  'Graphic novels': ['graphic novel'],
  Western: ['western'],
  War: ['war stories', 'war fiction'],
  Biography: ['biography', 'biographies'],
  Memoir: ['memoir', 'memoirs'],
  History: ['history'],
  Poetry: ['poetry', 'poems'],
  Philosophy: ['philosophy'],
  Psychology: ['psychology'],
  'Self-help': ['self-help', 'self help'],
  Science: ['science'],
  Nature: ['nature'],
  Travel: ['travel'],
  Humor: ['humor', 'humour'],
  Drama: ['drama', 'plays'],
}

const GENRE_ORDER = Object.keys(GENRE_GROUPS)

function normalizeSubject(subject) {
  return subject.trim().replace(/\s+/g, ' ').toLowerCase()
}

function getBookGenres(book) {
  const subjects = Array.isArray(book.subject) ? book.subject : []
  const matchedGenres = subjects.flatMap((subject) => {
    if (typeof subject !== 'string') return []
    const cleanSubject = normalizeSubject(subject)
    if (!cleanSubject || GENERAL_SUBJECTS.has(cleanSubject)) return []

    return GENRE_ORDER.filter((genre) =>
      GENRE_GROUPS[genre].some((hint) => cleanSubject.includes(hint)),
    )
  })
  const bookGenres = new Set(matchedGenres)

  // Keep a specific dystopian label from also inflating its broader sci-fi genre.
  if (bookGenres.has('Dystopian')) bookGenres.delete('Science fiction')
  if (bookGenres.has('Science fiction')) bookGenres.delete('Science')
  return bookGenres
}

function getSpecificSubjects(book) {
  const subjects = Array.isArray(book.subject) ? book.subject : []
  return new Map(subjects.flatMap((subject) => {
    if (typeof subject !== 'string') return []
    const normalized = normalizeSubject(subject)
    if (!normalized || GENERAL_SUBJECTS.has(normalized)) return []
    return [[normalized, subject.trim().replace(/\s+/g, ' ')]]
  }))
}

function tallyContributions(contributions) {
  return contributions.reduce((scores, contribution) => {
    scores.set(
      contribution.category,
      (scores.get(contribution.category) ?? 0) + contribution.rating,
    )
    return scores
  }, new Map())
}

function summarizeScores(scores, order, getLabel, type) {
  const winner = order.reduce((best, category) => {
    const total = scores.get(category)
    if (!total || (best && total <= best.total)) return best
    return { category, total }
  }, null)

  if (!winner) return null

  return {
    genre: getLabel(winner.category),
    total: winner.total,
    type,
  }
}

export function getWeightedGenre(readBooks) {
  const ratedBooks = readBooks.filter((book) => isValidRating(book.rating))
  const genreContributions = ratedBooks.flatMap((book) =>
    [...getBookGenres(book)].map((genre) => ({ category: genre, rating: book.rating })),
  )

  if (genreContributions.length > 0) {
    const genreScores = tallyContributions(genreContributions)
    return summarizeScores(genreScores, GENRE_ORDER, (genre) => genre, 'genre')
  }

  // If no book matches a known genre, use specific Open Library subjects as the fallback.
  const subjectContributions = ratedBooks.flatMap((book) =>
    [...getSpecificSubjects(book)].map(([normalized, label]) => ({
      category: normalized,
      label,
      rating: book.rating,
    })),
  )
  const subjectLabels = new Map(subjectContributions.map(({ category, label }) => [category, label]))
  const subjectOrder = [...subjectLabels.keys()]
  const subjectScores = tallyContributions(subjectContributions)

  return summarizeScores(
    subjectScores,
    subjectOrder,
    (subject) => subjectLabels.get(subject),
    'subject',
  )
}

export function createReadShelfSignature(readBooks) {
  return JSON.stringify(readBooks.map(({ key, rating }) => [key, rating]))
}

export function filterAvailableRecommendations(books, hiddenBookKeys, savedBookKeys) {
  return books.filter((book) => !hiddenBookKeys.has(book.key) && !savedBookKeys.has(book.key))
}
