const supertest = require("supertest");

const Tag = require('../models/tags');
const Question = require('../models/questions');
const { default: mongoose } = require("mongoose");

// Mock data for tags
const mockTags = [
    { name: 'tag1' },
    { name: 'tag2' },
    { name: 'tag3' }, // tag3 is not used in any question
];
 
const mockQuestions = [
    { tags: [mockTags[0], mockTags[1]] },
    { tags: [mockTags[0]] },
]

let server;
describe('GET /getTagsWithQuestionNumber', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        server.close();
        await mongoose.disconnect();
    });

    it('should return tags with question numbers including tags with zero questions', async () => {
        // Mocking Tag.find() and Question.find()
        Tag.find = jest.fn().mockResolvedValueOnce(mockTags);
        Question.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockQuestions)}));

        // Making the request
        const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { name: 'tag1', qcnt: 2 },
            { name: 'tag2', qcnt: 1 },
            { name: 'tag3', qcnt: 0 },
        ]);
        expect(Tag.find).toHaveBeenCalled();
        expect(Question.find).toHaveBeenCalled();
    });

    it('should handle cases with no questions present', async () => {
        Tag.find = jest.fn().mockResolvedValueOnce(mockTags);
        Question.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce([])}));

        // Making the request
        const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { name: 'tag1', qcnt: 0 },
            { name: 'tag2', qcnt: 0 },
            { name: 'tag3', qcnt: 0 },
        ]);
        expect(Tag.find).toHaveBeenCalled();
        expect(Question.find).toHaveBeenCalled();
    });


it('should handle errors and return a 500 status', async () => {
    // Force an error in Tag.find
    Tag.find = jest.fn().mockRejectedValueOnce(new Error('Database error'));

    // Make the request
    const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

    // Assert the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
});
});
