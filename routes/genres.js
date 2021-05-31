const asyncMiddelware = require("../middelware/async");
const auth = require("../middelware/auth");
const admin = require("../middelware/admin");
const { Genre, validate } = require("../models/genres");
const mongoose = require('mongoose');
const validateObjectId = require("../middelware/validateObjectId");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // throw new Error('could not get genres...');
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("the genre with given id does not exists");

  res.send(genre);
  console.log(err.message);
  res.status(404).send("the genre with given id not found");
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("the genre with the given id does not exists");

  res.send(genre);
  console.log(err.message);
  res.status(404).send("the genre with given id not found");
});

router.get("/:id",validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send("the genre with given id not found");
  }
  res.send(genre);
});

module.exports = router;
