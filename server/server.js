const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/algebra-solver", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Attempt Schema
const attemptSchema = new mongoose.Schema({
  equation: String,
  userAnswer: Number,
  correctAnswer: Number,
  correct: Boolean,
  timestamp: { type: Date, default: Date.now },
})

const Attempt = mongoose.model("Attempt", attemptSchema)

// Routes

// Solve equation
app.post("/api/solve", (req, res) => {
  const { equation } = req.body

  try {
    // Parse equation like "3x + 2 = 11"
    const [left, right] = equation.split("=").map((s) => s.trim())

    // Simple linear equation solver
    // Format: ax + b = c
    const leftMatch = left.match(/([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?/)
    const rightValue = Number.parseFloat(right)

    if (!leftMatch) {
      return res.json({ error: "Invalid equation format. Use format like: 3x + 2 = 11" })
    }

    const a = Number.parseFloat(leftMatch[1]) || 1
    const bStr = leftMatch[2] ? leftMatch[2].replace(/\s/g, "") : "0"
    const b = Number.parseFloat(bStr)

    const solution = (rightValue - b) / a

    const steps = [
      { equation: equation, description: "Original equation" },
      { equation: `${a}x = ${rightValue} - ${b}`, description: "Subtract " + b + " from both sides" },
      { equation: `${a}x = ${rightValue - b}`, description: "Simplify" },
      { equation: `x = ${rightValue - b} / ${a}`, description: "Divide both sides by " + a },
      { equation: `x = ${solution.toFixed(2)}`, description: "Solution" },
    ]

    res.json({ solution: solution.toFixed(2), steps })
  } catch (error) {
    res.json({ error: "Error solving equation: " + error.message })
  }
})

// Simplify expression
app.post("/api/simplify", (req, res) => {
  const { expression } = req.body

  try {
    // Simple expression simplifier
    // Combine like terms
    const terms = expression.split(/(?=[+-])/)
    const coefficients = {}
    const constants = []

    terms.forEach((term) => {
      term = term.trim()
      if (!term) return

      const match = term.match(/([+-]?\d*\.?\d*)\s*([a-z])?/i)
      if (match) {
        const coeff = match[1] === "" || match[1] === "+" ? 1 : match[1] === "-" ? -1 : Number.parseFloat(match[1])
        const variable = match[2] || "const"

        if (variable === "const") {
          constants.push(coeff)
        } else {
          coefficients[variable] = (coefficients[variable] || 0) + coeff
        }
      }
    })

    let simplified = ""
    for (const [variable, coeff] of Object.entries(coefficients)) {
      if (coeff !== 0) {
        simplified += (coeff > 0 && simplified ? "+" : "") + (coeff === 1 ? "" : coeff === -1 ? "-" : coeff) + variable
      }
    }

    const constantSum = constants.reduce((a, b) => a + b, 0)
    if (constantSum !== 0) {
      simplified += (constantSum > 0 && simplified ? "+" : "") + constantSum
    }

    const steps = ["Identify like terms", "Combine coefficients of like terms", "Simplify constants"]

    res.json({ original: expression, simplified: simplified || "0", steps })
  } catch (error) {
    res.json({ error: "Error simplifying expression: " + error.message })
  }
})

// Generate practice problem
app.get("/api/generateProblem", (req, res) => {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 20) - 10
  const c = Math.floor(Math.random() * 20) + 1

  const answer = (c - b) / a
  const equation = `${a}x + ${b} = ${c}`

  res.json({ equation, answer: Number.parseFloat(answer.toFixed(2)) })
})

// Check answer
app.post("/api/checkAnswer", async (req, res) => {
  const { equation, userAnswer, correctAnswer } = req.body

  const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01

  try {
    const attempt = new Attempt({
      equation,
      userAnswer,
      correctAnswer,
      correct: isCorrect,
    })
    await attempt.save()
  } catch (error) {
    console.error("Error saving attempt:", error)
  }

  res.json({
    correct: isCorrect,
    message: isCorrect ? "Correct! Great job!" : `Incorrect. The correct answer is ${correctAnswer}`,
  })
})

// Get history
app.get("/api/getHistory", async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ timestamp: -1 }).limit(50)
    res.json({ attempts })
  } catch (error) {
    res.json({ attempts: [], error: error.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
