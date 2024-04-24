const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
    try {
        const { ans, qid } = req.body;
        
        const answer = await Answer.create(ans);
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { answers: { $each: [answer._id], $position: 0 } } },
            { new: true }
        );
        
        res.json({ text: answer.text, _id: answer._id });
    } catch (error) {
        console.error("Error adding answer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

router.post('/addAnswer', addAnswer);

module.exports = router;
