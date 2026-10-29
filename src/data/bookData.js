export function filterValidBooks(books) {
  if (!Array.isArray(books)) return []

  return books
    .filter((book) => (
      book
      && typeof book === 'object'
      && !Array.isArray(book)
      && typeof book.key === 'string'
      && book.key.trim() !== ''
      && typeof book.title === 'string'
      && book.title.trim() !== ''
    ))
    .map((book) => ({
      ...book,
      author_name: Array.isArray(book.author_name)
        ? book.author_name.filter((author) => typeof author === 'string' && author.trim() !== '')
        : [],
      subject: Array.isArray(book.subject)
        ? book.subject.filter((subject) => typeof subject === 'string' && subject.trim() !== '')
        : [],
      cover_i: Number.isInteger(book.cover_i) ? book.cover_i : null,
      first_publish_year: Number.isInteger(book.first_publish_year) ? book.first_publish_year : null,
    }))
}

export function getBookAuthor(book) {
  if (!Array.isArray(book.author_name)) return 'Author unknown'

  const author = book.author_name.find((item) => typeof item === 'string' && item.trim() !== '')
  return author?.trim() ?? 'Author unknown'
}
