const express = require("express");
const router = express.Router();
const eventRoutes = require("./event.routes");
const bookingRoutes = require("./booking.routes");


router.get("/", (req, res, next) => {
  res.json("All good in here");
});
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
