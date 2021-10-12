const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../Middleware/auth");
const { User, validateUser } = require("../Models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    id: user._id,
    name: user.name,
    email: user.email,
  });
});
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).send("User with given ID not found.");
  res.send(user);
});

module.exports = router;
