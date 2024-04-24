// import React from 'react'
// import AnswerPage from './index'

// describe('<AnswerPage />', () => {
//   it('renders', () => {
//     // see: https://on.cypress.io/mounting-react
//     cy.mount(<AnswerPage />)
//   })
// })

import React from 'react';
import { UserContext } from '../../src/UserContext'; // Adjust the path as needed
import AnswerPage from '../../src/components/main/answerPage/index';
// import { mount } from '@cypress/react';

describe('<AnswerPage />', () => {
  it('renders without crashing', () => {
    // Provide minimal necessary context and props
    cy.mount(
      <UserContext.Provider value={{ user: { username: 'testUser' } }}>
        <AnswerPage qid="1" />
      </UserContext.Provider>
    );
    // Basic check to see if component mounts
    cy.get('.ansButton').should('exist');
  });

  it('reders the answer button with text', () => {
    // Mount the component with the context
    cy.mount(
      <UserContext.Provider value={{ user: { username: 'testUser' } }}>
        <AnswerPage qid="1" />
      </UserContext.Provider>
    );

    cy.get('.bluebtn.ansButton').should('be.visible').and('contain', 'Answer Question');
  });
});
