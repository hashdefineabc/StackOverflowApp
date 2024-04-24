const express = require("express");
const request = require("supertest");
const mockingoose = require('mockingoose');
const User = require("../models/users");
const controller = require("../controller/userProfile"); // Replace with the correct path

const app = express();
app.use(express.json()); // Assuming you use middleware to parse JSON bodies

// Simulate Basic CSRF protection (replace this as needed)
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/csrf-token') {
    return res.json({ csrfToken: 'your_generated_csrf_token' }); 
  }
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    if (req.header('X-CSRF-Token') !== 'your_generated_csrf_token') {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next(); 
});

app.use(controller);  

describe("User Profile Update Controller (with CSRF protection)", () => {
  let csrfToken = null; 

  beforeEach(() => {
    mockingoose.resetAll();

    return request(app)
      .get('/csrf-token') 
      .then(response => {
        csrfToken = response.body.csrfToken;
      });
  });

  // Successful Update Test (Modified)
  it('should update the user profile and return an empty success indicator', async () => {
    const mockUserId = '12345'; 
    const updatedUserData = { username: "updated_username" };

    const existingMockUser = {
      _id: mockUserId,
      username: "original_username",
      // ... other properties
    };

    // Mock an empty response (Adjust status code if needed)
    mockingoose(User).toReturn(existingMockUser, 'findOne') 
                      .toReturn(new Promise(resolve => resolve()), 'findByIdAndUpdate'); 

    const response = await request(app)
      .put(`/${mockUserId}/updateUserProfile`)
      .send(updatedUserData)
      .set('X-CSRF-Token', csrfToken); 

    expect(response.status).toBe(200); 
    expect(response.body).toEqual("");
  });

  // Additional Test Case: User Not Found
  it('should return a 404 error if the user is not found', async () => {
    const mockUserId = '';
    const updatedUserData = { username: "updated_username" };

    mockingoose(User).toReturn(null, 'findOne'); // User not found

    const response = await request(app)
      .put(`/${mockUserId}/updateUserProfile`)
      .send(updatedUserData)
      .set('X-CSRF-Token', csrfToken); 

    expect(response.status).toBe(404);
  });

  // Add more test cases as needed, ensuring to include the CSRF token
}); 
