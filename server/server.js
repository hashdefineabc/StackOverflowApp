// // Application server

// const express = require("express");
// const mongoose = require("mongoose");

// const { MONGO_URL, port } = require("./config");

// mongoose.connect(MONGO_URL);

// const app = express();

// app.get("/", (_, res) => {
//     res.send("Fake SO Server Dummy Endpoint");
//     res.end();
// });

// let server = app.listen(port, () => {
//     console.log(`Server starts at http://localhost:${port}`);
// });

// process.on("SIGINT", () => {
//     server.close();
//     mongoose.disconnect();
//     console.log("Server closed. Database instance disconnected");
//     process.exit(0);
// });

// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

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
app.use(express.json());

//const {MONGO_URL, PORT} = process.env;

const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

// Set up middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.TOKEN_KEY, // never hardcode in source code. hard-coded here for demonstration purposes.
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

app.get("", (req, res) => {
  res.send("hello world");
  res.end();
});

// Check login status route
app.get("/check-login", (req, res) => {
  const user = req.session.user;
  res.json({ loggedIn: !!user, user });
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "Incorrect password or email" });
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return res.json({ message: "Incorrect password or email" });
  }

  if (user) {
    req.session.user = user;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Register route
app.post("/register", async (req, res) => {
  const { email, password, username, createdAt } = req.body;
  if (!email || !password || !username) {
    return res.json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      createdAt: new Date(),
    });
    console.log(newUser);

    req.session.user = newUser; // log the user in automatically after signup
    res.json({ success: true, message: "Signup successful" , user: newUser}); // Send a success response

  } catch (error) {
    console.error("Error signing up:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred during signup" });
  }
});


// Logout route
app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);

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
