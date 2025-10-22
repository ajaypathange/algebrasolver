"use client"

import { useState } from "react"
import axios from "axios"
import "../styles/SimplifierPage.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

function SimplifierPage() {
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSimplify = async () => {
    if (!expression.trim()) {
      setError("Please enter an expression")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await axios.post(`${API_URL}/api/simplify`, { expression })
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setResult(response.data)
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  const examples = ["2x + 3x", "5a + 2b - 3a + b", "4x + 2 - x + 5"]

  return (
    <div className="simplifier-page">
      <h1>Expression Simplifier</h1>
      <p className="subtitle">Combine like terms and simplify expressions</p>

      <div className="simplifier-container">
        <div className="input-section">
          <label>Enter an expression:</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g., 2x + 3x + 5"
            onKeyPress={(e) => e.key === "Enter" && handleSimplify()}
          />
          <button onClick={handleSimplify} disabled={loading} className="simplify-btn">
            {loading ? "Simplifying..." : "Simplify"}
          </button>

          <div className="examples">
            <p>Examples:</p>
            {examples.map((ex, idx) => (
              <button key={idx} className="example-btn" onClick={() => setExpression(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-section">
            <div className="result-box">
              <p className="label">Original:</p>
              <p className="expression">{result.original}</p>
            </div>
            <div className="arrow">→</div>
            <div className="result-box">
              <p className="label">Simplified:</p>
              <p className="expression simplified">{result.simplified}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimplifierPage
