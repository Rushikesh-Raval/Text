const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData); // This is the correct variable
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        // Use 'createdChat'
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// Fetches chats----------

const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Chat.find({ users: { $elementMatch: { $eq: req.user._id } } }) //The Orignal one
    Chat.find({ users: { $in: [req.user._id] } }) //modified
      .populate("users", "name pic email")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }) //sorts with respect to new messages
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {}
});


//Creates group chat-------------

const createGroupChat = asyncHandler(async (req, res) => {
  // Ensure the necessary fields are provided
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  // Parse users and validate that there are at least 2 other users
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group");
  }

  // Add the current user (the one creating the group) to the group users array
  users.push(req.user);

  try {
    // Create a new group chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    // Populate the newly created group chat, excluding passwords
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password") // Exclude password
      .populate("groupAdmin", "-password"); // Exclude password

    // Return the full group chat information
    res.status(200).json(fullGroupChat);
  } catch (error) {
    // Send error response in case of failure
    res
      .status(500)
      .send({ message: "Failed to create group chat", error: error.message });
  }
});



// Renames Group-----------

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

//Removes from group chat-------

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
