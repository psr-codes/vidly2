const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customers");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  try{
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  }catch(ex){
    res.status(500).send('Something failed...');
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    try {
      new Fawn.Task()
        .save("rentals", rental) // first one is the original collection and second one is the object to be modified
        .update(
          "movies",
          { _id: movie._id },
          {
            $inc: { numberInStock: -1 },
          }
        )
        // .remove()
        .run();
    } catch (ex) {
      res.status(500).send("something went wrong");
    }

    res.send(rental);
  } catch (err) {
    res.status(500).send('some error occured!!!');
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID was not found.");

    res.send(rental);
  } catch (err) {
    res.status(500).send('some error occured!!!');
  }
});

module.exports = router;
