// import React from 'react'
// import PasswordInput from './index'

// describe('<PasswordInput />', () => {
//   it('renders', () => {
//     // see: https://on.cypress.io/mounting-react
//     cy.mount(<PasswordInput />)
//   })
// })

import React from 'react';
// import { mount } from '@cypress/react'; // Make sure to import mount from @cypress/react
import PasswordInput from '../../src/components/main/baseComponents/passwordInput/index'; // Adjust the import path if necessary

describe('<PasswordInput />', () => {
  it('renders correctly with mandatory field', () => {
    const setState = cy.stub().as('setStateStub');
    cy.mount(
      <PasswordInput
        title="Password"
        hint="Enter your password"
        id="password"
        val=""
        setState={setState}
        mandatory={true}
      />
    );
    cy.get('.input_title').should('contain', 'Password*');
    cy.get('input[type="password"]').should('have.attr', 'placeholder', 'Enter your password');
  });

  it('does not show asterisk when not mandatory', () => {
    const setState = cy.stub();
    cy.mount(
      <PasswordInput
        title="Password"
        hint="Enter your password"
        id="password"
        val=""
        setState={setState}
        mandatory={false}
      />
    );
    cy.get('.input_title').should('contain', 'Password').and('not.contain', '*');
  });

  it('displays error message when there is an error', () => {
    cy.mount(
      <PasswordInput
        title="Password"
        hint="Enter your password"
        id="password"
        val=""
        setState={() => {}}
        err="Invalid password"
      />
    );
    cy.get('.input_error').should('contain', 'Invalid password');
  });
});
