const mongoose = require("mongoose");
const validators = require("mongoose-validators");
const mongoosePaginate = require("mongoose-paginate");
const reversePop = require("./reversePop");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;

class Article extends Schema {
  /**
   * Declare "legs" as a static property of animal with a default value of 4
   */
  // static legs = 4;

  constructor() {
    super(
      {
        description: {
          type: String,
          required: true,
        },
        user_id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        collection: "articles", // table name
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
      .plugin(reversePop);
  }

  statics = {
    async create(username, threadBody) {
      try {
        threadBody.username = username;
        const thread = new this(threadBody);
        return await thread.save();
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async listForUser(username, { limit = 10, skip = 0 }) {
      try {
        const threads = await this.find({ username })
          .skip(parseInt(skip))
          .limit(parseInt(limit));
        return threads;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async get(_id) {
      try {
        const thread = await this.findOne({ _id });
        return thread;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  };

  naveen() {
    console.log("DSFc");
  }
}

module.exports = mongoose.model("Article", new Article());
