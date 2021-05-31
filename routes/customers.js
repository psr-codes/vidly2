const { Customer, validate } = require("../models/customers");

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try{
    const customers = await Customer.find().sort("name");
    res.send(customers);
  }catch(ex){
    res.status(500).send('Something failed...');
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    customer = await customer.save();
    res.send(customer);
  } catch (err) {
    res.status(500).send("some error occured!!!");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
      { new: true }
    );
    if (!customer)
      return res.status(404).send("the customer with given id does not exists");

    res.send(customer);
  } catch (err) {
    res.status(500).send("some error occured!!!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("the customer with the given id does not exists");

    res.send(customer);
  } catch (err) {
    res.status(500).send("some error occured!!!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send("the customer with given id not found");
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send("some error occured!!!");
  }
});

module.exports = router;
