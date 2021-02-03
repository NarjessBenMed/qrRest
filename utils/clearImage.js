const fs = require("fs");
const path = require("path");
const clearImage = (filePath, folder) => {
  filePath = path.join(__dirname, folder, filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = clearImage;
