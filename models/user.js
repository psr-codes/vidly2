const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requied: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    requied: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    requied: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean

});

// now we gonna add a method to the userSchema
userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model("User", userSchema);
  
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1025).required()
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;