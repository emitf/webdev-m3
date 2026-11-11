import { createEmptyLibraryState, normalizeLibraryState } from '../data/libraryState.js'

const LIBRARY_STATE_KEY = 'paper-trail-library-v1'

export function loadLibraryState() {
  try {
    const savedStateText = localStorage.getItem(LIBRARY_STATE_KEY)
    if (savedStateText === null) return createEmptyLibraryState()

    return normalizeLibraryState(JSON.parse(savedStateText))
  } catch {
    return createEmptyLibraryState()
  }
}

export function saveLibraryState(libraryState) {
  try {
    localStorage.setItem(LIBRARY_STATE_KEY, JSON.stringify(libraryState))
    return true
  } catch {
    return false
  }
}
