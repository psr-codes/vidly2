const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    let db = config.get('db');
    db = 'mongodb+srv://prakash:4567@cluster0.1tfgk.mongodb.net/vidly2?retryWrites=true&w=majority';
    
    console.log(db);
    mongoose.connect(db, { 
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
 })
    .then(() => winston.info(`Connected to ${db}...`))
    // .catch(err => console.error('Could not connect to mongodb...'));
    // now the unhandeled exception will be dealt by winston
};


