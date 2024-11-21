const router = require("express").Router();
const Event = require("../models/Event.model");

// CREATE EVENT - POST /api/events
router.post("/", (req, res, next) => {
  const {
    title,
    description,
    category,
    date,
    location,
    price,
    availableTickets,
  } = req.body;

  Event.create({
    title,
    description,
    category,
    date,
    location,
    price,
    availableTickets,
  })
    .then((eventFromDB) => {
      res.status(201).json(eventFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to create event" });
    });
});

// GET ALL EVENTS - GET /api/events
router.get("/", (req, res, next) => {
  Event.find()
    .then((eventsFromDB) => {
      res.status(200).json(eventsFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to get events" });
    });
});

// GET ALL EVENTS OR FILTER BY CATEGORY - GET /api/events
router.get("/:category", (req, res, next) => {
  const { category } = req.params; // Retrieve category from query parameter
  console.log(category)
  const filter = category ? { category } : {}; // If category is provided, apply the filter
  console.log(filter)
  // Apply filter to Event model
  Event.find(filter)
    .then((eventsFromDB) => {
      res.status(200).json(eventsFromDB); // Return the filtered events
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      next(error);
      res.status(500).json({ error: "Failed to get events" });
    });
});




// GET EVENT BY ID - GET /api/events/:eventId
router.get("/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  Event.findById(eventId)
    .then((eventFromDB) => {
      res.status(200).json(eventFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to get event details" });
    });
});


// UPDATE EVENT - PUT /api/events/:eventId
router.put("/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  const updatedDetails = req.body;

  Event.findByIdAndUpdate(eventId, updatedDetails, { new: true })
    .then((updatedEvent) => {
      res.status(200).json(updatedEvent);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to update event" });
    });
});

// DELETE EVENT - DELETE /api/events/:eventId
router.delete("/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  Event.findByIdAndDelete(eventId)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to delete event" });
    });
});

module.exports = router;
