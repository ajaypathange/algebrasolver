import { Link } from "react-router-dom"
import "../styles/HomePage.css"

function HomePage() {
  const features = [
    {
      title: "Equation Solver",
      description: "Solve linear equations step-by-step with detailed explanations",
      icon: "⚖️",
      link: "/solver",
    },
    {
      title: "Expression Simplifier",
      description: "Simplify algebraic expressions and combine like terms",
      icon: "✨",
      link: "/simplifier",
    },
    {
      title: "Graph Visualizer",
      description: "Plot linear equations and visualize systems of equations",
      icon: "📊",
      link: "/graph",
    },
    {
      title: "Practice Problems",
      description: "Generate random problems and track your progress",
      icon: "📝",
      link: "/practice",
    },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Master Basic Algebra</h1>
          <p>Learn and practice algebra concepts with interactive visualizations and step-by-step solutions</p>
          <Link to="/solver" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="concepts">
        <h2>Algebra Concepts Covered</h2>
        <div className="concepts-grid">
          <div className="concept-item">
            <h4>Linear Equations</h4>
            <p>Solve equations like 3x + 2 = 11</p>
          </div>
          <div className="concept-item">
            <h4>Expression Simplification</h4>
            <p>Combine like terms and simplify</p>
          </div>
          <div className="concept-item">
            <h4>Graphing</h4>
            <p>Visualize linear functions</p>
          </div>
          <div className="concept-item">
            <h4>Systems of Equations</h4>
            <p>Plot multiple equations</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
