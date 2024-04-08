const Tag = require("../models/tags");
const Question = require("../models/questions");

const addTag = async (tname) => {
    let tag = await Tag.findOne({ name: tname });
    if (tag) return tag._id;
    let newTag = new Tag({ name: tname });
    let saveTag = await newTag.save();
    return saveTag._id;

};

const getQuestionsByOrder = async (order) => {
    let questions =[]
    if (order === "active") {
        //get active questions, newest questions sorted by most recently answered 1 ask_date_time
        let list = await Question.find({}).populate('answers').populate('tags')
        list.sort((a, b) => { return b.ask_date_time - a.ask_date_time; })
        list.sort((a, b) => { return Math.max(...b.answers.map((ans) => ans.ans_date_time)) - Math.max(...a.answers.map((ans) => ans.ans_date_time)); })
        questions = list;

    } 
    else if (order == "unanswered") {
        questions = await Question.find({}).populate('tags');
        questions.sort((a, b) => { return b.ask_date_time - a.ask_date_time; })
        questions = questions.filter((question) => question.answers.length === 0);
    } 
    else {
        questions = await Question.find({}).populate('tags')
        questions.sort((a, b) => { return b.ask_date_time - a.ask_date_time; })
    }
    return  questions;
}

const filterQuestionsBySearch = (qlist, search) => {
    search = search.toLowerCase();
    let searchTags = (search.match(/\[([^\]]+)\]/g) || []).map((word) => word.slice(1, -1));
    let searchKeyword = search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
    return qlist.filter((q) => {
        if (searchKeyword.length === 0 && searchTags.length === 0) 
            return true;
        
        else if(searchKeyword.length === 0) 
            return searchTags.some((tag) => { return q.tags.some((t) => t.name === tag); });
        
        else if(searchTags.length === 0) 
            return searchKeyword.every((word) => { return q.title.toLowerCase().includes(word) || q.text.toLowerCase().includes(word); });
        
        else 
            return searchTags.some((tag) => { return q.tags.some((t) => t.name === tag);}) || searchKeyword.every((word) => {return q.title.toLowerCase().includes(word) || q.text.toLowerCase().includes(word);});
        
    });
}

module.exports = {addTag, getQuestionsByOrder, filterQuestionsBySearch};
