"use client"

import { useState } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import "../styles/GraphPage.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

function GraphPage() {
  const [equation, setEquation] = useState("x")
  const [graphData, setGraphData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGraph = async () => {
    if (!equation.trim()) {
      setError("Please enter an equation")
      return
    }

    setLoading(true)
    setError("")
    setGraphData(null)

    try {
      const response = await axios.post(`${API_URL}/api/graph`, { equation })
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setGraphData(response.data)
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  const examples = ["x", "2*x + 3", "x^2", "sin(x)", "sqrt(x)"]

  return (
    <div className="graph-page">
      <h1>Graph Visualizer</h1>
      <p className="subtitle">Visualize equations and functions</p>

      <div className="graph-container">
        <div className="input-section">
          <label>Enter an equation:</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g., 2*x + 3"
            onKeyPress={(e) => e.key === "Enter" && handleGraph()}
          />
          <button onClick={handleGraph} disabled={loading} className="graph-btn">
            {loading ? "Generating..." : "Generate Graph"}
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

        {graphData && (
          <div className="graph-section">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={graphData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="y" stroke="#667eea" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphPage
