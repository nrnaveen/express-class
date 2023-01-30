const mongoose = require("mongoose");
const validators = require("mongoose-validators");
const mongoosePaginate = require("mongoose-paginate");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;

class Like extends Schema {
  constructor() {
    super(
      {
        comment_id: {
          type: Schema.Types.ObjectId,
          ref: "Comment",
          required: true,
        },
        user_id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: Boolean,
          default: true,
          enum: [true, false],
        },
      },
      {
        collection: "likes", // table name
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
      .plugin(mongoosePaginate);
  }
}

module.exports = mongoose.model("Like", new Like());
