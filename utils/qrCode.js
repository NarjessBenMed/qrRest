const QRCode = require("qrcode");

const createCode = async (text) => {
  try {
    const img = text + ".png";
    await QRCode.toFile(`./images/${img}`, text);
    return img;
  } catch (err) {
    console.error(err);
  }
};

module.exports = createCode;
