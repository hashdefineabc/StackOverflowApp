const express = require("express");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.json({ message: "All fields are required" });
  }
  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.json({ message: "Username already exists" });
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
    res.json({ success: true, message: "Signup successful", user: newUser }); // Send a success response
  } catch (error) {
    console.error("Error signing up:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred during signup" });
  }
});

router.post("/login", async (req, res) => {
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

router.post("/logout", async (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});


module.exports = router;
