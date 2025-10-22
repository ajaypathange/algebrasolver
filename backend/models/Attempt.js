import mongoose from "mongoose"

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    problemType: {
      type: String,
      enum: ["equation", "simplify", "graph"],
      default: "equation",
    },
    equation: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    correct: Boolean,
    timeSpent: Number, // in seconds
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Attempt", attemptSchema)
