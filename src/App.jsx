import DarshanaCanvas from "./components/DarshanaCanvas";
import HomeOverlay from "./components/HomeOverlay";
import ReaderOverlay from "./components/reader/ReaderOverlay";
import LibraryOverlay from "./components/library/LibraryOverlay";
import { ReadingProvider } from "./state/ReadingContext";

function App() {
  return (
    <ReadingProvider>
      <main
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#090706",
        }}
      >
        <DarshanaCanvas />

        <HomeOverlay />

        <ReaderOverlay />

        <LibraryOverlay />
      </main>
    </ReadingProvider>
  );
}

export default App;
