import React from 'react';
// import { mount } from '@cypress/react'; // Make sure to import mount from '@cypress/react'
import QuestionHeader from '../../src/components/main/questionPage/header/index';

describe('<QuestionHeader />', () => {


  it('renders correctly with all props', () => {
    // Mount the component with the props
    const props = {
      title_text: 'Sample Title',
      qcnt: 5,
      setQuestionOrder: cy.stub(), // Cypress stub for the setQuestionOrder function
      handleNewQuestion: cy.stub(), // Cypress stub for the handleNewQuestion function
    };
    cy.mount(<QuestionHeader {...props} />);

    // Check that the title_text is rendered correctly
    cy.get('.bold_title').should('contain', props.title_text);

    // Check that the question count is displayed correctly
    cy.get('#question_count').should('contain', `${props.qcnt} questions`);

    // Check that the 'Ask a Question' button is present and clickable
    cy.get('button').contains('Ask a Question').click();
  });

  it('handles no questions gracefully', () => {
    const props = {
      title_text: 'Sample Title',
      qcnt: 5,
      setQuestionOrder: cy.stub(), // Cypress stub for the setQuestionOrder function
      handleNewQuestion: cy.stub(), // Cypress stub for the handleNewQuestion function
    };
    // Provide props with zero questions
    const zeroQuestionProps = {...props, qcnt: 0};
    cy.mount(<QuestionHeader {...zeroQuestionProps} />);

    // Verify that the question count text updates correctly
    cy.get('#question_count').should('contain', '0 questions');
  });
});
