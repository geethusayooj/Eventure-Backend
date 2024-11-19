const mongoose = require("mongoose");

// Define the Event Schema
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

// Export the model based on the schema
module.exports = mongoose.model("Event", EventSchema);
