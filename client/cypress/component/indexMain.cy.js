import React from 'react';
import Main from '../../src/components/main/index';
import { mount } from 'cypress/react';

describe('<Main />', () => {
  it('renders without crashing', () => {
    mount(<Main />);
    cy.get('.main').should('exist');
  });
});