const mongoose = require('mongoose');

// Define the Booking Schema
const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // References the Event model
        required: true
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1  // Prevents booking less than 1 ticket
    },
    totalPrice: {
        type: Number, 
        required: false,
        
    },
    bookingDate: { 
        type: Date, 
        default: Date.now 
    }
});

// Pre-save hook to calculate totalPrice before saving
BookingSchema.pre('save', async function(next) {
    try {
        const event = await mongoose.model('Event').findById(this.eventId);
        if (event) {
            this.totalPrice = event.price * this.quantity; // Calculate totalPrice
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Export the model based on the schema
module.exports = mongoose.model('Booking', BookingSchema);
