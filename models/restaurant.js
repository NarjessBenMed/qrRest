const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    owner: {
      type: mongoose.ObjectId,
      ref: 'User',
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

module.exports = mongoose.model('Restaurant', restaurantSchema);
