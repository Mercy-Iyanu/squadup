const request = require("supertest");
const app = require("../../src/server");
const User = require("../../src/models/User");
const School = require("../../src/models/School");
const { hashPassword } = require("../../src/utils/hash");
const mongoose = require("mongoose");

describe("Auth Integration Tests", () => {
  let teacher, school;

  beforeEach(async () => {
    const passwordHash = await hashPassword("teacherPass");
    teacher = await User.create({
      name: "Test Teacher",
      email: "teacher@example.com",
      passwordHash,
      role: "teacher",
      approved: true,
    });

    school = await School.create({
      name: "Test School",
      joinCode: "JOIN123",
      admin: teacher._id,
      students: [],
    });

    teacher.school = school._id;
    await teacher.save();
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "teacher@example.com", password: "teacherPass" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("teacher@example.com");
    expect(res.body.user.role).toBe("teacher");
  });

  it("should fail login with incorrect password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "teacher@example.com", password: "wrongPass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should reject unapproved student", async () => {
    const studentPasswordHash = await hashPassword("studentPass");
    const student = await User.create({
      name: "Test Student",
      email: "student@example.com",
      passwordHash: studentPasswordHash,
      role: "student",
      approved: false,
      school: school._id,
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "student@example.com", password: "studentPass" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Account pending approval by school admin");
  });
});
