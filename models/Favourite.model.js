const mongoose = require('mongoose');

// Define the Favorites Schema
const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // References the Event model
        required: true
    }
});

// Export the model based on the schema
module.exports = mongoose.model('Favorite', FavoriteSchema);
