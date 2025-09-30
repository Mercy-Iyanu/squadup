const express = require("express");
const {
  registerTeacher,
  registerStudent,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/teacher", registerTeacher);
router.post("/register/student", registerStudent);
router.post("/login", login);

module.exports = router;
