const express = require("express");
const { Rental, validateRental } = require("../Models/rental");
const { Movie, validateMovie } = require("../Models/movie");
const { Customer, validateCustomer } = require("../Models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const router = express.Router();

Fawn.init();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given ID not found.");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerID);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieID);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: cutomer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (error) {
    res.status(500).send("Something failed at server.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    {
      new: true,
    }
  );
  if (!updatedCustomer)
    return res.status(404).send("Customer with given ID not found.");

  res.send(updatedCustomer);
});
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given ID not found.");
  res.send(customer);
});

module.exports = router;
