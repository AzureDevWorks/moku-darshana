/*
 * Moku Darśana
 * Content Loader
 *
 * Loads complete standalone documents.
 * Metadata/registry concerns are kept separate.
 */

const contentModules = import.meta.glob(
  "../content/**/*.json",
  {
    eager: true,
    import: "default",
  }
);

const contentIndex = {};

for (const [path, content] of Object.entries(contentModules)) {

  if (!content || typeof content !== "object") {
    continue;
  }

  if (!content.id) {
    continue;
  }

  contentIndex[content.id] = content;
}

export function getDocument(id) {
  return contentIndex[id] ?? null;
}

export function hasDocument(id) {
  return Boolean(contentIndex[id]);
}

export function getAllDocuments() {
  return Object.values(contentIndex);
}

export default contentIndex;
