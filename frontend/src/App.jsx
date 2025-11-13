import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnimalList from "./components/AnimalList";
import AnimalDetails from "./components/AnimalDetails";
import AdoptionForm from "./components/AdoptionForm";
import ThankYou from "./components/ThankYou";

function App() {
  return (
    <Router>
      <div className="app-shell">
        {/* Ylänavigaatio */}
        <header className="topbar">
          <div className="topbar-inner container">
            <div className="logo">
              <span className="logo-icon">🐾</span>
              <span className="logo-text">Vaasan eläinadoptio</span>
            </div>

            <nav className="nav">
              <Link to="/">Etusivu</Link>
            </nav>
          </div>
        </header>

        {/* Varsinainen sisältö (sivut vaihtuvat tähän) */}
        <main className="main">
          <Routes>
            <Route path="/" element={<AnimalList />} />
            <Route path="/animal/:id" element={<AnimalDetails />} />
            <Route path="/animal/:id/adopt" element={<AdoptionForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="site-footer">
          Made with <span className="heart">❤️</span> Vaasan Eläinsuoja ry by Farhio & Gabriela
        </footer>
      </div>
    </Router>
  );
}

export default App;

