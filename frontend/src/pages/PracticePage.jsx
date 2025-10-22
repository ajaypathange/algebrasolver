"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getUserId } from "../utils/userUtils"
import "../styles/PracticePage.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

function PracticePage() {
  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [userId] = useState(() => getUserId())

  useEffect(() => {
    generateProblem()
  }, [])

  const generateProblem = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/generateProblem`)
      console.log("[v0] Generated problem:", response.data)
      setProblem(response.data)
      setUserAnswer("")
      setFeedback("")
    } catch (err) {
      console.error("[v0] Error generating problem:", err)
      setFeedback("Error loading problem. Make sure backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      setFeedback("Please enter an answer")
      return
    }

    setSubmitting(true)
    try {
      console.log("[v0] Submitting answer:", {
        userId,
        equation: problem.equation,
        userAnswer: Number.parseFloat(userAnswer),
        correctAnswer: problem.answer,
      })

      const response = await axios.post(`${API_URL}/api/checkAnswer`, {
        userId,
        equation: problem.equation,
        userAnswer: Number.parseFloat(userAnswer),
        correctAnswer: problem.answer,
        problemType: "equation",
        difficulty: "medium",
      })

      console.log("[v0] Response:", response.data)

      if (response.data.correct) {
        setScore(score + 1)
        setFeedback("✓ Correct! Great job!")
      } else {
        setFeedback(`✗ Incorrect. The correct answer is ${problem.answer}`)
      }
    } catch (err) {
      console.error("[v0] Error checking answer:", err)
      setFeedback("Error checking answer. Make sure backend is running.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextProblem = async () => {
    setLoading(true)
    await generateProblem()
    setLoading(false)
  }

  return (
    <div className="practice-page">
      <h1>Practice Problems</h1>
      <p className="subtitle">Solve problems and improve your skills</p>

      <div className="practice-container">
        <div className="score-box">
          <h2>Score: {score}</h2>
        </div>

        {problem ? (
          <div className="problem-box">
            <h2>Solve for x:</h2>
            <p className="equation">{problem.equation}</p>

            <div className="input-group">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                onKeyPress={(e) => e.key === "Enter" && !submitting && handleSubmit()}
                step="0.01"
                disabled={submitting}
              />
              <button onClick={handleSubmit} className="submit-btn" disabled={submitting || loading}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {feedback && (
              <div className={`feedback ${feedback.includes("✓") ? "correct" : "incorrect"}`}>{feedback}</div>
            )}

            <button onClick={handleNextProblem} className="next-btn" disabled={loading || submitting}>
              {loading ? "Loading..." : "Next Problem"}
            </button>
          </div>
        ) : (
          <div className="problem-box">
            <p>Loading problem...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PracticePage
