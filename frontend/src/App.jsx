import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SolverPage from "./pages/SolverPage"
import SimplifierPage from "./pages/SimplifierPage"
import GraphPage from "./pages/GraphPage"
import PracticePage from "./pages/PracticePage"
import ProgressPage from "./pages/ProgressPage"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <span className="logo-icon">∑</span> AlgebraSolver
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/solver" className="nav-link">
                  Solver
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/simplifier" className="nav-link">
                  Simplifier
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/graph" className="nav-link">
                  Graph
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/practice" className="nav-link">
                  Practice
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link">
                  Progress
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solver" element={<SolverPage />} />
            <Route path="/simplifier" element={<SimplifierPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2025 AlgebraSolver - Learn Algebra Interactively</p>
            <p>Master equations, expressions, and graphs with step-by-step guidance</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
