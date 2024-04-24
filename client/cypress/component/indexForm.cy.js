import React from 'react';
// import { mount } from '@cypress/react';
import Form from '../../src/components/main/baseComponents/form/index';

describe('<Form />', () => {
  it('renders without crashing', () => {
    cy.mount(<Form />);
  });

  it('renders children correctly', () => {
    // Mount the Form with some test children.
    cy.mount(
      <Form>
        <p>Test child element</p>
      </Form>
    );

    // Check if the child element is rendered.
    cy.get('.form').should('exist');
    cy.get('.form').contains('Test child element').should('exist');
  });
});
