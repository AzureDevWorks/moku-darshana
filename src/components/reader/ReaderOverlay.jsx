import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useReading } from "../../state/ReadingContext";
import "./ReaderOverlay.css";

function resolveAudioSrc(path) {
  if (!path || typeof path !== "string") return null;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.trim().replace(/^\/+/, "").replace(/\\/g, "/");
  return `/${normalized}`;
}

function getCollectionTitle(collection) {
  switch (collection) {
    case "patha-purva": return "PĀṬHA PŪRVA";
    case "saptashati": return "SAPTAŚATĪ";
    case "patha-uttara": return "PĀṬHA UTTARA";
    default: return "DEVĪ MĀHĀTMYA";
  }
}

function getSectionLabel(section, index) {
  if (!section) return "";
  return section.titleEn || section.title || `Section ${index + 1}`;
}

function getVerseCount(section) {
  if (!section || section.type !== "verses") return 0;
  return Array.isArray(section.items) ? section.items.length : 0;
}

function getVerseIndexFromHash(verses) {
  if (!Array.isArray(verses) || verses.length === 0) return 0;
  const match = window.location.hash.match(/^#verse-(\d+)$/i);
  if (!match) return 0;
  const requestedVerse = Number(match[1]);
  if (!Number.isInteger(requestedVerse) || requestedVerse < 1 || requestedVerse > verses.length) {
    return 0;
  }
  return requestedVerse - 1;
}

function updateVerseHash(index) {
  const hash = `#verse-${index + 1}`;
  if (window.location.hash !== hash) {
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}${window.location.search}${hash}`
    );
  }
}

function clearVerseHash() {
  if (window.location.hash) {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${window.location.search}`
    );
  }
}

function renderSanskritText(text) {
  if (!text || typeof text !== "string") return null;

  const source = text
    .replace(/।।/g, "॥")
    .replace(/\|\|/g, "॥")
    .replace(/\|/g, "।");

  const lines = [];

  source.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.replace(/[ \t]+/g, " ").trim();
    if (!line) return;

    const verseChunks = line
      .split("॥")
      .map((part, index, arr) => (index < arr.length - 1 ? `${part}॥` : part))
      .map((part) => part.trim())
      .filter((part) => part && part !== "॥");

    const verses = [];
    verseChunks.forEach((chunk) => {
      const isNumberOnly = /^[\d\u0966-\u096F\s]+॥$/.test(chunk);
      if (isNumberOnly && verses.length > 0) {
        verses[verses.length - 1] += ` ${chunk}`;
      } else {
        verses.push(chunk);
      }
    });

    verses.forEach((verse) => {
      const parts = verse.split("।");
      parts.forEach((part, index) => {
        const segment = part.trim();
        if (!segment) return;
        const isLastPart = index === parts.length - 1;
        lines.push(isLastPart ? segment : `${segment}।`);
      });
    });
  });

  if (!lines.length) return null;

  return lines.map((line, index) => (
    <span className="reader-sanskrit-line" key={index}>
      {line}
    </span>
  ));
}

