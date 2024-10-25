const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Mongodb connected: ${conn.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Error: ${error.message}`.bgRed.white);
    process.exit();
  }
};

module.exports = connectDB;
