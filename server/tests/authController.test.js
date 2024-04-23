const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Mocks
jest.mock('../models/Users', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

const User = require('../models/Users');
const router = require('../controller/authController');

const app = express();
app.use(express.json());
app.use(session({
  secret: 'test_secret',
  resave: false,
  saveUninitialized: true
}));
app.use(router);

// Properly mock bcrypt methods
jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Assuming password comparison should succeed

beforeEach(() => {
  jest.clearAllMocks();
});

describe('User Authentication Routes', () => {
  // ... other tests remain unchanged ...

  describe('POST /login', () => {
    // ... other tests remain unchanged ...

    it('should authenticate and log in the user', async () => {
      const user = { email: 'test@example.com', password: 'hashed_password', _id: '1' };
      User.findOne.mockResolvedValue(user);

      const response = await request(app).post('/login').send({ email: 'test@example.com', password: '123456' });
      expect(response.body).toEqual({ success: true, user });
    });
  });

  
  
});

describe('POST /register', () => {
    it('should return an error if any field is missing', async () => {
      const response = await request(app).post('/register').send({ email: 'test@example.com', password: '123456' });
      expect(response.body).toEqual({ message: "All fields are required" });
      expect(response.statusCode).toBe(200);
    });
  
    it('should check for existing email and prevent duplication', async () => {
      User.findOne.mockResolvedValueOnce({ email: 'test@example.com' }); // Simulate found email
      const response = await request(app).post('/register').send({ email: 'test@example.com', password: '123456', username: 'testuser' });
      expect(response.body).toEqual({ message: "Email already exists" });
    });
  
    it('should check for existing username and prevent duplication', async () => {
      User.findOne
        .mockResolvedValueOnce(null) // No email found
        .mockResolvedValueOnce({ username: 'testuser' }); // Username found
      const response = await request(app).post('/register').send({ email: 'test@example.com', password: '123456', username: 'testuser' });
      expect(response.body).toEqual({ message: "Username already exists" });
    });
  
    it('should create a new user if email and username are not taken', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ email: 'new@example.com', username: 'newuser', password: 'hashed_password' });
      const response = await request(app).post('/register').send({ email: 'new@example.com', password: '123456', username: 'newuser' });
      expect(response.body).toEqual({ success: true, message: "Signup successful", user: { email: 'new@example.com', username: 'newuser', password: 'hashed_password' }});
    });
  });
  

  describe('POST /login', () => {
    it('should return an error if password is incorrect', async () => {
      const user = { email: 'test@example.com', password: 'hashed_password' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false); // Force bcrypt comparison to fail
      const response = await request(app).post('/login').send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(response.body).toEqual({ message: "Incorrect password or email" });
    });
  });
  
  describe('User Session', () => {
    // Assume a user can successfully log in and create a session
    it('should allow a user to log in and then log out', async () => {
      // Simulate user login
      User.findOne.mockResolvedValue({ 
        email: 'user@example.com', 
        password: bcrypt.hashSync('correct_password', 10),
        _id: '123' 
      });
  
      // Login request
      let response = await request(app)
        .post('/login')
        .send({ email: 'user@example.com', password: 'correct_password' });
      
      expect(response.body).toBeTruthy();
      expect(response.headers['set-cookie']).toBeDefined();
  
      // Extract the session cookie to use in subsequent requests
      const cookie = response.headers['set-cookie'][0];
  
      // Simulate user logout
      response = await request(app)
        .post('/logout')
        .set('Cookie', cookie);  // Use the cookie from login to maintain the session
  
      // Check if the user is logged out successfully
      expect(response.body).toEqual({ success: true });
      expect(response.statusCode).toBe(200);
    });
  });
  