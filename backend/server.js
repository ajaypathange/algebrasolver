import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js"
import Attempt from "./models/Attempt.js"
import DailyStats from "./models/DailyStats.js"
import Session from "./models/Session.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/algebra-solver", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Attempt Schema
const attemptSchema = new mongoose.Schema({
  equation: String,
  userAnswer: Number,
  correctAnswer: Number,
  correct: Boolean,
  timestamp: { type: Date, default: Date.now },
  userId: String,
  problemType: String,
  timeSpent: Number,
  difficulty: String,
})

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
    // Remove all spaces for easier parsing
    const cleanExpr = expression.replace(/\s+/g, "")

    // Split by + and - while keeping the operators
    const terms = cleanExpr.match(/[+-]?[^+-]+/g) || []
    const coefficients = {}
    let constants = 0

    terms.forEach((term) => {
      term = term.trim()
      if (!term) return

      // Match pattern: optional sign, optional coefficient, optional variable
      // Examples: "5a", "-3a", "2", "-b", "a", "+x"
      const match = term.match(/^([+-]?)(\d*\.?\d*)([a-zA-Z]?)$/)

      if (match) {
        const sign = match[1] === "-" ? -1 : 1
        let coeff = match[2] === "" ? 1 : Number.parseFloat(match[2])
        coeff *= sign
        const variable = match[3] || null

        if (!variable) {
          // It's a constant
          constants += coeff
        } else {
          // It's a variable term
          coefficients[variable] = (coefficients[variable] || 0) + coeff
        }
      }
    })

    // Build simplified expression
    let simplified = ""

    // Sort variables alphabetically for consistent output
    const sortedVars = Object.keys(coefficients).sort()

    sortedVars.forEach((variable) => {
      const coeff = coefficients[variable]
      if (coeff !== 0) {
        if (simplified === "") {
          // First term
          if (coeff === 1) {
            simplified = variable
          } else if (coeff === -1) {
            simplified = "-" + variable
          } else {
            simplified = coeff + variable
          }
        } else {
          // Subsequent terms
          if (coeff > 0) {
            if (coeff === 1) {
              simplified += "+" + variable
            } else {
              simplified += "+" + coeff + variable
            }
          } else {
            if (coeff === -1) {
              simplified += "-" + variable
            } else {
              simplified += coeff + variable
            }
          }
        }
      }
    })

    // Add constants
    if (constants !== 0) {
      if (simplified === "") {
        simplified = String(constants)
      } else {
        if (constants > 0) {
          simplified += "+" + constants
        } else {
          simplified += String(constants)
        }
      }
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

app.post("/api/checkAnswer", async (req, res) => {
  const {
    userId,
    equation,
    userAnswer,
    correctAnswer,
    problemType = "equation",
    timeSpent = 0,
    difficulty = "medium",
  } = req.body

  const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01

  try {
    // Save attempt to database
    const attempt = new Attempt({
      userId: userId || "anonymous",
      problemType,
      equation,
      userAnswer,
      correctAnswer,
      correct: isCorrect,
      timeSpent,
      difficulty,
    })
    await attempt.save()

    // Update user stats
    if (userId) {
      const user = await User.findOneAndUpdate(
        { userId },
        {
          $inc: {
            totalProblems: 1,
            ...(isCorrect && { correctAnswers: 1 }),
          },
          lastAttemptDate: new Date(),
        },
        { upsert: true, new: true },
      )

      // Update daily stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      await DailyStats.findOneAndUpdate(
        { userId, date: today },
        {
          $inc: {
            problemsSolved: 1,
            ...(isCorrect && { correctAnswers: 1 }),
            timeSpent: timeSpent,
          },
        },
        { upsert: true, new: true },
      )

      // Calculate and update accuracy
      const dailyStats = await DailyStats.findOne({ userId, date: today })
      if (dailyStats) {
        dailyStats.accuracy = ((dailyStats.correctAnswers / dailyStats.problemsSolved) * 100).toFixed(1)
        await dailyStats.save()
      }
    }
  } catch (error) {
    console.error("Error saving attempt:", error)
  }

  res.json({
    correct: isCorrect,
    message: isCorrect ? "Correct! Great job!" : `Incorrect. The correct answer is ${correctAnswer}`,
  })
})

app.get("/api/progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    // Get user stats
    const user = await User.findOne({ userId })

    // Get all attempts
    const attempts = await Attempt.find({ userId }).sort({ timestamp: -1 }).limit(100)

    // Get last 7 days stats
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyStats = await DailyStats.find({
      userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 })

    // Calculate overall stats
    const totalAttempts = attempts.length
    const correctAttempts = attempts.filter((a) => a.correct).length
    const overallAccuracy = totalAttempts > 0 ? ((correctAttempts / totalAttempts) * 100).toFixed(1) : 0

    res.json({
      user,
      attempts,
      dailyStats,
      stats: {
        totalAttempts,
        correctAttempts,
        overallAccuracy,
        totalTimeSpent: attempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query

    const skip = (page - 1) * limit

    const attempts = await Attempt.find({ userId }).sort({ timestamp: -1 }).skip(skip).limit(Number.parseInt(limit))

    const total = await Attempt.countDocuments({ userId })

    res.json({
      attempts,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/daily-stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { days = 7 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))
    startDate.setHours(0, 0, 0, 0)

    const stats = await DailyStats.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 })

    res.json({ stats })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/session/start", async (req, res) => {
  try {
    const { userId, sessionType = "practice" } = req.body

    const session = new Session({
      userId: userId || "anonymous",
      sessionType,
    })

    await session.save()

    res.json({ sessionId: session._id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/session/end", async (req, res) => {
  try {
    const { sessionId, problemsSolved, correctAnswers, totalTimeSpent } = req.body

    const session = await Session.findByIdAndUpdate(
      sessionId,
      {
        endTime: new Date(),
        problemsSolved,
        correctAnswers,
        totalTimeSpent,
      },
      { new: true },
    )

    res.json({ session })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get history (legacy route)
app.get("/api/getHistory", async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ timestamp: -1 }).limit(50)
    res.json({ attempts })
  } catch (error) {
    res.json({ attempts: [], error: error.message })
  }
})

// Graph endpoint
app.post("/api/graph", (req, res) => {
  const { equation } = req.body

  try {
    const data = []
    for (let x = -10; x <= 10; x += 0.5) {
      try {
        // Simple evaluation - in production, use a safer math parser
        const y = eval(equation.replace(/x/g, `(${x})`).replace(/\^/g, "**"))
        if (typeof y === "number" && isFinite(y)) {
          data.push({ x: Number.parseFloat(x.toFixed(2)), y: Number.parseFloat(y.toFixed(2)) })
        }
      } catch (e) {
        // Skip invalid points
      }
    }

    if (data.length === 0) {
      return res.json({ error: "Could not generate graph for this equation" })
    }

    res.json({ data, equation })
  } catch (error) {
    res.json({ error: "Error generating graph: " + error.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
