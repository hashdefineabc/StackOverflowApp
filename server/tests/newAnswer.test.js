// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");

const request = require('supertest');
const app = require('../server');

// Mock the Answer model
jest.mock("../models/answers");

let server;
describe("POST /addAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {text: "This is a test answer"}
    };

    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer"
    };

    // First, get the CSRF token
    const csrfResponse = await request(app).get('/csrf-token');
    const token = csrfResponse.body.csrfToken;

    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });


    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .set('Cookie', csrfResponse.headers['set-cookie']) // You might need to handle cookies if sessions are involved
      .set('X-CSRF-Token', token)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith({
      text: "This is a test answer"
    });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });

  describe("POST /addAnswer - Error handling", () => {
    beforeEach(() => {
      server = require("../server");
    });
  
    afterEach(async () => {
      server.close();
      await mongoose.disconnect();
    });
  
    it("should return a 500 error if an error occurs during answer creation", async () => {
      // Mock Answer.create to throw an error
      Answer.create.mockImplementationOnce(() => {
        throw new Error("Simulated Database Error");
      });
  
      // Simulate request body
      const mockReqBody = {
        qid: "someQuestionId",
        ans: { text: "Sample answer" },
      };
  
      // CSRF setup (as used in your other test)
      const csrfResponse = await request(app).get("/csrf-token");
      const token = csrfResponse.body.csrfToken;
  
      // Make the request
      const response = await supertest(server)
        .post("/answer/addAnswer")
        .set("Cookie", csrfResponse.headers["set-cookie"]) 
        .set("X-CSRF-Token", token)
        .send(mockReqBody);
  
      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });
  
});


