const { Schema, model } = require("mongoose");
const schema = Schema({
  name: String,
  password: String,
  status: String,
  visibility: Boolean,
});

module.exports = model("User", schema);
