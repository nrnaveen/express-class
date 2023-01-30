const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

class Database {
  constructor() {
    mongoose.set("strictQuery", process.env.DB_STRICTQUERY);
    mongoose
      .connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
      )
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
        console.error(err);
      });
    // mongoose.set("debug", process.env.APP_DEBUG);
  }
}

module.exports = (app) => {
  return new Database();
};
