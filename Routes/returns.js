const moment = require("moment");
const asyncMiddleware = require("../Middleware/async");
const express = require("express");
const { Rental } = require("../Models/rental");
const { validateObjectId } = require("../Middleware/validateObjectId");
const auth = require("../Middleware/auth");
const { Movie } = require("../Models/movie");
const router = express.Router();

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    if (!req.body.customerId)
      return res.status(400).send("customerId not provided");
    if (!req.body.movieId) return res.status(400).send("movieId not provided");
    const rental = await Rental.findOne({
      "customer._id": req.body.customerId,
      "movie._id": req.body.movieId,
    });
    if (!rental) return res.status(404).send("Rental not found.");
    if (rental.dateReturned)
      return res.status(400).send("Rental already processed.");

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, "days");
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();
    await Movie.updateOne(
      { _id: rental.movie._id },
      {
        $inc: { numberInStock: 1 },
      }
    );
    return res.status(200).send(rental);
  })
);
module.exports = router;
