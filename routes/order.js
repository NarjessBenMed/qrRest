const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-client");
const Order = require("../models/order");

// must be authenticated and client
// create new restaurant
router.post("/create-order", isAuth, async (req, res, next) => {
  try {
    const { restId, tableNumber, items, total } = req.body;

    // let existedOrder;
    // if (orderId) {
    //   existedOrder = await Order.findOneAndUpdate(
    //     { _id: orderId },
    //     // { total: Number(total) + Number(prix)
    //     { $push: { items: items }, $inc: { total: total } },
    //     { upsert: true, new: true, setDefaultsOnInsert: true }
    //   );
    // } else {
    const newOrder = new Order({
      items,
      total,
      restId,
      tableNumber,
    });
    const order = await newOrder.save();

    req.io.of("/restaurant-space").to(restId).emit("message", {
      msg: "a new order passed",
    });
    res.status(200).json({
      order,
      id: order._id.toString(),
    });
  } catch (error) {
    next(error);
  }
});
// update order
router.put("/update-order", isAuth, async (req, res, next) => {
  try {
    const { items, total, orderId } = req.body;
    console.log(orderId);
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { $push: { items: items }, $inc: { total: total } }
    );

    req.io
      .of("/restaurant-space")
      .to(updatedOrder.restId.toString())
      .emit("message", {
        msg: "a new order passed",
      });

    res.status(201).json({ order: updatedOrder });
  } catch (error) {
    next(error);
  }
});

// get command by id

router.get("/get-client-order/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // prevent the access from non owner (handle permission)
    const order = await Order.findOne({
      _id: orderId,
    });

    if (!order) {
      const error = new Error("No order");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
});

/// get all by rest id

router.get("/get-order/:restId", async (req, res, next) => {
  try {
    // prevent the access from non owner (handle permission)
    const { restId } = req.params;
    const order = await Order.find({ restId });
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

// update order
router.put("/checkout-order", async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    order.paid = true;
    const response = await order.save();
    req.io.of("/restaurant-space").to(order.restId.toString()).emit("message", {
      msg: "a new order passed",
    });

    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
