const mongoose = require("mongoose");
const auth = require("../../../Middleware/auth");
const { User } = require("../../../Models/user");

describe("auth middleware", () => {
  it("should populate req.user with valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);
    expect(req.user).toHaveProperty("id", user._id);
    expect(req.user).toHaveProperty("isAdmin", user.isAdmin);
  });
});
