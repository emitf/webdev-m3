import { filterValidBooks } from '../data/bookData.js'

const SEARCH_URL = 'https://openlibrary.org/search.json'

export async function fetchBooksFromOpenLibrary(query, signal) {
  const params = new URLSearchParams({
    q: query,
    limit: '12',
    fields: 'key,title,author_name,first_publish_year,cover_i,subject',
  })

  let response

  try {
    response = await fetch(`${SEARCH_URL}?${params}`, { signal })
  } catch (error) {
    if (signal?.aborted || error?.name === 'AbortError') throw error
    throw new Error('Could not reach Open Library. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new Error(`Open Library returned an error (${response.status}). Please try again.`)
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error('Open Library returned unreadable data. Please try again.')
  }

  if (!data || !Array.isArray(data.docs)) {
    throw new Error('Open Library did not return a book list. Please try again.')
  }

  const books = filterValidBooks(data.docs)
  return books
}
