const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const schoolRoutes = require("./routes/school");
const teamRoutes = require("./routes/team");
const matchRoutes = require("./routes/match");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/auth", authRoutes);
app.use("/school", schoolRoutes);
app.use("/teams", teamRoutes);
app.use("/matches", matchRoutes);

module.exports = app;
