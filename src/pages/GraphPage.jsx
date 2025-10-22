"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import "../styles/GraphPage.css"

function GraphPage() {
  const [equation1, setEquation1] = useState("y = 2x + 1")
  const [equation2, setEquation2] = useState("")
  const [graphData, setGraphData] = useState([])
  const [lines, setLines] = useState([])

  const generateGraphData = (eq1, eq2) => {
    const data = []
    const xRange = 10

    for (let x = -xRange; x <= xRange; x++) {
      const point = { x }

      // Parse and evaluate first equation
      if (eq1) {
        try {
          const y1 = evaluateEquation(eq1, x)
          point.y1 = Number.parseFloat(y1.toFixed(2))
        } catch (e) {
          console.error("Error parsing equation 1")
        }
      }

      // Parse and evaluate second equation
      if (eq2) {
        try {
          const y2 = evaluateEquation(eq2, x)
          point.y2 = Number.parseFloat(y2.toFixed(2))
        } catch (e) {
          console.error("Error parsing equation 2")
        }
      }

      data.push(point)
    }

    return data
  }

  const evaluateEquation = (equation, x) => {
    // Simple parser for y = mx + b format
    const cleanEq = equation.replace(/y\s*=\s*/, "").trim()
    const expr = cleanEq.replace(/x/g, `(${x})`)
    return Function('"use strict"; return (' + expr + ")")()
  }

  const handlePlot = () => {
    const data = generateGraphData(equation1, equation2)
    setGraphData(data)

    const newLines = []
    if (equation1) newLines.push({ name: equation1, dataKey: "y1", stroke: "#6366f1" })
    if (equation2) newLines.push({ name: equation2, dataKey: "y2", stroke: "#ec4899" })
    setLines(newLines)
  }

  return (
    <div className="graph-page">
      <h1>Graph Visualizer</h1>
      <p className="subtitle">Plot linear equations and visualize systems</p>

      <div className="graph-controls">
        <div className="equation-input">
          <label>Equation 1:</label>
          <input
            type="text"
            value={equation1}
            onChange={(e) => setEquation1(e.target.value)}
            placeholder="e.g., y = 2x + 1"
            className="input-field"
          />
        </div>

        <div className="equation-input">
          <label>Equation 2 (optional):</label>
          <input
            type="text"
            value={equation2}
            onChange={(e) => setEquation2(e.target.value)}
            placeholder="e.g., y = -x + 3"
            className="input-field"
          />
        </div>

        <button onClick={handlePlot} className="plot-button">
          Plot Graph
        </button>
      </div>

      {graphData.length > 0 && (
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={graphData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  name={line.name}
                  dot={false}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="examples">
        <h3>Example Equations</h3>
        <ul>
          <li>y = 2x + 1</li>
          <li>y = -x + 3</li>
          <li>y = 0.5x - 2</li>
          <li>y = 3x</li>
        </ul>
      </div>
    </div>
  )
}

export default GraphPage
