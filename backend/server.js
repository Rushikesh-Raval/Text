const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const cors = require("cors");
const path = require('path')

dotenv.config(); // Load environment variables

const app = express();
connectDB(); // Connect to the database

// Middleware
app.use(cors({
  origin: ["https://text-mee.onrender.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); // Parse JSON from requests

// Logging middleware to debug route access
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);

// -------------------Deployment----------------------
const __dirname1 = path.resolve()

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname1,"../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../frontend/build", "index.html"));
  });
}else{
  app.get("/",(req,res)=>{
    res.send("API Is Running Successfully")
  })
}
// -------------------Deployment----------------------

// Middleware for handling errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Setting up socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://text-mee.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userData = userData;
    console.log("User setup with ID:", userData._id);
    socket.emit("connected");
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    if (socket.userData) {
      socket.leave(socket.userData._id);
    }
  });
});
