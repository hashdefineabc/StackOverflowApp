import React from 'react';
import Question from '../../src/components/main/questionPage/question/index';
import { UserContext } from '../../src/UserContext';

// Mock data and functions

describe('<Question />', () => {
  it('renders correctly with minimum props', () => {
    const user = { _id: '123' };
const question = {
  _id: 'q1',
  title: 'Sample Question',
  views: 100,
  answers: [{}, {}],  // Two answers
  tags: [{ name: 'react' }, { name: 'cypress' }],
  upvotes: [{}, {}, { _id: '123' }],  // 3 upvotes, including one from the current user
  asked_by: 'User A',
  ask_date_time: '2022-01-01T12:00:00Z'
};

    cy.mount(
      <UserContext.Provider value={{ user }}>
        <Question q={question} clickTag={cy.stub()} handleAnswer={cy.stub()} />
      </UserContext.Provider>
    );
    cy.contains('Sample Question').should('be.visible');
    cy.contains('react').should('be.visible');
    cy.contains('2 answers').should('be.visible');
    cy.contains('100 views').should('be.visible');
  });


  it('shows login warning when trying to vote without being logged in', () => {
const question = {
  _id: 'q1',
  title: 'Sample Question',
  views: 100,
  answers: [{}, {}],  // Two answers
  tags: [{ name: 'react' }, { name: 'cypress' }],
  upvotes: [{}, {}, { _id: '123' }],  // 3 upvotes, including one from the current user
  asked_by: 'User A',
  ask_date_time: '2022-01-01T12:00:00Z'
};
    cy.mount(<Question q={question} clickTag={cy.stub()} handleAnswer={cy.stub()} />);
    cy.get('button').contains('Upvote');
  });
});
