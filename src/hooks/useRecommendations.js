import { useEffect, useRef, useState } from 'react'
import { createReadShelfSignature } from '../data/recommendations.js'
import { searchBooks } from '../services/bookSearch.js'

const INITIAL_STATE = {
  status: 'idle',
  books: [],
  genre: '',
  total: 0,
  error: '',
  sourceSignature: '',
}

export default function useRecommendations(readBooks) {
  const [recommendationState, setRecommendationState] = useState(INITIAL_STATE)
  const latestRequestId = useRef(0)
  const activeController = useRef(null)
  const readShelfSignature = createReadShelfSignature(readBooks)

  useEffect(() => () => activeController.current?.abort(), [])

  async function findRecommendations(genreSummary) {
    const requestId = ++latestRequestId.current
    activeController.current?.abort()

    const controller = new AbortController()
    activeController.current = controller
    const query = `subject:"${genreSummary.genre}"`
    setRecommendationState({
      ...INITIAL_STATE,
      status: 'loading',
      genre: genreSummary.genre,
      total: genreSummary.total,
      sourceSignature: readShelfSignature,
    })

    try {
      const books = await searchBooks(query, controller.signal)
      if (requestId !== latestRequestId.current) return

      setRecommendationState({
        ...INITIAL_STATE,
        status: books.length > 0 ? 'success' : 'empty',
        books,
        genre: genreSummary.genre,
        total: genreSummary.total,
        sourceSignature: readShelfSignature,
      })
    } catch (error) {
      if (controller.signal.aborted || requestId !== latestRequestId.current) return

      setRecommendationState({
        ...INITIAL_STATE,
        status: 'error',
        genre: genreSummary.genre,
        total: genreSummary.total,
        error: error.message,
        sourceSignature: readShelfSignature,
      })
    } finally {
      if (requestId === latestRequestId.current) activeController.current = null
    }
  }

  return { recommendationState, findRecommendations, readShelfSignature }
}
