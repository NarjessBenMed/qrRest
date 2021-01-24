const express = require('express');
const router = express.Router();

const clearImage = require('../utils/clearImage');
const isAuth = require('../middleware/is-auth');
const ROLE = require('../utils/roles');
const authRole = require('../utils/authRole');
const Table = require('../models/table');
const createCode = require('../utils/qrCode');

// get tables
router.get(
  '/my-tables/:restID',
  isAuth,
  // authRole(ROLE.OWNER),
  async (req, res, next) => {
    try {
      const { restID } = req.params;
      const tables = await Table.find({
        restaurant: restID,
      });

      res.status(200).json(tables);
    } catch (err) {
      next(err);
    }
  }
);

// create new restaurant
router.post('/create-table', isAuth, authRole(ROLE.OWNER), async (req, res, next) => {
  try {
    const { tableNumber, tableCode, restaurant } = req.body;
    const existedTable = await Table.findOne({ tableCode });
    if (existedTable) {
      const error = new Error('Table already exists in this restaurant');
      error.statusCode = 409;
      error.data = [{ param: 'tableNumber', msg: 'table existante' }];
      throw error;
    }
    const codeImg = await createCode(restaurant + '+' + tableNumber);
    const table = new Table({
      tableNumber,
      tableCode,
      restaurant,
      codeImg,
    });
    const createdTable = await table.save();
    req.io.of('/owner-space').emit('tables', { action: 'create' });
    res.status(201).json({
      message: 'Table created',
      TableId: createdTable._id,
    });
  } catch (error) {
    next(error);
  }
});
// delete table
router.delete('/del-table/:id', isAuth, authRole(ROLE.OWNER), async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await Table.findOneAndDelete({ _id: id });
    if (!response) {
      const error = new Error('No table');
      error.statusCode = 404;
      throw error;
    }
    clearImage(response.codeImg);

    req.io.of('/owner-space').emit('tables', { action: 'delete' });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
