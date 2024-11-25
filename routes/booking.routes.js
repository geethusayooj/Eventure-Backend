const router = require("express").Router();
const Booking = require("../models/Booking.model");
const Event = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// CREATE BOOKING - POST /api/bookings
router.post("/", isAuthenticated, (req, res, next) => {
  const { userId, eventId, quantity } = req.body;

  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if enough tickets are available
      if (event.availableTickets < quantity) {
        return res.status(400).json({ error: "Not enough tickets available" });
      }

      // Create the booking (totalPrice is automatically calculated due to pre-save hook in Booking model)
      return Booking.create({ userId, eventId, quantity })
      .then((bookingFromDB) => {
        // Decrease the available tickets for the event
        event.availableTickets -= quantity;

        // Save the updated event with the reduced tickets
        return event.save().then(() => {
          // Send a response with the booking details
          res.status(201).json(bookingFromDB);
        });
      });
  })
  .catch((error) => {
    // Handle any errors
    next(error);
    res.status(500).json({ error: "Failed to create booking" });
  });
});
// GET ALL BOOKINGS - GET /api/bookings
router.get("/", isAuthenticated, (req, res, next) => {
  Booking.find()
  .populate("userId", "name email")  
  .populate("eventId", "title location price")
    .then((bookingsFromDB) => {
      res.status(200).json(bookingsFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to get bookings" });
    });
});

// GET BOOKING BY ID - GET /api/bookings/:bookingId
router.get("/:bookingId", isAuthenticated, (req, res, next) => {
  const { bookingId } = req.params;

  Booking.findById(bookingId)
 
    .then((bookingFromDB) => {
      res.status(200).json(bookingFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to get booking details" });
    });
});

// UPDATE BOOKING (Quantity) - PUT /api/bookings/:bookingId
router.put("/:bookingId", isAuthenticated, (req, res, next) => {
  const { bookingId } = req.params;
  const { quantity } = req.body;

  // Check if the booking exists first
  Booking.findById(bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Find the event to validate the updated quantity
      return Event.findById(booking.eventId);
    })
    .then((event) => {
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if enough tickets are available for the new quantity
      if (event.availableTickets < quantity) {
        return res.status(400).json({ error: "Not enough tickets available" });
      }

      // Update the booking quantity and totalPrice
      return Booking.findByIdAndUpdate(
        bookingId,
        { quantity, totalPrice: event.price * quantity },
        { new: true }
      );
    })
    .then((updatedBooking) => {
      res.status(200).json(updatedBooking);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to update booking" });
    });
});

// DELETE BOOKING - DELETE /api/bookings/:bookingId
router.delete("/:bookingId", isAuthenticated, (req, res, next) => {
  const { bookingId } = req.params;

  // First, find the booking by ID
  Booking.findById(bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

     
      return Event.findById(booking.eventId)
        .then((event) => {
          if (!event) {
            return res.status(404).json({ error: "Event not found" });
          }

          // Increase the available tickets by the quantity in the booking
          event.availableTickets += booking.quantity;

          // Save the updated event with the increased ticket count
          return event.save().then(() => {
            // Now, delete the booking
            return Booking.findByIdAndDelete(bookingId);
          });
        })
        .then(() => {
          res.status(204).send();
        });
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to delete booking" });
    });
});


module.exports = router;
