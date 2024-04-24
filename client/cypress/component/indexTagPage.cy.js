import React from 'react';
// import { mount } from '@cypress/react';
import TagPage from '../../src/components/main/tagPage/index';
import * as TagService from '../../src/services/tagService';

describe('<TagPage />', () => {
  beforeEach(() => {
    // Mock the service call and resolve it with an empty array
    cy.stub(TagService, 'getTagsWithQuestionNumber').resolves([]);
    // Mount the component with stubbed functions for interactions
    cy.mount(<TagPage clickTag={cy.stub()} handleNewQuestion={cy.stub()} />);
  });

  it('renders correctly', () => {
    // Ensure the component renders by checking for static elements
    cy.contains('0 Tags'); // Since we're resolving to an empty array
    cy.contains('All Tags').should('be.visible');
    cy.get('button').contains('Ask a Question').should('be.visible');
  });

  it('calls handleNewQuestion when "Ask a Question" button is clicked', () => {
    const handleNewQuestion = cy.stub();
    cy.mount(<TagPage clickTag={cy.stub()} handleNewQuestion={handleNewQuestion} />);

    // Simulate clicking the "Ask a Question" button
    cy.get('button').contains('Ask a Question').click();
    cy.wrap(handleNewQuestion).should('have.been.calledOnce');
  });
});