function ReaderOverlay() {
  const { selectedItem, selectedDocument, setSelectedItem } = useReading();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [verseIndex, setVerseIndex] = useState(0);
  const [language, setLanguage] = useState("en");
  const [showContents, setShowContents] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);

  const audioRef = useRef(null);
  const fitContentRef = useRef(null);
  const restoringPositionRef = useRef(false);
  const pendingVerseIndexRef = useRef(null);

  const sections = Array.isArray(selectedDocument?.sections) ? selectedDocument.sections : [];
  const currentSection = sections[sectionIndex] || null;
  const isVerseSection = currentSection?.type === "verses";
  const isFormulaSection = currentSection?.type === "formula";
  const isProseSection = currentSection?.type === "prose";
  const verses = isVerseSection && Array.isArray(currentSection?.items) ? currentSection.items : [];
  const verse = verses[verseIndex] || null;

  const documentTitle = selectedDocument?.title || selectedItem?.title || "Moku Darśana";
  const collectionTitle = getCollectionTitle(selectedDocument?.collection);
  const rawAudioPath = isVerseSection ? verse?.audio || null : currentSection?.audio || null;
  const activeAudioSrc = resolveAudioSrc(rawAudioPath);

  useEffect(() => {
    // Entrance animation flag
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedDocument) return;
    setSectionIndex(0);
    setFlipped(false);
    setIsPlaying(false);
    setAudioError("");

    const firstSection = Array.isArray(selectedDocument.sections) ? selectedDocument.sections[0] : null;
    const firstSectionVerses = firstSection?.type === "verses" && Array.isArray(firstSection.items) ? firstSection.items : [];
    const restoredIndex = getVerseIndexFromHash(firstSectionVerses);

    restoringPositionRef.current = true;
    setVerseIndex(restoredIndex);

    if (firstSectionVerses.length > 0 && !window.location.hash) {
      updateVerseHash(restoredIndex);
    }
    requestAnimationFrame(() => { restoringPositionRef.current = false; });
  }, [selectedDocument?.id]);

  useLayoutEffect(() => {
    const content = fitContentRef.current;
    if (!content) return undefined;
    let frameId = 0;

    const runFit = () => {
      const element = fitContentRef.current;
      if (!element) return;
      const card = element.closest(".reader-card-face");
      if (!card) return;

      const availableWidth = card.clientWidth;
      const availableHeight = card.clientHeight;
      if (availableWidth <= 0 || availableHeight <= 0) return;

      element.style.setProperty("--reader-fit-scale", "1");
      const prevAlignItems = element.style.alignItems;
      const prevJustifyContent = element.style.justifyContent;
      
      element.style.alignItems = "flex-start";
      element.style.justifyContent = "flex-start";
      void element.offsetHeight;

      const naturalWidth = element.scrollWidth;
      const naturalHeight = element.scrollHeight;

      element.style.alignItems = prevAlignItems;
      element.style.justifyContent = prevJustifyContent;

      if (naturalWidth <= 0 || naturalHeight <= 0) return;

      // Give a little more breathing room padding
      const targetWidth = availableWidth * 0.90; 
      const targetHeight = availableHeight * 0.90;
      const horizontalScale = targetWidth / naturalWidth;
      const verticalScale = targetHeight / naturalHeight;
      let scale = Math.min(1, horizontalScale, verticalScale);
      scale = Math.max(0.62, scale);

      element.style.setProperty("--reader-fit-scale", scale.toFixed(3));
    };

    runFit();
    const scheduleFit = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(runFit);
    };

    const observer = new ResizeObserver(scheduleFit);
    observer.observe(content);
    if (content.parentElement) observer.observe(content.parentElement);
    window.addEventListener("resize", scheduleFit);

    let fontCancelled = false;
    if (typeof document !== "undefined" && document.fonts && typeof document.fonts.ready?.then === "function") {
      document.fonts.ready.then(() => { if (!fontCancelled) scheduleFit(); }).catch(() => {});
    }

    return () => {
      fontCancelled = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", scheduleFit);
    };
  }, [selectedDocument?.id, sectionIndex, verseIndex, language, flipped]);

  useEffect(() => {
    if (restoringPositionRef.current) return;
    const pendingIndex = pendingVerseIndexRef.current;
    pendingVerseIndexRef.current = null;

    if (Number.isInteger(pendingIndex) && pendingIndex >= 0 && pendingIndex < verses.length) {
      setVerseIndex(pendingIndex);
    } else {
      setVerseIndex(0);
    }

    setFlipped(false);
    setIsPlaying(false);
    setAudioError("");

    if (isVerseSection && verses.length > 0) {
      const targetIndex = Number.isInteger(pendingIndex) && pendingIndex >= 0 && pendingIndex < verses.length ? pendingIndex : 0;
      updateVerseHash(targetIndex);
    } else {
      clearVerseHash();
    }
  }, [sectionIndex]);

  useEffect(() => {
    if (!verses.length) { setVerseIndex(0); return; }
    if (verseIndex >= verses.length) setVerseIndex(verses.length - 1);
  }, [verses.length, verseIndex]);

  useEffect(() => {
    if (!selectedDocument || !isVerseSection || !verses.length || restoringPositionRef.current) return;
    updateVerseHash(verseIndex);
  }, [verseIndex, selectedDocument?.id, isVerseSection, verses.length]);

  useEffect(() => {
    const handlePopState = () => {
      if (!selectedDocument || !isVerseSection || !verses.length) return;
      const restoredIndex = getVerseIndexFromHash(verses);
      restoringPositionRef.current = true;
      setVerseIndex(restoredIndex);
      setFlipped(false);
      setIsPlaying(false);
      setAudioError("");
      requestAnimationFrame(() => { restoringPositionRef.current = false; });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedDocument?.id, isVerseSection, verses.length]);

  useEffect(() => {
    const handleHashChange = () => {
      if (!selectedDocument || !isVerseSection || !verses.length) return;
      const restoredIndex = getVerseIndexFromHash(verses);
      restoringPositionRef.current = true;
      setVerseIndex(restoredIndex);
      setFlipped(false);
      setIsPlaying(false);
      setAudioError("");
      requestAnimationFrame(() => { restoringPositionRef.current = false; });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [selectedDocument?.id, isVerseSection, verses.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError("");
    setIsPlaying(false);
    audio.pause();

    if (!activeAudioSrc) {
      audio.removeAttribute("src");
      audio.load();
      return;
    }
    audio.src = activeAudioSrc;
    audio.currentTime = 0;
    audio.load();
  }, [activeAudioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handlePlay = () => { setIsPlaying(true); setAudioError(""); };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      const mediaError = audio.error;
      if (!mediaError) { setAudioError("Unable to play this audio."); return; }
      switch (mediaError.code) {
        case MediaError.MEDIA_ERR_ABORTED: setAudioError("Audio playback was aborted."); break;
        case MediaError.MEDIA_ERR_NETWORK: setAudioError("Audio could not be loaded."); break;
        case MediaError.MEDIA_ERR_DECODE: setAudioError("This audio file could not be decoded."); break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: setAudioError("This audio format is not supported."); break;
        default: setAudioError("Unable to play this audio.");
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedDocument) return;
      if (event.key === "Escape") {
        if (showContents) setShowContents(false);
        else if (flipped) setFlipped(false);
        else handleClose();
        return;
      }
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
      
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrevious();
      if (event.key === " ") { event.preventDefault(); toggleAudio(); }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDocument, showContents, flipped, sectionIndex, verseIndex, sections.length, verses.length, activeAudioSrc]);

  if (!selectedDocument) return null;

  function handleClose() {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
    setIsPlaying(false);
    setFlipped(false);
    setShowContents(false);
    setAudioError("");
    if (typeof setSelectedItem === "function") setSelectedItem(null);
  }

  function selectSection(index) {
    if (index < 0 || index >= sections.length) return;
    pendingVerseIndexRef.current = 0;
    setSectionIndex(index);
    setFlipped(false);
    setShowContents(false);
  }

  function handlePrevious() {
    if (isVerseSection && verses.length > 0) {
      if (verseIndex > 0) { setVerseIndex((value) => value - 1); setFlipped(false); return; }
      if (sectionIndex > 0) {
        const previousIndex = sectionIndex - 1;
        const previousSection = sections[previousIndex];
        if (previousSection?.type === "verses") {
          const previousVerses = Array.isArray(previousSection.items) ? previousSection.items : [];
          pendingVerseIndexRef.current = previousVerses.length > 0 ? previousVerses.length - 1 : 0;
        } else {
          pendingVerseIndexRef.current = 0;
        }
        setSectionIndex(previousIndex);
        setFlipped(false);
      }
      return;
    }
    if (sectionIndex > 0) {
      pendingVerseIndexRef.current = 0;
      setSectionIndex((value) => value - 1);
      setFlipped(false);
    }
  }

  function handleNext() {
    if (isVerseSection && verses.length > 0) {
      if (verseIndex < verses.length - 1) { setVerseIndex((value) => value + 1); setFlipped(false); return; }
      if (sectionIndex < sections.length - 1) {
        pendingVerseIndexRef.current = 0;
        setSectionIndex((value) => value + 1);
        setFlipped(false);
      }
      return;
    }
    if (sectionIndex < sections.length - 1) {
      pendingVerseIndexRef.current = 0;
      setSectionIndex((value) => value + 1);
      setFlipped(false);
    }
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!activeAudioSrc) { setAudioError("No audio is available for this section."); return; }
    setAudioError("");

    try {
      const expectedSrc = activeAudioSrc.startsWith("http://") || activeAudioSrc.startsWith("https://") 
        ? activeAudioSrc : window.location.origin + activeAudioSrc;

      if (audio.src !== expectedSrc) {
        audio.src = activeAudioSrc;
        audio.currentTime = 0;
        audio.load();
      }
      if (audio.paused) await audio.play();
      else audio.pause();
    } catch (error) {
      setIsPlaying(false);
      if (error?.name === "NotAllowedError") setAudioError("Playback was blocked by the browser. Press the audio button again.");
      else if (error?.name === "NotSupportedError") setAudioError("This audio format is not supported.");
      else setAudioError("Unable to start audio playback.");
    }
  }

  function renderVerseFront(item) {
    if (!item) return <div className="reader-empty">No verse available.</div>;
    const meaning = item.meaning?.[language] || item.meaning?.en || item.meaning?.ne || "";

    return (
      <div ref={fitContentRef} className="reader-card-content">
        <div className="reader-verse-number">Verse {item.number ?? verseIndex + 1}</div>
        <div className="reader-sanskrit">{renderSanskritText(item.sanskrit)}</div>
        {item.iast && <div className="reader-iast">{item.iast}</div>}
        {meaning && <div className="reader-meaning">{meaning}</div>}
      </div>
    );
  }

  function renderFormulaFront(section) {
    if (!section) return <div className="reader-empty">No formula available.</div>;
    const meaning = section.meaning?.[language] || section.meaning?.en || section.meaning?.ne || "";

    return (
      <div ref={fitContentRef} className="reader-card-content">
        <div className="reader-section-label">{section.titleEn || section.title}</div>
        {section.sanskrit && <div className="reader-sanskrit">{renderSanskritText(section.sanskrit)}</div>}
        {section.iast && <div className="reader-iast">{section.iast}</div>}
        {meaning && <div className="reader-meaning">{meaning}</div>}
      </div>
    );
  }

  function renderProseSection(section) {
    if (!section) return <div className="reader-empty">No content available.</div>;
    const text = section[language] || section.en || section.ne || "";

    return (
      <div ref={fitContentRef} className="reader-card-content reader-prose">
        <div className="reader-section-label">{section.titleEn || section.title}</div>
        {section.title && section.titleEn && <div className="reader-prose-title">{section.title}</div>}
        <div className="reader-prose-text">{text}</div>
      </div>
    );
  }

  function renderCommentary() {
    let commentary = "";
    if (isVerseSection && verse) commentary = verse.commentary?.[language] || verse.commentary?.en || verse.commentary?.ne || "";
    else if (isFormulaSection && currentSection) commentary = currentSection.commentary?.[language] || currentSection.commentary?.en || currentSection.commentary?.ne || "";
    else {
      return (
        <div ref={fitContentRef} className="reader-card-content">
          <div className="reader-back-label">About This Section</div>
          <div className="reader-commentary">This section contains explanatory material rather than a verse-by-verse commentary.</div>
        </div>
      );
    }

    return (
      <div ref={fitContentRef} className="reader-card-content">
        <div className="reader-back-label">Commentary</div>
        {commentary ? <div className="reader-commentary">{commentary}</div> : <div className="reader-empty">Commentary is not available for this.</div>}
      </div>
    );
  }

  const canFlip = isVerseSection || isFormulaSection;
  const progressText = isVerseSection && verses.length ? `Verse ${verseIndex + 1} of ${verses.length}` : "";

  return (
    <div className={`reader-overlay ${isAnimating ? 'animating' : ''}`}>
      <div className="reader-backdrop" onClick={handleClose} aria-hidden="true" />

      <div className="reader-shell" role="dialog" aria-modal="true" aria-label={documentTitle}>
        <header className="reader-header">
          <div className="reader-header-left">
            <div className="reader-collection">{collectionTitle}</div>
            <h1 className="reader-title">{documentTitle}</h1>
          </div>

          <div className="reader-header-actions">
            <button type="button" className="reader-icon-button" onClick={() => setShowContents((value) => !value)} aria-label="Open contents" title="Contents">☰</button>
            <button type="button" className="reader-icon-button close-btn" onClick={handleClose} aria-label="Close reader" title="Close">×</button>
          </div>
        </header>

        <div className="reader-toolbar">
          <div className="reader-language-switch">
            <button type="button" className={language === "ne" ? "reader-language active" : "reader-language"} onClick={() => {setLanguage("ne"); setFlipped(false);}}>नेपाली</button>
            <button type="button" className={language === "en" ? "reader-language active" : "reader-language"} onClick={() => {setLanguage("en"); setFlipped(false);}}>English</button>
          </div>
          <div className="reader-toolbar-center">
            {currentSection && <span>{getSectionLabel(currentSection, sectionIndex)}</span>}
          </div>
          <div className="reader-toolbar-right">
            {canFlip && (
              <button type="button" className="reader-secondary-button" onClick={() => setFlipped((value) => !value)}>
                {flipped ? "Read" : "Commentary"}
              </button>
            )}
            <button type="button" className={`reader-audio-button ${isPlaying ? "playing" : ""}`} onClick={toggleAudio} disabled={!activeAudioSrc} aria-label={isPlaying ? "Pause audio" : "Listen to audio"} title={isPlaying ? "Pause audio" : "Listen to audio"}>
              <span className="reader-audio-icon" aria-hidden="true">{isPlaying ? "❚❚" : "▶"}</span>
            </button>
          </div>
        </div>

        {audioError && <div className="reader-audio-error" role="status">{audioError}</div>}

        <main className="reader-main">
          <div className="reader-page">
            <div className={`reader-card ${flipped ? "flipped" : ""}`}>
              <div className="reader-card-face reader-card-front">
                {isVerseSection && renderVerseFront(verse)}
                {isFormulaSection && renderFormulaFront(currentSection)}
                {isProseSection && renderProseSection(currentSection)}
              </div>
              {canFlip && (
                <div className="reader-card-face reader-card-back">
                  {renderCommentary()}
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="reader-footer">
          <button type="button" className="reader-nav-button" onClick={handlePrevious} disabled={sectionIndex === 0 && (!isVerseSection || verseIndex === 0)}>← Previous</button>
          <div className="reader-progress">
            <div className="reader-progress-main">{progressText || `Section ${sectionIndex + 1} of ${sections.length}`}</div>
            <div className="reader-progress-sub">{sectionIndex + 1} / {sections.length}</div>
          </div>
          <button type="button" className="reader-nav-button" onClick={handleNext} disabled={sectionIndex >= sections.length - 1 && (!isVerseSection || verseIndex >= verses.length - 1)}>Next →</button>
        </footer>

        {showContents && (
          <aside className="reader-contents">
            <div className="reader-contents-header">
              <div>
                <div className="reader-contents-kicker">CONTENTS</div>
                <h2>{documentTitle}</h2>
              </div>
              <button type="button" className="reader-icon-button" onClick={() => setShowContents(false)} aria-label="Close contents">×</button>
            </div>
            <div className="reader-contents-list">
              {sections.map((section, index) => {
                const active = index === sectionIndex;
                return (
                  <button type="button" key={section.id || index} className={`reader-content-item ${active ? "active" : ""}`} onClick={() => selectSection(index)}>
                    <span className="reader-content-number">{index + 1}</span>
                    <span className="reader-content-text">
                      <span className="reader-content-title">{section.titleEn || section.title || `Section ${index + 1}`}</span>
                      {section.type === "verses" && <span className="reader-content-meta">{getVerseCount(section)} verses</span>}
                      {section.type === "formula" && <span className="reader-content-meta">Formula</span>}
                      {section.type === "prose" && <span className="reader-content-meta">Reading</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
        <audio ref={audioRef} preload="metadata" className="reader-audio" />
      </div>
    </div>
  );
}

export default ReaderOverlay;