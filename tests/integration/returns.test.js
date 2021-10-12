const moment = require("moment");
let app = require("../../index");
const request = require("supertest");
const { Rental } = require("../../Models/rental");
const { Movie } = require("../../Models//movie");
const mongoose = require("mongoose");
const { User } = require("../../Models/user");

describe("/api/returns", () => {
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;
  const executeReq = () => {
    return request(app)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId, customerId });
  };
  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      numberInStock: 10,
      genre: { name: "genre" },
    });
    await movie.save();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "123456789",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
  });
  it("should return 401 if user is not logged in", async () => {
    token = "";
    const res = await executeReq();
    expect(res.status).toBe(401);
  });
  //   testing inputs
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await executeReq();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const result = await executeReq();
    expect(result.status).toBe(400);
  });
  it("should return 404 if no rental found for the movieId/customerId", async () => {
    await Rental.remove({});
    const res = await executeReq();
    expect(res.status).toBe(404);
  });
  it("should return 400 if rental if rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await executeReq();
    expect(res.status).toBe(400);
  });
  it("should return 200 if valid request", async () => {
    const res = await executeReq();
    expect(res.status).toBe(200);
  });
  it("should set returnDate if input is valid.", async () => {
    const res = await executeReq();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.dateReturned).toBeDefined();
  });
  it("should increase movie's numberInStock if input is valid.", async () => {
    const res = await executeReq();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(11);
  });
  it("should return rental in the body of response if input is valid.", async () => {
    const res = await executeReq();
    const rentalInDb = await Rental.findById(rental._id);
    const arr = Object.keys(res.body);
    expect(arr).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
