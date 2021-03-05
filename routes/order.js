const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-client");
const order = require("../models/order");
const Order = require("../models/order");

// must be authenticated and client
// create new restaurant
router.post("/create-order", isAuth, async (req, res, next) => {
  try {
    const { restId, tableNumber, items, total } = req.body;
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
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { $push: { items: items }, $inc: { total: total } }
    );

    req.io
      .of("/restaurant-space")
      .to(updatedOrder.restId.toString())
      .emit("message", {
        msg: "oreder updated",
      });

    res.status(201).json({ order: updatedOrder });
  } catch (error) {
    next(error);
  }
});
//edit order after confirm
router.put("/edit-reorder", async (req, res, next) => {
  try {
    const { itemId, orderId, newValues } = req.body;
    let orderToUpdate = await Order.findOne({ _id: orderId });
    orderToUpdate.items = orderToUpdate.items.map((item) => {
      if (item._id == itemId) {
        item.quantity = newValues;
        item.confirmed = false;
      }
      return item;
    });

    orderToUpdate.preOrder = orderToUpdate.preOrder.map((item) => {
      if (item._id == itemId) {
        item.quantity = newValues;
        item.confirmed = false;
      }
    });

    orderToUpdate.preOrder.push({ itemId });
    await orderToUpdate.save();
    req.io
      .of("/restaurant-space")
      .to(orderToUpdate.restId.toString())
      .emit("message", {
        msg: "order edit  req",
      });
    res.status(200).json({ order: orderToUpdate });
  } catch (error) {
    next(error);
  }
});
// confirm cancel request
router.put(
  "/confirm-cancel",
  // isAuth,
  async (req, res, next) => {
    try {
      const { itemId, orderId } = req.body;
      let orderToUpdate = await Order.findOne({ _id: orderId });

      let { price } = orderToUpdate.items.filter(
        (item) => item._id.toString() === itemId
      )[0];
      orderToUpdate.items = orderToUpdate.items.filter(
        (item) => item._id.toString() !== itemId
      );
      orderToUpdate.total = Number(orderToUpdate.total) - Number(price);
      orderToUpdate.preOrder = orderToUpdate.preOrder.filter(
        (item) => item.itemId !== itemId
      );
      await orderToUpdate.save();
      req.io
        .of("/restaurant-space")
        .to(orderToUpdate.restId.toString())
        .emit("message", {
          msg: "order cancel confirmed",
        });
      res.status(201).json({ order: orderToUpdate });
    } catch (error) {
      next(error);
    }
  }
);
// cancel order request
router.put(
  "/cancel-order",
  //  isAuth,
  async (req, res, next) => {
    try {
      const { itemId, orderId } = req.body;
      let orderToUpdate = await Order.findOne({ _id: orderId });
      orderToUpdate.items = orderToUpdate.items.map((item) => {
        if (item._id == itemId) item.confirmed = false;
        return item;
      });
      orderToUpdate.preOrder.push({ itemId });
      await orderToUpdate.save();
      req.io
        .of("/restaurant-space")
        .to(orderToUpdate.restId.toString())
        .emit("message", {
          msg: "order cancel req",
        });
      res.status(200).json({ order: orderToUpdate });
    } catch (error) {
      next(error);
    }
  }
);
// confirm cancel request
router.put(
  "/confirm-cancel",
  // isAuth,
  async (req, res, next) => {
    try {
      const { itemId, orderId } = req.body;
      let orderToUpdate = await Order.findOne({ _id: orderId });

      let { price } = orderToUpdate.items.filter(
        (item) => item._id.toString() === itemId
      )[0];
      orderToUpdate.items = orderToUpdate.items.filter(
        (item) => item._id.toString() !== itemId
      );
      orderToUpdate.total = Number(orderToUpdate.total) - Number(price);
      orderToUpdate.preOrder = orderToUpdate.preOrder.filter(
        (item) => item.itemId !== itemId
      );
      await orderToUpdate.save();
      req.io
        .of("/restaurant-space")
        .to(orderToUpdate.restId.toString())
        .emit("message", {
          msg: "order cancel confirmed",
        });
      res.status(201).json({ order: orderToUpdate });
    } catch (error) {
      next(error);
    }
  }
);
// refuse cancel request
router.put(
  "/refuse-cancel",
  // isAuth,
  async (req, res, next) => {
    try {
      const { itemId, orderId } = req.body;
      let orderToUpdate = await Order.findOne({ _id: orderId });

      orderToUpdate.items = orderToUpdate.items.map((item) => {
        if (item._id == itemId) item.confirmed = true;
        return item;
      });
      orderToUpdate.preOrder = orderToUpdate.preOrder.map((item) => {
        if (item.itemId == itemId) item.confirmed = true;
        return item;
      });

      await orderToUpdate.save();
      req.io
        .of("/restaurant-space")
        .to(orderToUpdate.restId.toString())
        .emit("message", {
          msg: "order cancel refused",
        });
      res.status(201).json({ order: orderToUpdate });
    } catch (error) {
      next(error);
    }
  }
);

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
