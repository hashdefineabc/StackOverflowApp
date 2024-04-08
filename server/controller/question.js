const express = require("express");
const Question = require("../models/questions");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

const router = express.Router();

// To get Questions by Filter
router.get('/getQuestion', async (req, res) => {
    try {
        const { order, search } = req.query;
        let questions = [];

        if (order) {
            questions = await getQuestionsByOrder(order);
        }

        if (search) {
            questions = await filterQuestionsBySearch(questions, search);
        }

        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// To get Questions by Id
router.get('/getQuestionById/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }).populate('answers');
        
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.json(question);
    } catch (error) {
        console.error("Error fetching question by id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// To add Question
router.post('/addQuestion', async (req, res) => {
    try {
        let question = req.body;
        let tagIds = [];
        for (let i = 0; i < question.tags.length; i++) {
            let tagId = await addTag(question.tags[i]);
            tagIds.push(tagId);
        }
        let newQuestion = await Question.create({
            title: question.title,
            text: question.text,
            asked_by: question.asked_by,
            ask_date_time: new Date(),
            tags: tagIds,
            views: 0,
        });
        res.json(newQuestion);
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
