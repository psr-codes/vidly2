const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  // 1. handling uncaught exception -- works with only synchronous code
  process.on("uncaughtException", (ex) => {
    new winston.transports.Console({ colorize: true, prettyPrint: true});
    console.log("GOT AN UNCAUGHT EXCEPTION...");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // solving unhandled promise rejection -- for asynchrounous code
  process.on("unhandledRejection", (ex) => {
    new winston.transports.Console({ colorize: true, prettyPrint: true});
    winston.info("GOT AN UNHANDELED REJECTION", ex.message);
    console.log(ex.message);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // adding another transport for logging messages in a file
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(new winston.transports.Console({ 
    level: 'info',
    format: winston.format.simple()
  })
);
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://localhost/vidly",
  //     level: "info",
  //   })
  // );

  // throw new Error('Something failed during startup...');
  // const p = Promise.reject(new Error("Failed miserabely"));
  // p.then(()=> console.log('Done')); // note : we haven't handelend rejection
};
