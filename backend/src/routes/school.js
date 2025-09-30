const express = require("express");
const {
  approveStudent,
  getPendingStudents,
  rejectStudent,
  getStudentsHistory,
} = require("../controllers/schoolController");
const { authMiddleware, requireTeacher } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/students/pending",
  authMiddleware,
  requireTeacher,
  getPendingStudents
);
router.put(
  "/students/:studentId/approve",
  authMiddleware,
  requireTeacher,
  approveStudent
);
router.delete(
  "/students/:studentId/reject",
  authMiddleware,
  requireTeacher,
  rejectStudent
);

router.get(
  "/students/history",
  authMiddleware,
  requireTeacher,
  getStudentsHistory
);

module.exports = router;
