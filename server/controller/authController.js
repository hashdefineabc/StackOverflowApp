const express = require("express");
const User = require("../models/Users");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");
const { userVerification } = require("../middleware/authMiddleware");

const router = express.Router();

// currently not using this file, directly added routes for register, login, logout in server.js file
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    //console.log(user);
    const token = createSecretToken(user._id.toString());
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
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
    // const token = createSecretToken(user._id);
    // res.cookie("token", token, {
    //   withCredentials: true,
    //   httpOnly: false,
    // });
    // res
    //   .status(201)
    //   .json({ message: "User logged in successfully", success: true });

    if (user) {
      req.session.user = user;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    next();
  } catch (error) {
    console.error(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    req.session.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
});

// Check login status route
router.get('/check-login', (req, res) => {
  const user = req.session.user;
  res.json({ loggedIn: !!user, user });
});

router.post("/", userVerification);

module.exports = router;
