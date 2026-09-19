import { useEffect, useState } from "react";
import library from "../../data/library";
import { getDocumentMeta } from "../../content/documentRegistry";
import { useReading } from "../../state/ReadingContext";
import "./LibraryOverlay.css";

export default function LibraryOverlay() {
  const [open, setOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const { setSelectedItem } = useReading();

  useEffect(() => {
    const handleOpenLibrary = () => {
      setSelectedCollection(null);
      setOpen(true);
    };

    window.addEventListener(
      "moku:open-library",
      handleOpenLibrary
    );

    return () => {
      window.removeEventListener(
        "moku:open-library",
        handleOpenLibrary
      );
    };
  }, []);

  const closeLibrary = () => {
    setOpen(false);
    setSelectedCollection(null);
  };

  const getDocument = (item) => {
    return getDocumentMeta(item.id);
  };

  const openItem = (item) => {
    const document = getDocument(item);

    if (!document) {
      return;
    }

    setSelectedItem({
      ...item,
      ...document,
    });

    closeLibrary();
  };

  const getVerseCount = (item) => {
    const document = getDocument(item);

    if (!document) {
      return null;
    }

    if (document.metadata?.verseCount != null) {
      return document.metadata.verseCount;
    }

    const content = document.content;

    if (Array.isArray(content)) {
      return content.length;
    }

    return null;
  };

  const isAvailable = (item) => {
    return Boolean(getDocument(item));
  };

  return (
    <>
      <button
        className="library-trigger"
        aria-label="Open library"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {open && (
        <div className="library-overlay">
          <div
            className="library-backdrop"
            onClick={closeLibrary}
          />

          <aside className="library-panel">

            <div className="library-header">
              <div>
                <div className="library-eyebrow">
                  MOKU DARŚANA
                </div>

                <h2>{library.sanskritTitle}</h2>

                <div className="library-title">
                  {library.title}
                </div>
              </div>

              <button
                className="library-close"
                onClick={closeLibrary}
                aria-label="Close library"
              >
                ×
              </button>
            </div>

            <div className="library-content">

              {!selectedCollection ? (
                <>
                  <div className="library-section-label">
                    READING COLLECTIONS
                  </div>

                  {library.collections.map((collection) => (
                    <button
                      key={collection.id}
                      className="library-collection"
                      onClick={() =>
                        setSelectedCollection(collection)
                      }
                    >
                      <div>
                        <div className="collection-sanskrit">
                          {collection.sanskritTitle}
                        </div>

                        <div className="collection-title">
                          {collection.title}
                        </div>

                        <div className="collection-description">
                          {collection.description}
                        </div>
                      </div>

                      <span className="collection-arrow">
                        →
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    className="library-back"
                    onClick={() => setSelectedCollection(null)}
                  >
                    ← Collections
                  </button>

                  <div className="collection-heading">
                    <div className="collection-sanskrit">
                      {selectedCollection.sanskritTitle}
                    </div>

                    <h3>{selectedCollection.title}</h3>
                  </div>

                  {selectedCollection.items.length === 0 ? (
                    <div className="library-empty">
                      This collection is being prepared.
                    </div>
                  ) : (
                    <div className="library-items">
                      {selectedCollection.items.map((item) => {
                        const available = isAvailable(item);
                        const verseCount = getVerseCount(item);

                        return (
                          <button
                            key={item.id}
                            className={`library-item ${
                              available
                                ? ""
                                : "library-item-disabled"
                            }`}
                            onClick={() => openItem(item)}
                            disabled={!available}
                          >
                            <div>
                              <div className="item-sanskrit">
                                {item.sanskritTitle}
                              </div>

                              <div className="item-title">
                                {item.title}
                              </div>

                              {verseCount != null && (
                                <div className="item-meta">
                                  {verseCount} verses
                                </div>
                              )}

                              {!available && (
                                <div className="item-meta">
                                  Coming soon
                                </div>
                              )}
                            </div>

                            <span>
                              {available ? "→" : "•"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

            </div>
          </aside>
        </div>
      )}
    </>
  );
}
