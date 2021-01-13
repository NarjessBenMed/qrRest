const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not authenticated auth header");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    decodedToken = jwt.verify(token, jwtSecret);
    console.log(decodedToken);
    if (!decodedToken) {
      const error = new Error("Not authenticated decodetoken");
      error.statusCode = 401;
      throw error;
    }
    req.client = {
      restId: decodedToken.restId,
      tableNUmber: decodedToken.tableNUmber,
      role: decodedToken.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};
