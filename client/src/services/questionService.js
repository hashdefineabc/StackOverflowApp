import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );

    return res.data;
};

// To get Questions by id
const getQuestionById = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);

    return res.data;
};

// To add Questions
const addQuestion = async (q) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

    return res.data;
};

// To update Questions
const updateQuestion = async (qid, q) => {
    const res = await api.put(`${QUESTION_API_URL}/${qid}/updateQuestion`, q);

    return res.data;
};

// To upvote a question
const upvoteQuestion = async (questionId, user) => {
    try {
        const response = await api.post(`${QUESTION_API_URL}/${questionId}/upvote`, {
            user: user
        });
        return response.data;
    } catch (error) {
        throw new Error("Error upvoting question:", error);
    }
};

// To downvote a question
const downvoteQuestion = async (questionId, user) => {
    try {
        const response = await api.post(`${QUESTION_API_URL}/${questionId}/downvote`, {
            user: user
        });
        return response.data;
    } catch (error) {
        throw new Error("Error downvoting question:", error);
    }
};

export { getQuestionsByFilter, getQuestionById, addQuestion, upvoteQuestion, downvoteQuestion, updateQuestion };
