import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    problemsSolved: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    sessionType: {
      type: String,
      enum: ["practice", "review", "learning"],
      default: "practice",
    },
  },
  { timestamps: true },
)

export default mongoose.model("Session", sessionSchema)
