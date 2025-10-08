const { hashPassword, comparePassword } = require("../../src/utils/hash");

describe("Password Hashing Utility", () => {
  it("should hash a password and compare correctly", async () => {
    const password = "mySecurePassword";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await comparePassword(password, hash)).toBe(true);
  });

  it("should return false for incorrect password comparison", async () => {
    const password = "mySecurePassword";
    const wrongPassword = "wrongPassword";
    const hash = await hashPassword(password);
    expect(await comparePassword(wrongPassword, hash)).toBe(false);
  });
});
