const router = require("express").Router();
const Favorite = require("../models/Favourite.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// CREATE FAVORITE - POST /api/favorites
router.post("/favorites", isAuthenticated, (req, res, next) => {
  const { userId, eventId } = req.body;

  Favorite.create({ userId, eventId })
    .then((favoriteFromDB) => {
      res.status(201).json(favoriteFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to create favorite" });
    });
});

// GET ALL FAVORITES - GET /api/favorites
router.get("/favorites", isAuthenticated, (req, res, next) => {
  Favorite.find()
    .then((favoritesFromDB) => {
      res.status(200).json(favoritesFromDB);
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to get favorites" });
    });
});

// DELETE FAVORITE - DELETE /api/favorites
router.delete("/favorites", isAuthenticated, (req, res, next) => {
  const { userId, eventId } = req.body;

  Favorite.findOneAndDelete({ userId, eventId })
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
      res.status(500).json({ error: "Failed to delete favorite" });
    });
});

module.exports = router;
