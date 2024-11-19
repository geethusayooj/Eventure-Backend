const router = require("express").Router();
const Booking = require("../models/Booking.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// CREATE BOOKING - POST /api/bookings
router.post("/", isAuthenticated, (req, res, next) => {
  const { userId, eventId, quantity } = req.body;

  Booking.create({ userId, eventId, quantity })
    .then((bookingFromDB) => {
      res.status(201).json(bookingFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to create booking" });
    });
});

// GET ALL BOOKINGS - GET /api/bookings
router.get("/", isAuthenticated, (req, res, next) => {
  Booking.find()
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

  Booking.findByIdAndUpdate(bookingId, { quantity }, { new: true })
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

  Booking.findByIdAndDelete(bookingId)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to delete booking" });
    });
});

module.exports = router;
