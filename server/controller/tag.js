const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    try {
        const tags = await Tag.find({});
        const questions = await Question.find().populate('tags');

        const tagCounts = {};

        questions.forEach(question => {
            question.tags.forEach(tag => {
                tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
            });
        });

        const response = tags.map(tag => ({
            name: tag.name,
            qcnt: tagCounts[tag.name] || 0
        }));

        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);

module.exports = router;
