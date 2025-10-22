import mongoose from "mongoose"

const dailyStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

// Compound index for efficient queries
dailyStatsSchema.index({ userId: 1, date: -1 })

export default mongoose.model("DailyStats", dailyStatsSchema)
