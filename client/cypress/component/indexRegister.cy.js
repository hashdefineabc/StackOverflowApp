import React from 'react';
import Register from '../../src/components/header/auth/SignUp/index';
import { UserContext } from '../../src/UserContext'; // Adjust path as necessary
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Register />', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/csrf-token', { csrfToken: 'fake-csrf-token' }).as('fetchCsrfToken');
    cy.intercept('GET', 'http://localhost:8000/check-login', { loggedIn: false }).as('checkLoginStatus');
    cy.intercept('POST', 'http://localhost:8000/auth/register', { success: true, user: { username: 'testUser' } }).as('registerUser');
  });

  

  it('displays validation errors for empty inputs', () => {
    cy.mount(
      <Router>
        <UserContext.Provider value={{ user: null, setUser: () => {} }}>
          <Register />
        </UserContext.Provider>
      </Router>
    );
    cy.get('button').contains('Register').click();
    cy.contains('Email cannot be empty').should('be.visible');
    cy.contains('Password cannot be empty').should('be.visible');
    cy.contains('Username cannot be empty').should('be.visible');
  });

  it('renders the registration form when no user is logged in', () => {
    cy.mount(
      <Router>
        <UserContext.Provider value={{ user: null, setUser: () => {} }}>
          <Register />
        </UserContext.Provider>
      </Router>
    );
    cy.get('input').should('have.length', 3);
    cy.get('button').contains('Register').should('exist');
  });

  it('submits the form and registers successfully', () => {
    const mockSetUser = cy.spy().as('setUserSpy');
    cy.mount(
      <Router>
        <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
          <Register />
        </UserContext.Provider>
      </Router>
    );
    cy.get('#formUsernameInput').type('testUser');
    cy.get('#formEmailInput').type('test@example.com');
    cy.get('#formPasswordInput').type('testPassword');
    cy.get('button').contains('Register').click();
    cy.wait('@registerUser');
    cy.get('@setUserSpy').should('have.been.calledWith', { username: 'testUser' });
  });

  it('logs out the user when logged in', () => {
    const mockSetUser = cy.spy().as('setUserSpy');
    cy.mount(
      <Router>
        <UserContext.Provider value={{ user: { username: 'testUser' }, setUser: mockSetUser }}>
          <Register />
        </UserContext.Provider>
      </Router>
    );
    cy.get('button').contains('Logout').click();
  });
});
