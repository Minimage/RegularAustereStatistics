const mongoose = require("mongoose");
const BaseSchema = new mongoose.Schema({
  Base64: { type: String, required: [true, "provide valid Base64 string"] },
  Comment: { type: String, required: [true, "provide valid Comment"] },
  myDate: {
    type: Date,
    required: true,
  },
});
const Base64 = mongoose.model("Base64", BaseSchema);
module.exports = Base64;
