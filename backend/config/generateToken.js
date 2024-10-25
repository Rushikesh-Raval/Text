const jwt = require("jsonwebtoken");

//generates new token and asigns it.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;