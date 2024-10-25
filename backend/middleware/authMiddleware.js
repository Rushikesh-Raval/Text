const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");


// In short what this token does is it shows all the users except the user that is logged in using the token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Remove "Bearer" from the token
      token = req.headers.authorization.split(" ")[1];

      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the decoded ID and exclude the password from the result
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token is found
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
