const mongoose = require("mongoose");

// Schema for user
module.exports = mongoose.Schema(
    {
        // define the relevant properties.
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { collection: "User" }
);
