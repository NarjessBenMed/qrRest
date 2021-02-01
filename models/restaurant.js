const mongoose = require("mongoose");
const Menu = require("./menu");
const User = require("./user");
const Table = require("./table");
const clearImage = require("../utils/clearImage");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    owner: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

restaurantSchema.pre("findOneAndDelete", async function (next) {
  console.log(this._conditions._id);
  const deletedMenu = await Menu.findOneAndDelete({
    restaurant: this._conditions._id,
  });

  deletedMenu.items.map((item) => {
    clearImage(item.image);
  });
  await User.deleteMany({ restaurantId: this._conditions._id });
  await Table.deleteMany({ restaurant: this._conditions._id });
  next();
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
