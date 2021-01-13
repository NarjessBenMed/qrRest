const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Menu = require('../models/menu');
const isAuth = require('../middleware/is-auth');
const ROLE = require('../utils/roles');
const authRole = require('../utils/authRole');

// user must be authenticated and admin
router.post(
  '/create-owner',
  [
    body('username').trim().isLength({ min: 5 }),
    body('password').trim().isLength({ min: 5 }),
  ],
  isAuth,
  authRole(ROLE.ADMIN),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const { username, password } = req.body;
      const existedUser = await User.findOne({ username });
      if (existedUser) {
        const error = new Error('username already exists');
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        password: hashedPassword,
        role: ROLE.OWNER,
      });
      const createdUser = await user.save();
      const token = jwt.sign(
        {
          username: user.username,
          userId: user._id.toString(),
          role: user.role,
        },
        jwtSecret,
        { expiresIn: '1h' }
      );
      req.io.of('/admin-space').emit('owners', {
        action: 'create',
      });

      res.status(201).json({ token, message: 'User created', userId: createdUser._id });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/owners', isAuth, authRole(ROLE.ADMIN), async (req, res, next) => {
  try {
    const owners = await User.find({ role: 'owner' });

    res.status(200).json(owners);
  } catch (err) {
    next(err);
  }
});

router.put('/del-owner', isAuth, authRole(ROLE.ADMIN), async (req, res, next) => {
  try {
    const { id } = req.body;

    const response = await User.findOneAndDelete({ _id: id });

    if (!response) {
      const error = new Error('No owner');
      error.statusCode = 404;
      throw error;
    }
    req.io.of('/admin-space').emit('owners', { action: 'delete' });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
