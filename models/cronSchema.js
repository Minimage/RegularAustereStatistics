const mongoose = require("mongoose");
const cronSchema = new mongoose.Schema({
  name: { type: String },
  cron: { type: String },
  myDate: {
    type: Date,
    required: true,
  },
});

const cronModel = mongoose.model("cron", cronSchema);
module.exports = cronModel;

