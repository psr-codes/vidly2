const winston = require('winston');

module.exports = function(err, req, res, next){
    // winston.log(logging_level, message, some_optional_metadata)
    // winston.log(error, err.message); or
    winston.error(err.message, err);

    // logging levels ---
    // error, warn, info, verbose, debug, silly
    res.status(500).send('Something failed...');
};