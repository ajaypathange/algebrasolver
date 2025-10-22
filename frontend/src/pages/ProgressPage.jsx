"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getUserId } from "../utils/userUtils"
import "../styles/ProgressPage.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

function ProgressPage() {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userId] = useState(() => getUserId())

  useEffect(() => {
    console.log("[v0] ProgressPage mounted with userId:", userId)
    fetchHistory()
    const interval = setInterval(fetchHistory, 3000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchHistory = async () => {
    try {
      console.log("[v0] Fetching history for userId:", userId)
      const response = await axios.get(`${API_URL}/api/history/${userId}`)
      console.log("[v0] History response:", response.data)

      const attempts = response.data.attempts || []
      setHistory(attempts)
      setError(null)

      // Calculate stats
      const total = attempts.length
      const correct = attempts.filter((a) => a.correct).length
      const incorrect = total - correct
      const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : 0

      console.log("[v0] Calculated stats:", { total, correct, incorrect, accuracy })

      setStats({
        total,
        correct,
        incorrect,
        accuracy,
      })
    } catch (err) {
      console.error("[v0] Error fetching history:", err.message)
      setError(`Error loading progress: ${err.message}. Make sure backend is running on port 5000.`)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchHistory()
  }

  const pieData = [
    { name: "Correct", value: stats?.correct || 0 },
    { name: "Incorrect", value: stats?.incorrect || 0 },
  ]

  const COLORS = ["#10b981", "#ef4444"]

  const barData = [
    { name: "Correct", value: stats?.correct || 0 },
    { name: "Incorrect", value: stats?.incorrect || 0 },
  ]

  return (
    <div className="progress-page">
      <h1>Your Progress</h1>
      <p className="subtitle">Track your learning journey</p>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {loading && !stats ? (
        <p className="loading-message">Loading your progress...</p>
      ) : (
        <div className="progress-container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Problems</h3>
              <p className="stat-value">{stats?.total || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Correct Answers</h3>
              <p className="stat-value">{stats?.correct || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Accuracy</h3>
              <p className="stat-value">{stats?.accuracy || 0}%</p>
            </div>
          </div>

          {stats && stats.total > 0 && (
            <div className="charts-container">
              <div className="chart-box">
                <h2>Performance Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-box">
                <h2>Performance Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {history.length > 0 ? (
            <div className="history-container">
              <h2>Recent Attempts</h2>
              <div className="history-list">
                {history.slice(0, 10).map((attempt, idx) => (
                  <div key={idx} className={`history-item ${attempt.correct ? "correct" : "incorrect"}`}>
                    <span className="equation">{attempt.equation}</span>
                    <span className="answer">Your answer: {attempt.userAnswer}</span>
                    <span className="status">{attempt.correct ? "✓" : "✗"}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No attempts yet. Start practicing to see your progress!</p>
            </div>
          )}

          <button onClick={handleRefresh} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      )}
    </div>
  )
}

export default ProgressPage
