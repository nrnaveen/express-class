const mongoose = require("mongoose");
const validators = require("mongoose-validators");
const mongoosePaginate = require("mongoose-paginate");
const findOrCreate = require("mongoose-findorcreate");
const passportLocal = require("passport-local-mongoose");
const Schema = mongoose.Schema;

class User extends Schema {
  constructor() {
    super(
      {
        email: {
          type: String,
          required: true,
          email: true,
          unique: true,
        },
        password: {
          type: String,
        },
        firstname: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
      },
      {
        collection: "users", // table name
        timestamps: true,
        toObject: {
          virtuals: true, // enable virtual fields
        },
        toJSON: {
          virtuals: true, // enable virtual fields
        },
      }
    )
      .plugin(findOrCreate)
      .plugin(mongoosePaginate)
      .plugin(passportLocal, {
        usernameField: "email",
        passwordField: "password",
      });
  }
}

module.exports = mongoose.model("User", new User());
