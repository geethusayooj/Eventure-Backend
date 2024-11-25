const router = require("express").Router();
const Event = require("../models/Event.model");

// CREATE EVENT - POST /api/events
router.post("/", (req, res, next) => {
  const {
    title,
    description,
    category,
    date,
    image,
    location,
    price,
    availableTickets,
  } = req.body;

  Event.create({
    title,
    description,
    category,
    date,
    image,
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





// GET EVENT BY ID - GET /api/events/:eventId
router.get("/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  Event.findById(eventId)  // Using the eventId to fetch the event
    .then((eventFromDB) => {
      res.status(200).json(eventFromDB);
    })
    .catch((error) => {
      next(error);
    });
});


// UPDATE EVENT - PUT /api/events/:eventId
router.put("/:eventId", (req, res, next) => {
  const { eventId } = req.params;
  const updatedDetails = req.body;
  if (updatedDetails.availableTickets < 0) {
    return res.status(400).json({ error: "Tickets cannot be negative." });
  }
  Event.findByIdAndUpdate(
    eventId, 
    updatedDetails, 
    { new: true }  
  )
    .then((updatedEvent) => {
      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(updatedEvent); 
    })
    .catch((error) => {
      console.error("Error updating event:", error);
      next(error); 
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


// GET ALL EVENTS OR FILTER BY CATEGORY - GET /api/category/:category
router.get("/category/:category", (req, res, next) => {
  const { category } = req.params; 
  console.log(category)
  const filter = category ? { category } : {}; 
  console.log(filter)
  
  Event.find(filter)
    .then((eventsFromDB) => {
      res.status(200).json(eventsFromDB); 
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      next(error);
      res.status(500).json({ error: "Failed to get events" });
    });
});



module.exports = router;

