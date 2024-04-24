import React from 'react';
// import { mount } from '@cypress/react'; // Ensure you are importing correctly based on your setup
import UserProfilePage from '../../src/components/main/userProfilePage/index';
import { UserContext } from '../../src/UserContext'; // adjust path as necessary

describe('<UserProfilePage />', () => {
  const user = {
    _id: '123',
    username: 'johndoe',
    email: 'john@example.com',
    title: 'Developer',
    aboutme: 'I love coding',
    location: 'Earth',
    githubLink: 'https://github.com/johndoe',
    linkedInLink: 'https://linkedin.com/in/johndoe'
  };

  it('renders with provided user data from context', () => {
    // Mount component with UserContext
    cy.mount(
      <UserContext.Provider value={{ user, setUser: cy.stub() }}>
        <UserProfilePage />
      </UserContext.Provider>
    );

    // Check if the user data is rendered
    cy.contains('Username: johndoe');
    cy.contains('Email: john@example.com');
  });

  it('should display correct labels and buttons', () => {
    // Mount component again with the same context
    cy.mount(
      <UserContext.Provider value={{ user, setUser: cy.stub() }}>
        <UserProfilePage />
      </UserContext.Provider>
    );

    // Check for labels and button
    cy.get('.label').contains('Username:');
    cy.get('.label').contains('Email:');
    cy.get('.label').contains('Title:');
    cy.get('.edit-profile-btn').should('exist');
  });
});
