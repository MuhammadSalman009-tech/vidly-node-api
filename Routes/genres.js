const asyncMiddleware = require("../Middleware/async");
const express = require("express");
const admin = require("../Middleware/admin");
const auth = require("../Middleware/auth");
const { Genre, validateGenre } = require("../Models/genre");
const { validateObjectId } = require("../Middleware/validateObjectId");
const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre with given ID not found.");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedGenre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  if (!updatedGenre)
    return res.status(404).send("Genre with given ID not found.");

  res.send(updatedGenre);
});
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("Genre with given ID not found.");
  res.send(genre);
});

module.exports = router;
