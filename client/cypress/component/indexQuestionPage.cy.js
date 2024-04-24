
import React from 'react';
// import { mount } from '@cypress/react';
import QuestionPage from '../../src/components/main/questionPage/index';
import * as questionService from '../../src/services/questionService';

describe('<QuestionPage />', () => {
  beforeEach(() => {
    cy.stub(questionService, 'getQuestionsByFilter').as('mockedGetQuestions');
  });

  it('renders the component with default title', () => {
    cy.get('@mockedGetQuestions');
   cy.mount(<QuestionPage />);
    cy.contains('All Questions').should('be.visible');
  });

  it('shows a message when no questions are found for a search', () => {
    cy.get('@mockedGetQuestions');
    cy.mount(<QuestionPage title_text="Search Results" />);
    cy.contains('No Questions Found').should('be.visible');
  });
});
