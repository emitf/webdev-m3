import { useEffect, useRef, useState } from 'react'
import { searchBooks } from '../services/bookSearch.js'

const INITIAL_SEARCH_STATE = {
  status: 'idle',
  books: [],
  query: '',
  error: '',
}

export default function useBookSearch() {
  const [query, setQuery] = useState('')
  const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE)
  const searchInputRef = useRef(null)
  const latestRequestId = useRef(0)
  const activeController = useRef(null)

  useEffect(() => () => activeController.current?.abort(), [])

  async function handleSearch(event) {
    event.preventDefault()
    const cleanQuery = query.trim()
    const requestId = ++latestRequestId.current

    activeController.current?.abort()
    activeController.current = null

    if (cleanQuery === '') {
      setSearchState({ ...INITIAL_SEARCH_STATE, status: 'invalid' })
      searchInputRef.current?.focus()
      return
    }

    const controller = new AbortController()
    activeController.current = controller
    setSearchState({ status: 'loading', books: [], query: cleanQuery, error: '' })

    try {
      const books = await searchBooks(cleanQuery, controller.signal)
      if (requestId !== latestRequestId.current) return

      setSearchState({
        status: books.length > 0 ? 'success' : 'empty',
        books,
        query: cleanQuery,
        error: '',
      })
    } catch (error) {
      if (controller.signal.aborted || requestId !== latestRequestId.current) return

      setSearchState({ status: 'error', books: [], query: cleanQuery, error: error.message })
    } finally {
      if (requestId === latestRequestId.current) activeController.current = null
    }
  }

  function cancelSearch() {
    latestRequestId.current += 1
    activeController.current?.abort()
    activeController.current = null
    setSearchState({ status: 'cancelled', books: [], query: query.trim(), error: '' })
  }

  return {
    query,
    setQuery,
    searchState,
    searchInputRef,
    handleSearch,
    cancelSearch,
  }
}
