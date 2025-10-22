"use client"

import { useState, useEffect } from "react"
import "../styles/PracticePage.css"

function PracticePage() {
  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateProblem()
  }, [])

  const generateProblem = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/generateProblem")
      const data = await response.json()
      setProblem(data)
      setUserAnswer("")
      setFeedback("")
    } catch (err) {
      console.error("Error generating problem:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userAnswer.trim()) return

    try {
      const response = await fetch("http://localhost:5000/api/checkAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equation: problem.equation,
          userAnswer: Number.parseFloat(userAnswer),
          correctAnswer: problem.answer,
        }),
      })

      const data = await response.json()
      setFeedback(data.message)
      setAttempts(attempts + 1)

      if (data.correct) {
        setScore(score + 1)
        setTimeout(() => generateProblem(), 2000)
      }
    } catch (err) {
      console.error("Error checking answer:", err)
    }
  }

  return (
    <div className="practice-page">
      <h1>Practice Problems</h1>
      <p className="subtitle">Solve random algebra problems and track your progress</p>

      <div className="practice-stats">
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Attempts</span>
          <span className="stat-value">{attempts}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</span>
        </div>
      </div>

      {problem && (
        <div className="problem-container">
          <div className="problem-box">
            <h2>Solve for x:</h2>
            <p className="problem-equation">{problem.equation}</p>
          </div>

          <form onSubmit={handleSubmit} className="answer-form">
            <div className="form-group">
              <input
                type="number"
                step="0.01"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="input-field"
                autoFocus
              />
              <button type="submit" className="submit-button">
                Check Answer
              </button>
            </div>
          </form>

          {feedback && (
            <div className={`feedback ${feedback.includes("Correct") ? "correct" : "incorrect"}`}>{feedback}</div>
          )}

          <button onClick={generateProblem} className="next-button">
            Next Problem
          </button>
        </div>
      )}
    </div>
  )
}

export default PracticePage
