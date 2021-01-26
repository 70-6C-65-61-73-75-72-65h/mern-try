const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // 'bearer token'
    if (!token) {
      return res.status(401).json({ message: "Not Authorized 1" });
    }
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next(); /// delete return
  } catch (e) {
    res.status(401).json({ message: "Not Authorized 2" }); /// delete return
  }
};
