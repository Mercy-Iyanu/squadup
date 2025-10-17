const Team = require("../models/Team");
const School = require("../models/School");
const User = require("../models/User");

const createTeam = async (req, res) => {
  try {
    const { name, logo } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const school = await School.findOne({ _id: user.school });
    if (!school)
      return res.status(400).json({ message: "User not linked to any school" });

    const existingTeam = await Team.findOne({ members: userId });
    if (existingTeam) {
      return res.status(400).json({ message: "You already belong to a team" });
    }

    const team = await Team.create({
      name,
      logo,
      school: school._id,
      members: [userId],
      captain: userId,
      status: "pending",
    });

    res.status(201).json({
      message: "Team created successfully, awaiting admin approval",
      team,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("school");
    if (!user) return res.status(404).json({ message: "User not found" });

    const teams = await Team.find({ school: user.school._id })
      .populate("members", "name email")
      .populate("captain", "name email");

    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id)
      .populate("members", "name email")
      .populate("captain", "name email")
      .populate("school", "name");

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const joinTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.status !== "approved")
      return res.status(400).json({ message: "Cannot join unapproved team" });

    if (team.members.includes(userId))
      return res.status(400).json({ message: "Already in this team" });

    if (team.members.length >= 5)
      return res.status(400).json({ message: "Team is full" });

    const existingTeam = await Team.findOne({ members: userId });
    if (existingTeam)
      return res.status(400).json({ message: "Already in another team" });

    team.members.push(userId);
    await team.save();

    res.json({ message: "Joined team successfully", team });
  } catch (error) {
    console.error("Error joining team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const approveTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.status = status;
    await team.save();

    res.json({ message: `Team ${status}`, team });
  } catch (error) {
    console.error("Error approving team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  joinTeam,
  approveTeam,
  deleteTeam,
};
