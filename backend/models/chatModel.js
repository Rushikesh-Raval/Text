const mongoose = require("mongoose");

// Define the schema for a chat
const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true }, // Name of the chat
    isGroupChat: { type: Boolean, default: false }, // Add this field to distinguish between the group chat and one on one chat.
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user references
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Reference to the latest message
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the group admin
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Chat model based on the schema
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat; // Export the model
