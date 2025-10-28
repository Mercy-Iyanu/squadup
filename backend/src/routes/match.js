const express = require("express");
const router = express.Router();
const {
  createMatch,
  getMatches,
  updateMatchResult,
  deleteMatch,
} = require("../controllers/matchController");
const { authMiddleware, requireTeacher } = require("../middleware/auth");

router.post("/", authMiddleware, createMatch);
router.get("/", authMiddleware, getMatches);
router.patch("/:id/result", authMiddleware, requireTeacher, updateMatchResult);
router.delete("/:id", authMiddleware, requireTeacher, deleteMatch);

module.exports = router;
