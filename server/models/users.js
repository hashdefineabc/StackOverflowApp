// User Document Schema
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./schema/user");

User.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
}),

module.exports = mongoose.model("User", User);
