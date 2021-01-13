const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const ROLE = require("../utils/roles");
const authRole = require("../utils/authRole");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");

router.get("/get-rest-menu/:restId", async (req, res, next) => {
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
});

// must be authenticated and owner
// create  menu
// router.post('/create-menu', isAuth, authRole(ROLE.OWNER), async (req, res, next) => {
//   try {
//     const { restaurant } = req.body;
//     const existedMenu = await Menu.findOne({ restaurant });
//     if (existedMenu) {
//       const error = new Error('Restaurant already have a menu ');
//       error.statusCode = 409;
//       throw error;
//     }
//     const menu = new Menu({
//       restaurant,
//     });

//     const createdMenu = await menu.save();
//     res.status(201).json({
//       message: 'menu created',
//       RestaurantId: createdMenu._id,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// update menu
// must be authenticated and owner

router.put(
  "/update-menu",
  isAuth,
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const {
        restaurant,
        name,
        nameRest,
        logo,
        price,
        description,
        categorie,
      } = req.body;
      if (!req.file) {
        const error = new Error("No image provided");
        error.statusCode = 422;
        throw error;
      }
      const image = req.file.path.replace("\\", "/");
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
      req.io.of("/restaurant-space").to(restaurant).emit("newMenu", {
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
      foundFood.items = foundFood.items.filter(
        (item) => item._id.toString() !== id.toString()
      );

      foundFood.save();
      if (!foundFood) {
        const error = new Error("No item");
        error.statusCode = 404;
        throw error;
      }
      req.io.of("/menu-space").emit("menu", { action: "delete" });

      res.status(200).json(foundFood);
    } catch (error) {
      next(error);
    }
  }
);

//-----------------------
// router.get("/get-menu", async (req, res, next) => {
//   try {
//     const { menuId } = req.body;
//     // prevent the access from non owner (handle permission)
//     const menu = await Menu.findOne({
//       _id: menuId,
//     });
//     if (!menu) {
//       const error = new Error("No menu");
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json(menu);
//   } catch (err) {
//     next(err);
//   }
// });

router.put(
  "/edit-item",
  isAuth,
  authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      let image;
      const { idMenu, idItem, price, name, description, lastImg } = req.body;

      if (req.file) {
        image = req.file.path.replace("\\", "/");
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
      req.io.of("/menu-space").emit("menu", { action: "edit" });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
