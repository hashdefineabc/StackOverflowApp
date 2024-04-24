import React from 'react'
import Input from '../../src/components/main/baseComponents/input/index'

describe('<Input />', () => {
  // Basic render test
  it('renders', () => {
    cy.mount(<Input title="Username" hint="Enter your username" id="username" />)
    cy.get('div.input_title').contains('Username')
    cy.get('input').should('have.attr', 'placeholder', 'Enter your username')
  })

  // Test for mandatory asterisk display
  it('displays asterisk when mandatory is true', () => {
    cy.mount(<Input title="Username" mandatory={true} />)
    cy.get('div.input_title').contains('*')
  })

  it('does not display asterisk when mandatory is false', () => {
    cy.mount(<Input title="Username" mandatory={false} />)
    cy.get('div.input_title').should('not.contain', '*')
  })

  // Test for error message display
  it('displays an error message when there is an error', () => {
    const errorMessage = 'Username is required'
    cy.mount(<Input title="Username" err={errorMessage} />)
    cy.get('div.input_error').contains(errorMessage)
  })
})
