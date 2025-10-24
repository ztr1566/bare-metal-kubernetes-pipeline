const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mydataSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    phone: Number,
    age: Number,
    country: String,
    gender: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("customUser", mydataSchema);
