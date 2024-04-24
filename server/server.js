const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const User = require("../server/models/users");
const bcrypt = require("bcryptjs");

const app = express();
const crypto = require('crypto');

app.use(express.json());

//const {MONGO_URL, PORT} = process.env;

const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000"; //client port
const port = 8000; //server port

// Set up middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// Set up CSRF protection
app.use(csurf());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.use(cookieParser());

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// app.get("", (req, res) => {
//   res.send("hello world");
//   res.end();
// });

// Check login status route
app.get("/check-login", (req, res) => {
  const user = req.session.user;
  res.json({ loggedIn: !!user, user });
});


const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const authController = require("./controller/authController");
const userprofileController = require("./controller/userprofile");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/auth", authController);
app.use("/profile", userprofileController);

let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});

module.exports = server;
