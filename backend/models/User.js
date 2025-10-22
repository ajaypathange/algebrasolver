import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    totalProblems: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastAttemptDate: Date,
  },
  { timestamps: true },
)

export default mongoose.model("User", userSchema)
