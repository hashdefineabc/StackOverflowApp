import React from 'react';
// import { mount } from '@cypress/react';
import NewQuestion from '../../src/components/main/newQuestion/index';

describe('<NewQuestion />', () => {
  it('renders', () => {
    cy.mount(<NewQuestion />);
  });


it('validates input fields correctly', () => {
  cy.mount(<NewQuestion />);
  cy.get('button.form_postBtn').click();
  cy.get('#formTitleInput').type('Valid Title');
  cy.get('#formTextInput').type('http://example.com');
  cy.get('#formTagInput').type('tag1 tag2');
  cy.get('button.form_postBtn').click();
  cy.get('#formTitleInput').should('not.have.class', 'error');
  cy.get('#formTextInput').should('not.have.class', 'error');
  cy.get('#formTagInput').should('not.have.class', 'error');
});

it('posts new question correctly', () => {
  cy.intercept('POST', '**/questions', { statusCode: 201, body: { _id: '123', title: 'Test' } }).as('postQuestion');
  cy.mount(<NewQuestion />);
  cy.get('#formTitleInput').type('New Question');
  cy.get('#formTextInput').type('This is a new question.');
  cy.get('#formTagInput').type('new tag');
});

});