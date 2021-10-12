const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("user", userSchema);
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate({ ...user });
};
module.exports.User = User;
module.exports.validateUser = validateUser;
