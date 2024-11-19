const express = require("express");
const router = express.Router();
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');
const favouriteRoutes = require('./favouite.routes');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});
router.use("/events", eventRoutes);       
router.use("/bookings", bookingRoutes);  
router.use("/favorites", favouriteRoutes);


module.exports = router;
