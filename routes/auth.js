const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
const bcrypt = require("bcrypt");
const Restaurant = require("../models/restaurant");
const Table = require("../models/table");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");

router.post(
  "/login",
  [
    body("username").trim().isLength({ min: 4 }),
    body("password").trim().isLength({ min: 5 }),
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
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        const error = Error("user not found");
        (error.statusCode = 401),
          (error.data = [{ param: "username", msg: "wrong username" }]);
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        error.data = [{ param: "password", msg: "wrong password" }];
        throw error;
      }
      const token = jwt.sign(
        {
          username: user.username,
          userId: user._id.toString(),
          role: user.role,
        },
        jwtSecret,
        { expiresIn: "24h" }
      );
      // req.io.on('connection', (socket) => {
      //   console.log('new user connected');
      // });
      res.status(200).json({
        token,
        userId: user._id.toString(),
        role: user.role,
        restaurantId: user.restaurantId,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/auth-client", async (req, res, next) => {
  try {
    const { restId, tableNumber } = req.body;

    const table = await Table.findOne({ restaurant: restId, tableNumber });
    if (!table) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = { msg: "no tabe with this code" };
      throw error;
    }

    const token = jwt.sign({ restId, tableNumber, role: "client" }, jwtSecret, {
      expiresIn: "30m",
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
