const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        // add relevant properties.
        name: { type: String, required: true, unique: true }
    },
    { collection: "Tag" }
);
