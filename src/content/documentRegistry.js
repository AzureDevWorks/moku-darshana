
/*
 * Moku Darśana
 * Document Registry
 *
 * Discovers complete standalone spiritual works.
 *
 * Architecture:
 *
 *   library.js          = navigation / organization
 *   documentRegistry    = document discovery / summary
 *   content JSON        = complete source document
 *   course              = references documents
 *
 * A document never belongs to a course.
 */

const contentModules = import.meta.glob(
  "./**/*.json",
  {
    eager: true,
    import: "default",
  }
);

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function getVerseCount(document) {
  if (document?.metadata?.verseCount != null) {
    return document.metadata.verseCount;
  }

  if (Array.isArray(document?.verses)) {
    return document.verses.length;
  }

  const verseSection = Array.isArray(document?.sections)
    ? document.sections.find(
        (section) => section?.id === "verses"
      )
    : null;

  if (Array.isArray(verseSection?.items)) {
    return verseSection.items.length;
  }

  return null;
}

function createSummary(document, path) {
  return {
    id: document.id,

    title:
      document.title ||
      document.id,

    sanskritTitle:
      document.sanskritTitle ||
      null,

    type:
      document.type ||
      "other",

    collection:
      document.collection ||
      null,

    metadata:
      document.metadata ||
      {},

    standalone:
      document.metadata?.standalone === true,

    learningModel:
      document.metadata?.learningModel ||
      null,

    verseCount:
      getVerseCount(document),

    sectionCount:
      Array.isArray(document.sections)
        ? document.sections.length
        : 0,

    hasCourse:
      document.course?.enabled === true,

    hasCompletion:
      document.completion?.enabled === true,

    hasAudio:
      document.audio?.enabled === true ||
      Boolean(document.audio),

    path:
      normalizePath(path),
  };
}

const documents = {};
const paths = {};

for (const [path, document] of Object.entries(contentModules)) {
  if (
    !document ||
    typeof document !== "object" ||
    Array.isArray(document)
  ) {
    continue;
  }

  if (
    typeof document.id !== "string" ||
    document.id.trim() === ""
  ) {
    continue;
  }

  const documentId = document.id.trim();
  const normalizedPath = normalizePath(path);

  if (documents[documentId]) {
    console.warn(
      `[Moku Darśana] Duplicate document id "${documentId}". ` +
      `Already registered from "${paths[documentId]}". ` +
      `Ignoring duplicate "${normalizedPath}".`
    );

    continue;
  }

  documents[documentId] =
    createSummary(document, normalizedPath);

  paths[documentId] =
    normalizedPath;
}

export function getDocumentMeta(id) {
  if (typeof id !== "string") {
    return null;
  }

  return documents[id] || null;
}

export function getDocumentPath(id) {
  if (typeof id !== "string") {
    return null;
  }

  return paths[id] || null;
}

export function hasRegisteredDocument(id) {
  if (typeof id !== "string") {
    return false;
  }

  return Boolean(documents[id]);
}

export function getAllDocumentMeta() {
  return Object.values(documents);
}

export function getDocumentsByCollection(collection) {
  if (typeof collection !== "string") {
    return [];
  }

  return Object.values(documents).filter(
    (document) =>
      document.collection === collection
  );
}

export function getStandaloneDocuments() {
  return Object.values(documents).filter(
    (document) =>
      document.standalone === true
  );
}

export function getCourseCapableDocuments() {
  return Object.values(documents).filter(
    (document) =>
      document.hasCourse === true
  );
}

export function getAudioDocuments() {
  return Object.values(documents).filter(
    (document) =>
      document.hasAudio === true
  );
}

export function getCompletionDocuments() {
  return Object.values(documents).filter(
    (document) =>
      document.hasCompletion === true
  );
}

export function getDocumentRegistry() {
  return documents;
}

export default documents;
