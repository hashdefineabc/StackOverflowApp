import React from 'react';
import NewAnswer from '../../src/components/main/newAnswer/index';
import { UserContext } from '../../src/UserContext';

describe('<NewAnswer />', () => {
  it('renders correctly with mandatory fields and a post button', () => {
    const user = { username: 'testUser' };
    cy.mount(
      <UserContext.Provider value={{ user }}>
        <NewAnswer qid="1234" handleAnswer={cy.stub()} />
      </UserContext.Provider>
    );
    cy.get('textarea').should('exist');
    cy.get('button').should('contain', 'Post Answer');
    cy.get('.mandatory_indicator').should('contain', '* indicates mandatory fields');
  });

  it('displays error when posting an empty answer', () => {
    const user = { username: 'testUser' };
    cy.mount(
      <UserContext.Provider value={{ user }}>
        <NewAnswer qid="1234" handleAnswer={cy.stub()} />
      </UserContext.Provider>
    );
    cy.get('button').click();
    cy.get('textarea').invoke('val').should('be.empty');
    cy.contains('Answer text cannot be empty');
  });

});
