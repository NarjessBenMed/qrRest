require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const connectDB = require("./db");
const createAdmin = require("./utils/seed");
const createCode = require("./utils/qrCode");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/sendEmail");
const restaurantRoutes = require("./routes/restaurant");
const ownerRoutes = require("./routes/owner");
const tableRoutes = require("./routes/table");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");
const workerRoutes = require("./routes/worker");

const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", authRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/owner", ownerRoutes);
app.use("/table", tableRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);
app.use("/worker", workerRoutes);
app.use("/contact", emailRoutes);

//serve static assets in productiion
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// custom error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(statusCode).json({ message, data });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`server up on port ${PORT}`));
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("disconnect", () => {
    console.log("user disonnected");
  });
});
const nsp = io.of("/admin-space");
const ownernsp = io.of("/owner-space");
const restnsp = io.of("/restaurant-space");

restnsp.on("connection", (socket) => {
  socket.on("joinRoom", ({ restId }) => {
    console.log("restid", restId);
    socket.join(restId);
  });

  console.log("client connected to restaurant");

  socket.on("disconnect", () => {
    console.log("client disconnected from restaurant");
  });
});
nsp.on("connection", (socket) => {
  console.log("admin connected");

  socket.on("disconnect", () => {
    console.log("admin disconnected");
  });
});
ownernsp.on("connection", (socket) => {
  socket.on("joinRoom", ({ restId }) => {
    console.log("joining room in owner namespace", restId);
    socket.join(restId);
  });
  console.log("owner connected");

  socket.on("disconnect", () => {
    console.log("owner disconnected");
  });
});
