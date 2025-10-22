"use client"

import { useState } from "react"
import "../styles/SolverPage.css"

function SolverPage() {
  const [equation, setEquation] = useState("")
  const [solution, setSolution] = useState(null)
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSolve = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSolution(null)
    setSteps([])

    try {
      const response = await fetch("http://localhost:5000/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equation }),
      })

      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSolution(data.solution)
        setSteps(data.steps)
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="solver-page">
      <h1>Equation Solver</h1>
      <p className="subtitle">Enter a linear equation to solve (e.g., 3x + 2 = 11)</p>

      <form onSubmit={handleSolve} className="solver-form">
        <div className="form-group">
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter equation (e.g., 2x + 5 = 13)"
            className="input-field"
          />
          <button type="submit" className="solve-button" disabled={loading}>
            {loading ? "Solving..." : "Solve"}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {solution !== null && (
        <div className="solution-container">
          <div className="solution-box">
            <h2>Solution</h2>
            <div className="solution-result">
              <p className="solution-value">x = {solution}</p>
            </div>
          </div>

          {steps.length > 0 && (
            <div className="steps-container">
              <h2>Step-by-Step Solution</h2>
              <div className="steps-list">
                {steps.map((step, index) => (
                  <div key={index} className="step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <p className="step-equation">{step.equation}</p>
                      <p className="step-description">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="examples">
        <h3>Example Equations</h3>
        <ul>
          <li>2x + 3 = 7</li>
          <li>5x - 10 = 0</li>
          <li>3x + 2 = 11</li>
          <li>-2x + 8 = 4</li>
        </ul>
      </div>
    </div>
  )
}

export default SolverPage
