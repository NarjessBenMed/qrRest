const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
// get all restaurants
router.get("/adherent", async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().select("name logo");
    res.status(200).json(restaurants);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
