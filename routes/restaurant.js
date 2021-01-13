const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const ROLE = require("../utils/roles");
const authRole = require("../utils/authRole");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");

// must be authenticated and owner
// create new restaurant
router.post(
  "/create-restaurant",
  isAuth,
  authRole(ROLE.OWNER),
  [
    body("name").trim().isLength({ min: 5 }),
    body("address").trim().isLength({ min: 5 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      if (!req.file) {
        const error = new Error("No image provided");
        error.statusCode = 422;
        error.data = [{ param: "logo", msg: "No image provided" }];
        throw error;
      }
      const logo = req.file.path.replace("\\", "/");
      const { name, address } = req.body;
      const existedRestaurant = await Restaurant.findOne({
        address,
        owner: req.user.userId,
      });
      if (existedRestaurant) {
        const error = new Error("Restaurant already exists");
        error.statusCode = 409;
        throw error;
      }
      const restaurant = new Restaurant({
        name,
        logo,
        address,
        owner: req.user.userId,
      });

      const createdRestaurant = await restaurant.save();
      const menu = new Menu({ restaurant: createdRestaurant._id });
      await menu.save();
      req.io.of("/owner-space").emit("restaurants", { action: "create" });
      res.status(201).json({
        message: "Restaurant created",
        RestaurantId: createdRestaurant._id,
      });
    } catch (error) {
      next(error);
    }
  }
);

// update restaurant
router.put(
  "/edit-rest",
  isAuth,
  [
    body("name").trim().isLength({ min: 5 }),
    body("address").trim().isLength({ min: 5 }),
  ],
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array().map((err) => {
          err.param = err.param + "edit";
          return err;
        });
        throw error;
      }
      let logo;
      const { restId, name, address, lastImg } = req.body;
      if (req.file) {
        logo = req.file.path.replace("\\", "/");
      } else {
        logo = lastImg;
      }
      const newRestInfo = {
        owner: req.user.userId,
        name,
        address,
        logo,
      };
      let updatedRest = await Restaurant.findOneAndUpdate(
        { _id: restId },
        { ...newRestInfo },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          useFindAndModify: false,
        }
      );
      req.io.of("/owner-space").emit("restaurants", { action: "edit" });
      return res.status(200).json(updatedRest);
    } catch (error) {
      next(error);
    }
  }
);

// get all restaurant for the connected owner

router.get(
  "/my-rests",
  isAuth,
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const restaurants = await Restaurant.find({
        owner: req.user.userId,
      });

      res.status(200).json(restaurants);
    } catch (err) {
      next(err);
    }
  }
);

// get one restaurant by id

router.get("/:restId", isAuth, authRole(ROLE.OWNER), async (req, res, next) => {
  try {
    const { restId } = req.params;
    // prevent the access from non owner (handle permission)
    const restaurant = await Restaurant.findOne({
      _id: restId,
      owner: req.user.userId,
    });
    if (!restaurant) {
      const error = new Error("No restaurant");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/del-rest",
  isAuth,
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const { restId } = req.body;
      const response = await Restaurant.findOneAndDelete({ _id: restId });
      if (!response) {
        const error = new Error("No Restaurant");
        error.statusCode = 404;
        throw error;
      }
      req.io.of("/owner-space").emit("restaurants", { action: "delete" });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
