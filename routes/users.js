const auth = require('../middelware/auth');
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
  }catch(ex){
    res.status(500).send('Something failed...');
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    // user = new User({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // });

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // res.send({
    //   name: user.name,
    //   email: user.email
    // we won't send the password
    // });

    const token = user.generateAuthToken();
    // we can also send token as http header 
    res.header('x-auth-token', token).send(_.pick(user, ["_id", "name", "email"]));
    // for header first argument is arbitary name prefixed with 'x-' and second one is the value
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
