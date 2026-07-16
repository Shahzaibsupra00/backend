const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from the frontend origin
    credentials: true, // Allow cookies to be sent
  }),
);
app.use(cookieParser());

// Import the user router
const userRouter = require("./routes/user.route.js");

// Use the user router for routes starting with /demousers
app.use("/demousers", userRouter);

module.exports = app;
