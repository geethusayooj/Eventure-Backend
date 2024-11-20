const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // References the Event model
    required: true,
  },
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
