const { Schema, model } = require("mongoose");
const schema = Schema({
  times: Date,
  arrivalDeparture: String,
  money: Number,
  type: String,
  comment: String,
  profit: Boolean,
});

module.exports = model("Money", schema);
