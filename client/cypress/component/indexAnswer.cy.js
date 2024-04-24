import React from 'react';
import Answer from '../../src/components/main/answerPage/answer/index';

describe('<Answer />', () => {
  it('renders the component with props', () => {
    const props = {
      text: 'This is a sample answer.',
      ansBy: 'John Doe',
      meta: 'Posted on 2023-04-21'
    };

    // Mount the component with the given props
    cy.mount(<Answer {...props} />);

    // Check if the component is rendering the text properly
    cy.get('#answerText').should('contain', props.text);

    // Check if the component is rendering the author properly
    cy.get('.answer_author').should('contain', props.ansBy);

    // Check if the component is rendering the metadata properly
    cy.get('.answer_question_meta').should('contain', props.meta);
  });
});
