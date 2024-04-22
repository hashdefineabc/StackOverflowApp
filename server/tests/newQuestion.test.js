// unit tests for functions in controller/question.js


const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Question = require('../models/questions');
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

const request = require('supertest');
const app = require('../server');


// Mocking the models
jest.mock("../models/questions");
jest.mock('../utils/question', () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

let server;

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1'
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2'
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: 'answer1_user',
  
}

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: 'answer2_user',
  
}

const mockQuestions = [
  {
      _id: '65e9b58910afe6e94fc6e6dc',
      title: 'Question 1 Title',
      text: 'Question 1 Text',
      tags: [tag1],
      answers: [ans1],
      views: 21,
      upvotes: []
  },
  {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Question 2 Title',
      text: 'Question 2 Text',
      tags: [tag2],
      answers: [ans2],
      views: 99,
      upvotes: []
  }
]

describe('GET /getQuestion', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it('should return questions by filter', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'someOrder',
      search: 'someSearch',
    };
   
    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    // Making the request
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });
  it('should handle no questions found with given filter', async () => {
    getQuestionsByOrder.mockResolvedValueOnce([]);
    filterQuestionsBySearch.mockReturnValueOnce([]);
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query({ order: 'someOrder', search: 'someSearch' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  
  it('should handle internal server error', async () => {
    getQuestionsByOrder.mockRejectedValueOnce(new Error('Internal server error'));
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query({ order: 'someOrder', search: 'someSearch' });
    expect(response.status).toBe(500);
  });
  
});


describe('POST /addQuestion', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it('should add a new question', async () => {
    // Mock request body
   
    const mockTags = [tag1, tag2]; 


    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    // First, get the CSRF token
    const csrfResponse = await request(app).get('/csrf-token');
    const token = csrfResponse.body.csrfToken;

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .set('Cookie', csrfResponse.headers['set-cookie']) // You might need to handle cookies if sessions are involved
      .set('X-CSRF-Token', token)
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
    });

    it('should handle internal server error when adding a question', async () => {
      Question.create.mockRejectedValueOnce(new Error('Internal server error'));
      // First, get the CSRF token
      const csrfResponse = await request(app).get('/csrf-token');
      const token = csrfResponse.body.csrfToken;
      const response = await supertest(server)
        .post('/question/addQuestion')
        .set('Cookie', csrfResponse.headers['set-cookie']) // You might need to handle cookies if sessions are involved
        .set('X-CSRF-Token', token)
        .send({ title: 'Error Case', text: 'Simulate Error', tags: [tag1, tag2] });
      expect(response.status).toBe(500);
    });
    
    it('should handle error during tag creation', async () => {
      addTag.mockRejectedValueOnce(new Error('Tag creation failed'));
      // First, get the CSRF token
      const csrfResponse = await request(app).get('/csrf-token');
      const token = csrfResponse.body.csrfToken;
      const response = await supertest(server)
        .post('/question/addQuestion')
        .set('Cookie', csrfResponse.headers['set-cookie']) // You might need to handle cookies if sessions are involved
        .set('X-CSRF-Token', token)
        .send({ title: 'Error Case', text: 'Simulate Error', tags: [tag1, tag2] });
      expect(response.status).toBe(500);
    });
    
  });

  describe('GET /getQuestionById/:qid', () => {
    let server;

    beforeEach(() => {
        server = require("../server");
    })

    afterEach(async () => {
        server.close();
        await mongoose.disconnect();
    });

    it('should return a question by id and increment its views by 1', async () => {
        // Mock request parameters
        const mockReqParams = {
            qid: '65e9b5a995b6c7045a30d823',
        };

        // Mocking existing question data (prior to incrementing views)
        const existingQuestion = {
            _id: mockReqParams.qid,
            answers: ["Answer1", "Answer2"], // Assuming answers are just IDs or short strings for simplicity
            upvotes: 10,
            views: 5
        };

        // Expected question data after view increment
        const updatedQuestion = {
            ...existingQuestion,
            views: existingQuestion.views + 1
        };

        // Mock findOneAndUpdate to simulate Mongoose behavior
        Question.findOneAndUpdate = jest.fn().mockImplementation((query, update, options) => ({
            populate: jest.fn().mockImplementationOnce(populatePath => ({
                populate: jest.fn().mockResolvedValueOnce(updatedQuestion)
            }))
        }));

        // Making the request
        const response = await supertest(server)
            .get(`/question/getQuestionById/${mockReqParams.qid}`);

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedQuestion);
    });

    it("should return a 500 status and internal error message if a database error occurs", async () => {
      Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(null); // Simulate question not existing
  
      const response = await supertest(server).get("/question/getQuestionById/nonExistingId");
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });


});


describe('POST /:questionId/upvote', () => {
  const mockUserId = new mongoose.Types.ObjectId(); // Represents the user upvoting
  const mockQuestionId = '65e9b58910afe6e94fc6e6dc';

  it('should upvote a question successfully', async () => { 
      const mockQuestion = {
          // ... 
          upvotes: [], // User initially hasn't upvoted
          save: jest.fn().mockResolvedValue(this)
      };

      // First, get the CSRF token
      const csrfResponse = await request(app).get('/csrf-token');
      const token = csrfResponse.body.csrfToken;

      Question.findById = jest.fn().mockResolvedValue(mockQuestion); 

      const response = await supertest(server)
          .post(`/question/${mockQuestionId}/upvote`)
          .set('Cookie', csrfResponse.headers['set-cookie']) // You might need to handle cookies if sessions are involved
          .set('X-CSRF-Token', token)
          .send({ user: mockUserId });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Upvoted successfully');
      expect(mockQuestion.upvotes).toContainEqual(mockUserId.toString()); // Check for presence
  });

   
});

describe('POST /:questionId/downvote', () => {
  const mockQuestionId = '65e9b58910afe6e94fc6e6dc';

  // Create mock user data
  const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      username: 'testuser',
      email: 'test@example.com',
      password: 'somehashedpassword' // Placeholder - address password handling
  };

  it('should downvote a question successfully', async () => {
      const mockQuestion = {
          // ... other properties
          upvotes: [mockUser._id], // User has upvoted initially
          save: jest.fn().mockResolvedValue(this) 
      };

      // Enhanced mock for question.save
        mockQuestion.save = jest.fn().mockImplementation(() => {
          // Remove the user's ID from the upvotes array directly
          mockQuestion.upvotes = mockQuestion.upvotes.filter(
              u => u._id.toString() !== mockUser._id.toString()
          );

          // Return the modified mockQuestion
          return Promise.resolve(mockQuestion); 
      });

      // Mock necessary dependencies
      jest.mock('../models/users'); // Assuming your User model is there
      const User = require('../models/users');
      User.create.mockResolvedValue(mockUser); // Or mock other User methods if needed

      Question.findById = jest.fn().mockResolvedValue(mockQuestion); 

      // Simulate getting the CSRF token
      const csrfResponse = await request(app).get('/csrf-token');
      const token = csrfResponse.body.csrfToken;

      // Make the downvote request
      const response = await supertest(server)
          .post(`/question/${mockQuestionId}/downvote`)
          .set('Cookie', csrfResponse.headers['set-cookie']) 
          .set('X-CSRF-Token', token)
          .send({ user: mockUser }); // Use the mock user's ID

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Downvoted successfully'); 
      expect(mockQuestion.upvotes).not.toContainEqual(mockUser._id); 
  });

  // ... Add other downvote test cases 
});
