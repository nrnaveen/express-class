const mongoose = require("mongoose");
const validators = require("mongoose-validators");
const mongoosePaginate = require("mongoose-paginate");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;

class ArticleLike extends Schema {
  constructor() {
    super(
      {
        article_id: {
          type: Schema.Types.ObjectId,
          ref: "Article",
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
        collection: "article_likes", // table name
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

module.exports = mongoose.model("ArticleLike", new ArticleLike());
