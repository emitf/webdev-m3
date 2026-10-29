import RecommendationPanel from './RecommendationPanel.jsx'
import SectionHeading from './SectionHeading.jsx'
import ShelfPanel from './ShelfPanel.jsx'

export default function LibrarySections({
  libraryState,
  storageError,
  genreSummary,
  recommendationState,
  readShelfSignature,
  visibleRecommendationBooks,
  savedBookKeys,
  onFindRecommendations,
  onSaveBook,
  onHideBook,
  onMarkAsRead,
  onChangeRating,
  onMoveBack,
  onRemoveBook,
  onRestoreBook,
}) {
  return (
    <>
      <section className="saved-section" id="shelves" aria-labelledby="shelves-title">
        <SectionHeading eyebrow="YOUR READING LIFE" title="Your shelves" id="shelves-title" />
        {storageError && <p className="storage-error" role="status">{storageError}</p>}

        <div className="shelf-grid">
          <ShelfPanel
            eyebrow="FOR ANOTHER DAY"
            title="Want to read"
            id="want-to-read-title"
            books={libraryState.wantToRead}
            emptyMessage="Books you save for later will be collected here."
            shelf="wantToRead"
            onMarkAsRead={onMarkAsRead}
            onRemove={onRemoveBook}
          />
          <ShelfPanel
            eyebrow="STORIES YOU'VE FINISHED"
            title="Read"
            id="read-title"
            books={libraryState.read}
            emptyMessage="Books you mark as read, along with your ratings, will appear here."
            shelf="read"
            onChangeRating={onChangeRating}
            onMoveBack={onMoveBack}
            onRemove={onRemoveBook}
          />
        </div>

        <RecommendationPanel
          readCount={libraryState.read.length}
          genreSummary={genreSummary}
          recommendationState={recommendationState}
          readShelfSignature={readShelfSignature}
          books={visibleRecommendationBooks}
          savedBookKeys={savedBookKeys}
          onFindRecommendations={onFindRecommendations}
          onSave={onSaveBook}
          onHide={onHideBook}
        />
      </section>

      <section className="hidden-section" id="hidden-books" aria-labelledby="hidden-title">
        <ShelfPanel
          eyebrow="OUT OF YOUR DISCOVERY LIST"
          title="Hidden books"
          id="hidden-title"
          books={libraryState.hiddenBooks}
          emptyMessage="Books you hide from discovery can be restored here."
          listClassName="hidden-book-grid"
          shelf="hidden"
          onRestore={onRestoreBook}
        />
      </section>
    </>
  )
}
