import { getCachedBooks, storeBooksInCache } from './bookCache.js'
import { fetchBooksFromOpenLibrary } from './openLibrary.js'

export async function searchBooks(query) {
  const cacheQuery = query.trim().toLowerCase()
  const cachedBooks = getCachedBooks(cacheQuery)

  if (cachedBooks !== null) return cachedBooks

  const books = await fetchBooksFromOpenLibrary(query)
  storeBooksInCache(cacheQuery, books)
  return books
}
