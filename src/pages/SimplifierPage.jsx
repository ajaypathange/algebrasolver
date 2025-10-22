"use client"

import { useState } from "react"
import "../styles/SimplifierPage.css"

function SimplifierPage() {
  const [expression, setExpression] = useState("")
  const [simplified, setSimplified] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSimplify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSimplified(null)

    try {
      const response = await fetch("http://localhost:5000/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression }),
      })

      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSimplified(data)
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="simplifier-page">
      <h1>Expression Simplifier</h1>
      <p className="subtitle">Simplify algebraic expressions (e.g., 2x + 3x - 5)</p>

      <form onSubmit={handleSimplify} className="simplifier-form">
        <div className="form-group">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Enter expression (e.g., 2x + 3x - 5)"
            className="input-field"
          />
          <button type="submit" className="simplify-button" disabled={loading}>
            {loading ? "Simplifying..." : "Simplify"}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {simplified && (
        <div className="result-container">
          <div className="original-box">
            <h3>Original Expression</h3>
            <p className="expression-text">{simplified.original}</p>
          </div>

          <div className="arrow">→</div>

          <div className="simplified-box">
            <h3>Simplified Expression</h3>
            <p className="expression-text">{simplified.simplified}</p>
          </div>

          {simplified.steps && simplified.steps.length > 0 && (
            <div className="steps-container">
              <h3>Simplification Steps</h3>
              <div className="steps-list">
                {simplified.steps.map((step, index) => (
                  <div key={index} className="step">
                    <span className="step-number">{index + 1}.</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="examples">
        <h3>Example Expressions</h3>
        <ul>
          <li>2x + 3x - 5</li>
          <li>4a + 2b - a + 3b</li>
          <li>5x + 2 - 3x + 1</li>
          <li>3y - 2y + 4y</li>
        </ul>
      </div>
    </div>
  )
}

export default SimplifierPage
