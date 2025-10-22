import { Link } from "react-router-dom"
import "../styles/HomePage.css"

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Master Algebra with AlgebraSolver</h1>
        <p>Learn equations, simplify expressions, visualize graphs, and practice problems</p>
        <div className="hero-buttons">
          <Link to="/solver" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/practice" className="btn btn-secondary">
            Practice Now
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Equation Solver</h3>
          <p>Solve linear and quadratic equations with step-by-step explanations</p>
          <Link to="/solver" className="feature-link">
            Try it →
          </Link>
        </div>
        <div className="feature-card">
          <h3>Expression Simplifier</h3>
          <p>Simplify algebraic expressions by combining like terms</p>
          <Link to="/simplifier" className="feature-link">
            Try it →
          </Link>
        </div>
        <div className="feature-card">
          <h3>Graph Visualizer</h3>
          <p>Visualize equations and functions with interactive graphs</p>
          <Link to="/graph" className="feature-link">
            Try it →
          </Link>
        </div>
        <div className="feature-card">
          <h3>Practice Problems</h3>
          <p>Solve randomly generated problems and track your progress</p>
          <Link to="/practice" className="feature-link">
            Try it →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
