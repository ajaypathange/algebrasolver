"use client"

import { useState, useEffect } from "react"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import "../styles/ProgressPage.css"

function ProgressPage() {
  const [attempts, setAttempts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getHistory")
      const data = await response.json()
      setAttempts(data.attempts || [])

      // Calculate stats
      const correct = data.attempts?.filter((a) => a.correct).length || 0
      const total = data.attempts?.length || 0
      setStats({
        correct,
        incorrect: total - correct,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      })
    } catch (err) {
      console.error("Error fetching progress:", err)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: "Correct", value: stats?.correct || 0 },
    { name: "Incorrect", value: stats?.incorrect || 0 },
  ]

  const COLORS = ["#10b981", "#ef4444"]

  return (
    <div className="progress-page">
      <h1>Your Progress</h1>
      <p className="subtitle">Track your practice performance</p>

      {loading ? (
        <p>Loading progress...</p>
      ) : (
        <>
          {stats && (
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Attempts</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
              <div className="stat-card">
                <h3>Correct Answers</h3>
                <p className="stat-number correct">{stats.correct}</p>
              </div>
              <div className="stat-card">
                <h3>Accuracy</h3>
                <p className="stat-number">{stats.accuracy}%</p>
              </div>
            </div>
          )}

          {stats && stats.total > 0 && (
            <div className="charts-container">
              <div className="chart">
                <h3>Performance Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {attempts.length > 0 && (
            <div className="attempts-container">
              <h3>Recent Attempts</h3>
              <div className="attempts-list">
                {attempts
                  .slice(-10)
                  .reverse()
                  .map((attempt, index) => (
                    <div key={index} className={`attempt-item ${attempt.correct ? "correct" : "incorrect"}`}>
                      <span className="attempt-equation">{attempt.equation}</span>
                      <span className="attempt-answer">Your answer: {attempt.userAnswer}</span>
                      <span className="attempt-status">{attempt.correct ? "✓ Correct" : "✗ Incorrect"}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {attempts.length === 0 && (
            <div className="no-data">
              <p>No practice attempts yet. Start practicing to see your progress!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProgressPage
