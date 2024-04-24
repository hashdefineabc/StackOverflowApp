// import React from 'react'
// import QuestionBody from './index'

// describe('<QuestionBody />', () => {
//   it('renders', () => {
//     // see: https://on.cypress.io/mounting-react
//     cy.mount(<QuestionBody />)
//   })
// })


import React from 'react';
import QuestionBody from '../../src/components/main/answerPage/questionBody/index';
// import { mount } from '@cypress/react';

describe('<QuestionBody />', () => {
  it('renders correctly with all props', () => {
    const props = {
      views: 150,
      text: 'How do I use Cypress to test a React component?',
      askby: 'Jane Doe',
      meta: 'April 20, 2024'
    };

    // Mount the component with the given props
    cy.mount(<QuestionBody {...props} />);

    // Check if the views count is displayed correctly
    cy.get('.answer_question_view').should('contain', `${props.views} views`);

    // Check if the text is processed by handleHyperlink and displayed
    // Assume handleHyperlink transforms URLs into clickable links
    // You might want to adjust this test depending on what handleHyperlink actually does
    cy.get('.answer_question_text').as('processedText');
    cy.get('@processedText').should('contain', props.text);
    // If you expect URLs in text to be hyperlinked, you would test for <a> tags here:
    // cy.get('@processedText').find('a').should('have.attr', 'href').and('include', 'http');

    // Check if the author is displayed correctly
    cy.get('.question_author').should('contain', props.askby);

    // Check if the metadata is displayed correctly
    cy.get('.answer_question_meta').should('contain', `asked ${props.meta}`);
  });

  // You can add more tests to check for different scenarios or props variations
  // Example: What happens if views are 0? Or if text is empty?
});
