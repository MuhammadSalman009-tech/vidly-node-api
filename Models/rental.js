const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 50,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});
const Rental = mongoose.model("rental", rentalSchema);
const validateRental = (rental) => {
  const schema = Joi.object({
    cutomerID: Joi.objectId().required(),
    movieID: Joi.objectId().required(),
  });
  return schema.validate({ ...rental });
};
module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
