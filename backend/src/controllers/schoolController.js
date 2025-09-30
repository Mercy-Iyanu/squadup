const User = require("../models/User");
const School = require("../models/School");

const approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    const school = await School.findOne({ admin: teacherId });
    if (!school) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve students" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.school.toString() !== school._id.toString()) {
      return res
        .status(403)
        .json({ message: "This student is not in your school" });
    }

    student.approved = true;
    await student.save();

    res.status(200).json({
      message: "Student approved successfully",
      student: {
        id: student._id,
        email: student.email,
        approved: student.approved,
      },
    });
  } catch (err) {
    console.error("Error approving student:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPendingStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const school = await School.findOne({ admin: teacherId });
    if (!school) {
      return res
        .status(403)
        .json({ message: "Not authorized to view students" });
    }

    const pendingStudents = await User.find({
      school: school._id,
      role: "student",
      approved: false,
    }).select("id name email createdAt");

    res.status(200).json({ pendingStudents });
  } catch (err) {
    console.error("Error fetching pending students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    const school = await School.findOne({ admin: teacherId });
    if (!school) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject students" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.school.toString() !== school._id.toString()) {
      return res
        .status(403)
        .json({ message: "This student is not in your school" });
    }

    student.status = "rejected";
    await student.save();

    res.status(200).json({
      message: "Student rejected successfully",
      student: {
        id: student._id,
        email: student.email,
        status: student.status,
      },
    });
  } catch (err) {
    console.error("Error rejecting student:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStudentsHistory = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const school = await School.findOne({ admin: teacherId });
    if (!school) {
      return res
        .status(403)
        .json({ message: "Not authorized to view students" });
    }

    const query = { school: school._id, role: "student" };

    if (req.query.status) {
      const allowedStatuses = ["pending", "approved", "rejected"];
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      query.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await User.find(query)
      .select("id name email createdAt status")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      students,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    console.error("Error fetching students history:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  approveStudent,
  getPendingStudents,
  rejectStudent,
  getStudentsHistory,
};
