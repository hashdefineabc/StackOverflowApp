import React from 'react';
import AnswerHeader from '../../src/components/main/answerPage/header/index';

describe('<AnswerHeader />', () => {
  it('renders correctly with required props', () => {
    const props = {
      ansCount: 5,
      title: 'What is the best way to learn React?',
      handleNewQuestion: cy.stub().as('newQuestionStub'),
      handleEditQuestion: cy.stub().as('editQuestionStub'),
      qid: '123',
      allowEdit: true
    };

    cy.mount(<AnswerHeader {...props} />);

    // Verify the number of answers and title are displayed correctly
    cy.get('.answer_count').should('contain', `${props.ansCount} answers`);
    cy.get('.answer_question_title').should('contain', props.title);

    // Verify the presence of the Edit button and its functionality
    cy.get('.editbtn').should('exist').and('contain', 'Edit Question').click();
    cy.get('@editQuestionStub').should('have.been.calledOnceWith', props.qid);

    // Verify the Ask a Question button and its functionality
    cy.get('.bluebtn').should('exist').and('contain', 'Ask a Question').click();
    cy.get('@newQuestionStub').should('have.been.calledOnce');
  });

  it('does not show the edit button when editing is not allowed', () => {
    const propsWithoutEdit = {
      ansCount: 3,
      title: 'What are the new features in ES2021?',
      handleNewQuestion: cy.stub(),
      handleEditQuestion: cy.stub(),
      qid: '456',
      allowEdit: false
    };

    cy.mount(<AnswerHeader {...propsWithoutEdit} />);

    // Verify that the Edit button is not present
    cy.get('.editbtn').should('not.exist');
  });

  // Additional tests can be added to check for different conditions or exceptional cases
});
