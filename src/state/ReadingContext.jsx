import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { loadDocument } from "../utils/documentService";
import { getDocumentMeta } from "../content/documentRegistry";

const ReadingContext = createContext(null);

/*
 * Moku Darśana
 * Reading Context
 *
 * Keeps the selected document and browser URL synchronized.
 *
 * Example:
 *
 *   /devi-mahatmya/patha-purva/argala-stotram
 *
 * The URL is derived from the document registry path, so
 * the content architecture remains the source of truth.
 */

function getDocumentUrl(id) {
  const meta = getDocumentMeta(id);

  if (!meta?.path) {
    return "/";
  }

  const cleanPath = meta.path
    .replace(/^\.\/+/, "")
    .replace(/\\/g, "/");

  const parts = cleanPath.split("/");

  /*
   * Expected content path:
   *
   * ./devi-mahatmya/patha-purva/argala-stotram.json
   *
   * Remove the .json filename.
   */
  if (parts.length < 2) {
    return "/";
  }

  const fileName = parts.pop();
  const documentId = fileName.replace(/\.json$/i, "");

  return "/" + [...parts, documentId]
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function getDocumentIdFromUrl() {
  const pathname = window.location.pathname;

  if (!pathname || pathname === "/") {
    return null;
  }

  const parts = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });

  if (parts.length === 0) {
    return null;
  }

  /*
   * The final URL segment is the document id.
   *
   * /devi-mahatmya/patha-purva/argala-stotram
   *                                      ^^^^^^^^^^^^^
   */
  return parts[parts.length - 1];
}

function createSelectedItem(id, existingItem = null) {
  const meta = getDocumentMeta(id);

  if (!meta) {
    return null;
  }

  return {
    ...(existingItem || {}),
    ...meta,
    id,
  };
}

export function ReadingProvider({ children }) {
  const [selectedItem, setSelectedItemState] = useState(null);

  /*
   * Load a document represented by the current browser URL.
   *
   * This runs once when the application starts.
   */
  useEffect(() => {
    const id = getDocumentIdFromUrl();

    if (!id) {
      return;
    }

    const item = createSelectedItem(id);

    if (item) {
      setSelectedItemState(item);
    } else {
      /*
       * Unknown URL.
       * Leave the application at the library/home state.
       */
      window.history.replaceState({}, "", `${import.meta.env.BASE_URL}`);
    }
  }, []);

  /*
   * Browser Back / Forward.
   */
  useEffect(() => {
    const handlePopState = () => {
      const id = getDocumentIdFromUrl();

      if (!id) {
        setSelectedItemState(null);
        return;
      }

      const item = createSelectedItem(id);

      if (item) {
        setSelectedItemState(item);
      } else {
        setSelectedItemState(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /*
   * Public document-selection function.
   *
   * Existing components can continue doing:
   *
   *   setSelectedItem(item)
   *
   * without knowing anything about URLs.
   */
  const setSelectedItem = useCallback((item) => {
    if (!item) {
      window.history.pushState({}, "", `${import.meta.env.BASE_URL}`);
      setSelectedItemState(null);
      return;
    }

    const id = item.id;

    if (!id) {
      return;
    }

    const selected = createSelectedItem(id, item);

    if (!selected) {
      return;
    }

    const url = getDocumentUrl(id);

    window.history.pushState({}, "", url);

    setSelectedItemState(selected);
  }, []);

  const selectedDocument = selectedItem
    ? loadDocument(selectedItem.id)
    : null;

  return (
    <ReadingContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        selectedDocument,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);

  if (!context) {
    throw new Error(
      "useReading must be used inside ReadingProvider"
    );
  }

  return context;
}

