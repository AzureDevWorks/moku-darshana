/*
 * Moku Darśana
 * Document Service
 *
 * Single application-level API for working with spiritual documents.
 *
 * Components use this service instead of accessing JSON files directly.
 */

import {
  getDocument,
  hasDocument,
  getAllDocuments,
} from "./contentLoader";

import {
  getDocumentMeta,
  getAllDocumentMeta,
  getDocumentsByCollection,
  getStandaloneDocuments,
  getCourseCapableDocuments,
} from "../content/documentRegistry";


/* -------------------------------------------------------
 * Document access
 * ----------------------------------------------------- */

export function loadDocument(id) {
  return getDocument(id);
}

export function documentExists(id) {
  return hasDocument(id);
}


/* -------------------------------------------------------
 * Document metadata
 * ----------------------------------------------------- */

export function getDocumentSummary(id) {
  return getDocumentMeta(id);
}

export function getDocumentSummaries() {
  return getAllDocumentMeta();
}


/* -------------------------------------------------------
 * Collections
 * ----------------------------------------------------- */

export function getDocumentsInCollection(collectionId) {
  return getDocumentsByCollection(collectionId);
}


/* -------------------------------------------------------
 * Standalone works
 * ----------------------------------------------------- */

export function getStandaloneWorks() {
  return getStandaloneDocuments();
}


/* -------------------------------------------------------
 * Course-capable works
 * ----------------------------------------------------- */

export function getCourseCapableWorks() {
  return getCourseCapableDocuments();
}


/* -------------------------------------------------------
 * Complete document list
 * ----------------------------------------------------- */

export function getAllDocumentData() {
  return getAllDocuments();
}


/* -------------------------------------------------------
 * Convenience helpers
 * ----------------------------------------------------- */

export function getDocumentTitle(id) {
  return getDocumentMeta(id)?.title || null;
}

export function getDocumentVerseCount(id) {
  return getDocumentMeta(id)?.verseCount ?? null;
}

export function isStandaloneWork(id) {
  return getDocumentMeta(id)?.standalone === true;
}

export function hasDocumentCourse(id) {
  return getDocumentMeta(id)?.hasCourse === true;
}

export function hasDocumentCompletion(id) {
  return getDocumentMeta(id)?.hasCompletion === true;
}

export function hasDocumentAudio(id) {
  return getDocumentMeta(id)?.hasAudio === true;
}
