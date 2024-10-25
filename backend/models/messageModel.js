const mongoose = require("mongoose");

// Define the schema for a message
const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
    content: { type: String, trim: true }, // Content of the message
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // Reference to Chat model
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Message model based on the schema
const Message = mongoose.model("Message", messageSchema);

module.exports = Message; // Export the model
