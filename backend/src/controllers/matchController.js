const Match = require("../models/Match");
const Team = require("../models/Team");
const School = require("../models/School");

const createMatch = async (req, res) => {
  try {
    const { teamA, teamB, matchType, scheduledAt } = req.body;
    const userId = req.user.id;

    const teamAData = await Team.findById(teamA);
    const teamBData = await Team.findById(teamB);

    if (!teamAData || !teamBData)
      return res.status(404).json({ message: "One or both teams not found" });

    if (teamAData.school.toString() !== teamBData.school.toString())
      return res
        .status(400)
        .json({ message: "Teams must belong to the same school" });

    const match = await Match.create({
      school: teamAData.school,
      teamA,
      teamB,
      matchType,
      scheduledAt,
      createdBy: userId,
    });

    res.status(201).json({ message: "Match created successfully", match });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMatches = async (req, res) => {
  try {
    const userSchoolId = req.user.school;
    const matches = await Match.find({ school: userSchoolId })
      .populate("teamA", "name")
      .populate("teamB", "name")
      .populate("winner", "name")
      .sort({ scheduledAt: -1 });

    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { scoreA, scoreB, replayLink } = req.body;

    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.status = "completed";
    match.replayLink = replayLink || "";

    if (scoreA > scoreB) match.winner = match.teamA;
    else if (scoreB > scoreA) match.winner = match.teamB;
    else match.winner = null;

    await match.save();

    res.json({ message: "Match result updated", match });
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    await Match.findByIdAndDelete(id);
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMatch,
  getMatches,
  updateMatchResult,
  deleteMatch,
};
