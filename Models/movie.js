const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});
const Movie = mongoose.model("movie", movieSchema);
const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreID: Joi.number().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyrentalRate: Joi.number().min(0).required(),
  });
  return schema.validate({ ...movie });
};
module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
