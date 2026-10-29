import { filterValidBooks } from '../data/bookData.js'

const SEARCH_URL = 'https://openlibrary.org/search.json'
const REQUEST_TIMEOUT_MS = 10_000

function getTimeoutError() {
  return new Error('Open Library took too long to respond. Please try again.')
}

export async function fetchBooksFromOpenLibrary(query, signal) {
  const params = new URLSearchParams({
    q: query,
    limit: '12',
    fields: 'key,title,author_name,first_publish_year,cover_i,subject',
  })

  const requestController = new AbortController()
  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    requestController.abort()
  }, REQUEST_TIMEOUT_MS)
  const abortRequest = () => requestController.abort()

  if (signal?.aborted) {
    abortRequest()
  } else {
    signal?.addEventListener('abort', abortRequest, { once: true })
  }

  try {
    let response

    try {
      response = await fetch(`${SEARCH_URL}?${params}`, { signal: requestController.signal })
    } catch (error) {
      if (signal?.aborted || (error?.name === 'AbortError' && !timedOut)) throw error
      if (timedOut) throw getTimeoutError()
      throw new Error('Could not reach Open Library. Check your connection and try again.')
    }

    if (!response.ok) {
      throw new Error(`Open Library returned an error (${response.status}). Please try again.`)
    }

    let data

    try {
      data = await response.json()
    } catch (error) {
      if (signal?.aborted || (error?.name === 'AbortError' && !timedOut)) throw error
      if (timedOut) throw getTimeoutError()
      throw new Error('Open Library returned unreadable data. Please try again.')
    }

    if (!data || !Array.isArray(data.docs)) {
      throw new Error('Open Library did not return a book list. Please try again.')
    }

    return filterValidBooks(data.docs)
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortRequest)
  }
}
