const mongoose = require("mongoose");

// Schema for user
module.exports = mongoose.Schema(
    {
        // define the relevant properties.
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        location: { type: String, default:null},
        title: { type: String, default:null},
        aboutme: { type: String, default:null},
        githubLink: { type: String, default:null},
        linkedInLink: { type: String, default:null},
    },
    { collection: "User" }
);
