const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        // define the relevant properties.
        title: {type: String, required: true},
        text: {type: String, required: true},
        answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        asked_by: { type: String, required: true },
        ask_date_time: { type: Date, default: Date.now },
        views: { type: Number, default: 0 } ,
        upvotes: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
    },
    { collection: "Question" }
);
