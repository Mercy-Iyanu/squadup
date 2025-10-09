const express = require("express");
const {
  approveStudent,
  getPendingStudents,
  rejectStudent,
  getStudentsHistory,
  getAllStudents,
  updateStudentStatus,
} = require("../controllers/schoolController");
const { authMiddleware, requireTeacher } = require("../middleware/auth");
const { get } = require("mongoose");

const router = express.Router();

router.get("/", authMiddleware, requireTeacher, getAllStudents);
router.put(
  "/students/:studentId/status",
  authMiddleware,
  requireTeacher,
  updateStudentStatus
);
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
