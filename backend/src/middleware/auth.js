const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

const requireTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can perform this action" });
  }
  next();
};

module.exports = { authMiddleware, requireTeacher };
