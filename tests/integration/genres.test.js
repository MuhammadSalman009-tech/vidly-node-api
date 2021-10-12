let app = require("../../index");
const request = require("supertest");
const { Genre } = require("../../Models/genre");
const { User } = require("../../Models/user");

describe("/api/genres", () => {
  afterEach(async () => {
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all the genres", async () => {
      await Genre.insertMany([
        {
          name: "genre1",
        },
        {
          name: "genre2",
        },
      ]);
      const res = await request(app).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(app).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(app).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    let name;
    let token;
    const executeReq = async () => {
      return await request(app)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: name,
        });
    };
    beforeEach(() => {
      name = "genre1";
      token = new User().generateAuthToken();
    });

    //testing authorization
    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await executeReq();
      expect(res.status).toBe(401);
    });
    //testing invald input
    it("should return 400 if genre name is less than 5 characters", async () => {
      name = "1234";
      const res = await executeReq();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre name is greater than 50 characters", async () => {
      name = `It is a long established fact 
          that a reader will be distracted by the 
          readable content of a page when looking 
          at its layout. The point of using Lorem Ipsum is
           that it has a more-or-less normal distribution `;
      const res = await executeReq();
      expect(res.status).toBe(400);
    });
    //testing the happy path
    it("should save the genre if it is valid", async () => {
      const res = await executeReq();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return the genre if it is valid", async () => {
      const res = await executeReq();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
