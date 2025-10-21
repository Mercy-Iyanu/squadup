const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed"],
    default: "scheduled",
  },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  matchType: {
    type: String,
    enum: ["friendly", "tournament"],
    default: "friendly",
  },
  scheduledAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Match", matchSchema);
