const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    restId: {
      type: mongoose.ObjectId,
      ref: "Restaurant",
    },
    tableNumber: {
      type: Number,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [
        {
          name: { type: String },
          quantity: { type: Number },
          price: { type: Number },
          createdAt: { type: String },
        },
      ],
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
