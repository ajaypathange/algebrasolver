"use client"

import { useState } from "react"
import axios from "axios"
import "../styles/SolverPage.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

function SolverPage() {
  const [equation, setEquation] = useState("")
  const [solution, setSolution] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSolve = async () => {
    if (!equation.trim()) {
      setError("Please enter an equation")
      return
    }

    setLoading(true)
    setError("")
    setSolution(null)

    try {
      const response = await axios.post(`${API_URL}/api/solve`, { equation })
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setSolution(response.data)
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  const examples = ["2x + 5 = 13", "3x - 7 = 2", "x + 10 = 25"]

  return (
    <div className="solver-page">
      <h1>Equation Solver</h1>
      <p className="subtitle">Solve linear equations step by step</p>

      <div className="solver-container">
        <div className="input-section">
          <label>Enter an equation (e.g., 2x + 5 = 13):</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g., 3x + 2 = 11"
            onKeyPress={(e) => e.key === "Enter" && handleSolve()}
          />
          <button onClick={handleSolve} disabled={loading} className="solve-btn">
            {loading ? "Solving..." : "Solve"}
          </button>

          <div className="examples">
            <p>Examples:</p>
            {examples.map((ex, idx) => (
              <button key={idx} className="example-btn" onClick={() => setEquation(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {solution && (
          <div className="solution-section">
            <h2>Solution: x = {solution.solution}</h2>
            <div className="steps">
              <h3>Steps:</h3>
              {solution.steps.map((step, idx) => (
                <div key={idx} className="step">
                  <span className="step-number">{idx + 1}</span>
                  <div className="step-content">
                    <p className="equation">{step.equation}</p>
                    <p className="description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SolverPage
