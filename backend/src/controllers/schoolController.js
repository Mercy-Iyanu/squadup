const User = require("../models/User");
const School = require("../models/School");

const getAllStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const school = await School.findOne({ admin: teacherId });

    if (!school) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status, page = 1, limit = 10, search } = req.query;
    const query = { school: school._id, role: "student" };

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;
    const [students, total] = await Promise.all([
      User.find(query)
        .select("_id name email createdAt status")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;
    const teacherId = req.user.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const school = await School.findOne({ admin: teacherId });
    if (!school) return res.status(403).json({ message: "Not authorized" });

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.school.toString() !== school._id.toString()) {
      return res.status(403).json({ message: "Student not in your school" });
    }

    student.status = status;
    await student.save();

    res.json({
      message: `Student ${status} successfully`,
      student: {
        id: student._id,
        email: student.email,
        status: student.status,
      },
    });
  } catch (err) {
    console.error("Error updating student status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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
    }).select("_id name email createdAt");

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
      .select("_id name email createdAt status")
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
  getAllStudents,
  updateStudentStatus,
};
