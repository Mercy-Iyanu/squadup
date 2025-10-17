const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  joinTeam,
  approveTeam,
  deleteTeam,
} = require("../controllers/teamController");
const { authMiddleware, requireTeacher } = require("../middleware/auth");

router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, getTeams);
router.get("/:id", authMiddleware, getTeamById);
router.post("/:id/join", authMiddleware, joinTeam);

router.patch("/:id/approve", authMiddleware, requireTeacher, approveTeam);
router.delete("/:id", authMiddleware, requireTeacher, deleteTeam);

module.exports = router;
