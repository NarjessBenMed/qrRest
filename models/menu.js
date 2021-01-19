const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  restaurant: {
    type: mongoose.ObjectId,
    ref: "Restaurant",
  },

  nameRest: {
    type: String,
    // required: true,
  },
  logo: {
    type: String,
    // required: true,
  },

  items: [
    {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      price: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      categorie: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Menu", menuSchema);
