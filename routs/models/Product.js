const { Schema, model } = require("mongoose");
const schema = Schema({
  name: String,
  firstPrise: Number,
  lastPrise: Number,
  type: String,
  que: Number,
});

module.exports = model("AstProduct", schema);
