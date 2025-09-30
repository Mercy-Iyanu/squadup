const { hashPassword, comparePassword } = require("../utils/hash");
const { generateJoinCode } = require("../utils/joinCode");
const User = require("../models/User");
const School = require("../models/School");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, schoolName } = req.body;

    if (!name || !email || !password || !schoolName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);

    const teacher = await User.create({
      name,
      email,
      passwordHash,
      role: "teacher",
      approved: true,
    });

    const joinCode = generateJoinCode();
    const school = await School.create({
      name: schoolName,
      joinCode,
      admin: teacher._id,
      students: [],
    });

    teacher.school = school._id;
    await teacher.save();

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher: { id: teacher._id, email: teacher.email },
      joinCode: school.joinCode,
    });
  } catch (err) {
    console.error("Error registering teacher:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const registerStudent = async (req, res) => {
  try {
    const { name, email, password, joinCode } = req.body;

    if (!name || !email || !password || !joinCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const school = await School.findOne({ joinCode });
    if (!school) {
      return res.status(400).json({ message: "Invalid join code" });
    }

    const passwordHash = await hashPassword(password);

    const student = await User.create({
      name,
      email,
      passwordHash,
      role: "student",
      approved: false,
      school: school._id,
    });

    school.students.push(student._id);
    await school.save();

    res.status(201).json({
      message:
        "Student registered successfully, pending approval by school admin",
      student: { id: student._id, email: student.email, school: school.name },
    });
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).populate("school");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role === "student" && !user.approved) {
      return res
        .status(403)
        .json({ message: "Account pending approval by school admin" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school
          ? { id: user.school._id, name: user.school.name }
          : null,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerTeacher, registerStudent, login };
