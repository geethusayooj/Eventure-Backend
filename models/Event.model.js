const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  image: { type: String, default: "" },
});

module.exports = mongoose.model("Event", EventSchema);
