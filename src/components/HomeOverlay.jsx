import { useEffect } from "react";
import { useReading } from "../state/ReadingContext";
import "./HomeOverlay.css";

export default function HomeOverlay() {
  const { selectedItem } = useReading();

  /*
   * The home surface disappears whenever a document is being read.
   */
  if (selectedItem) {
    return null;
  }

  const openLibrary = () => {
    window.dispatchEvent(
      new CustomEvent("moku:open-library")
    );
  };

  return (
    <section className="home-overlay" aria-label="Moku Darśana home">

      <div className="home-content">

        <div className="home-eyebrow">
          MOKU DARŚANA
        </div>

        <h1 className="home-title">
          Moku Darśana
        </h1>

        <div className="home-sanskrit">
          दर्शन
        </div>

        <p className="home-subtitle">
          A Sacred Digital Library
        </p>

        <div className="home-divider" />

        <p className="home-invitation">
          Read&nbsp;&nbsp;·&nbsp;&nbsp;Listen&nbsp;&nbsp;·&nbsp;&nbsp;Contemplate
        </p>

        <button
          className="home-enter"
          type="button"
          onClick={openLibrary}
        >
          <span>ENTER DARŚANA</span>
          <span className="home-enter-arrow">→</span>
        </button>

        <div className="home-library">

          <div className="home-library-label">
            SACRED LIBRARY
          </div>

          <div className="home-library-line" />

          <div className="home-categories">
            <span>Devī Māhātmya</span>
            <span>Stotras</span>
            <span>Sūktas</span>
            <span>Kavacas</span>
          </div>

        </div>

      </div>

    </section>
  );
}
