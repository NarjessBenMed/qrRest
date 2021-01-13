require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const connectDB = require('./db');
const createAdmin = require('./utils/seed');
const createCode = require('./utils/qrCode');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const ownerRoutes = require('./routes/owner');
const tableRoutes = require('./routes/table');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const workerRoutes = require('./routes/worker');

const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

connectDB();
// inserting admin into database
createAdmin();

app.use(express.json({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/auth', authRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/owner', ownerRoutes);
app.use('/table', tableRoutes);
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use('/worker', workerRoutes);
// custom error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(statusCode).json({ message, data });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`server up on port ${PORT}`));
const io = require('./socket').init(server);
io.on('connection', (socket) => {
  console.log('client connected');
  socket.on('disconnect', () => {
    console.log('user disonnected');
  });
});
const nsp = io.of('/admin-space');
const ownernsp = io.of('/owner-space');
const menunsp = io.of('/menu-space');
const restnsp = io.of('/restaurant-space');

restnsp.on('connection', (socket) => {
  socket.on('joinRoom', ({ restId }) => {
    console.log('restid', restId);
    socket.join(restId);
  });

  console.log('client connected to restaurant');
  restnsp.emit('hi', { msg: 'restaurant namespace say hello' });
  socket.on('disconnect', () => {
    console.log('client disconnected from restaurant');
  });
});
nsp.on('connection', (socket) => {
  console.log('admin connected');
  nsp.emit('hi', { msg: 'admin namespace say hello' });
  socket.on('disconnect', () => {
    console.log('admin disconnected');
  });
});
ownernsp.on('connection', (socket) => {
  console.log('owner connected');
  nsp.emit('hi', { msg: 'owner namespace say hello' });
  socket.on('disconnect', () => {
    console.log('owner disconnected');
  });
});
menunsp.on('connection', (socket) => {
  console.log('Menu connected hhhh');
  menunsp.emit('hi', { msg: 'menu namespace say hello' });
  socket.on('disconnect', () => {
    console.log('menu disconnected');
  });
});
