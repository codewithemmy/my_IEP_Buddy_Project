const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    resultType: {
      type: String,
      required: true,
      enum: [
        "goalObjectiveGenerator",
        "accommodationGenerator",
        "presentLevelGenerator",
        "progressMonitoringIdeas",
      ],
    },
    studentName: String,
    goal: String,
    goalObjectiveGenerator: String,
    accommodationGenerator: String,
    presentLevelGenerator: String,
    progressMonitoringIdeas: String,
    teacher: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

const student = mongoose.model("Student", studentSchema, "student")

module.exports = { Student: student }
