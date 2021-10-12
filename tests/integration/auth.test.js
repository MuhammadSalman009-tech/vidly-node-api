const request = require("supertest");
const { User } = require("../../Models/user");
const { Genre } = require("../../Models/genre");
let app = require("../../index");
describe("auth middleware", () => {
  let token;
  const executeReq = () => {
    return request(app)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await Genre.deleteMany({});
  });
  it("should return 401 if token is not provided", async () => {
    token = "";
    const res = await executeReq();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "invalid token";
    const res = await executeReq();
    expect(res.status).toBe(400);
  });
  it("should return 200 if token is valid", async () => {
    const res = await executeReq();
    expect(res.status).toBe(200);
  });
});
