const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const clearImage = require("../utils/clearImage");
const isAuth = require("../middleware/is-auth");
const ROLE = require("../utils/roles");
const authRole = require("../utils/authRole");
const Menu = require("../models/menu");

router.get(
  "/get-rest-menu/:restId",

  async (req, res, next) => {
    try {
      const { restId } = req.params;

      // prevent the access from non owner (handle permission)
      const menu = await Menu.findOne({
        restaurant: restId,
      }).populate("restaurant", ["name", "logo"]);

      if (!menu) {
        const error = new Error("No menu");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ menu });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/update-menu",
  isAuth,
  authRole(ROLE.OWNER),
  [
    body("name").trim().isLength({ min: 5 }),
    body("price").trim().isNumeric(),
    body("description").trim().isLength({ min: 5 }),
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
      const image = req.file.path.replace("\\", "/");
      const {
        restaurant,
        name,
        nameRest,
        logo,
        price,
        description,
        categorie,
      } = req.body;
      const newMenu = {
        name,
        nameRest,
        logo,
        image,
        price,
        description,
        categorie,
      };

      let updatedMenu = await Menu.findOne({ restaurant: restaurant });

      updatedMenu.items.push(newMenu);
      await updatedMenu.save();
      req.io.of("/restaurant-space").to(restaurant.toString()).emit("newMenu", {
        msg: "a new menu",
      });

      return res.status(200).json(updatedMenu);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/delete-item",
  isAuth,
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const { idMenu, id } = req.body;
      const foundFood = await Menu.findOne({ _id: idMenu });
      const imgPath = foundFood.items.filter(
        (item) => item._id.toString() === id.toString()
      )[0].image;
      foundFood.items = foundFood.items.filter(
        (item) => item._id.toString() !== id.toString()
      );

      foundFood.save();
      if (!foundFood) {
        const error = new Error("No item");
        error.statusCode = 404;
        throw error;
      }
      clearImage(imgPath);
      req.io
        .of("/restaurant-space")
        .to(foundFood.restaurant.toString())
        .emit("newMenu", {
          msg: "a new menu",
        });

      res.status(200).json(foundFood);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/edit-item",
  isAuth,
  [
    body("name").trim().isLength({ min: 5 }),
    body("price").trim().isNumeric(),
    body("description").trim().isLength({ min: 5 }),
  ],
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      let image;
      const { idMenu, idItem, price, name, description, lastImg } = req.body;

      if (req.file) {
        image = req.file.path.replace("\\", "/");
        clearImage(lastImg, "..");
      } else {
        image = lastImg;
      }
      const foundFood = await Menu.findOneAndUpdate(
        { _id: idMenu },
        {
          $set: {
            "items.$[el].name": name,
            "items.$[el].price": price,
            "items.$[el].description": description,
            "items.$[el].image": image,
          },
        },
        { arrayFilters: [{ "el._id": idItem }], new: true }
      );

      const response = await foundFood.save();
      req.io
        .of("/restaurant-space")
        .to(foundFood.restaurant.toString())
        .emit("newMenu", {
          msg: "a new menu",
        });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
