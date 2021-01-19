const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  restaurant: {
    type: mongoose.ObjectId,
    ref: "Restaurant",
  },
  tableNumber: {
    type: String,
    required: true,
  },
  tableCode: {
    type: String,
    required: true,
  },
  codeImg: {
    type: String,
  },

  respWaiter: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Table", tableSchema);
