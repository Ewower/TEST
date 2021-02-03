const { Schema, model } = require("mongoose");
const schema = Schema({
  seller: String,
  comment: String,
  product: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  worker: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  itog: Number,
});

module.exports = model("Check", schema);
