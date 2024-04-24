import React from 'react'
import Login from '../../src/components/header/auth/Login/index'
import { UserContext } from '../../src/UserContext'
import { BrowserRouter as Router } from 'react-router-dom'

describe('<Login />', () => {
  // Initial setup for each test
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/csrf-token', {
      statusCode: 200,
      body: { csrfToken: 'fake-csrf-token' },
    }).as('fetchCsrfToken');

    cy.intercept('GET', 'http://localhost:8000/check-login', {
      statusCode: 200,
      body: { loggedIn: false },
    }).as('checkLoginStatus');

    cy.intercept('POST', 'http://localhost:8000/auth/login', (req) => {
      if (req.body.email === 'test@example.com' && req.body.password === 'password') {
        return {
          statusCode: 200,
          body: { success: true, user: { name: 'Test User' } },
        };
      } else {
        return {
          statusCode: 401,
          body: { success: false },
        };
      }
    }).as('loginRequest');
  });

  it('renders the login form', () => {
    const setUser = cy.stub().as('setUserStub');
    cy.mount(
      <UserContext.Provider value={{ user: null, setUser }}>
        <Router>
          <Login />
        </Router>
      </UserContext.Provider>
    );

    cy.get('.modal').should('be.visible');
    cy.get('input#formEmailInput').should('be.visible');
    cy.get('input#formPasswordInput').should('be.visible');
    cy.get('.form_postBtn').should('contain', 'Login').and('be.visible');
  });

  it('displays error messages for empty inputs', () => {
    cy.mount(<Login />);

    cy.get('.form_postBtn').click();
    cy.get('.input_error').should('contain', 'Email cannot be empty');
    cy.get('.input_error').should('contain', 'Password cannot be empty');
  });
});
