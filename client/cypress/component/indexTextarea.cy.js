// import React from 'react'
// import Textarea from './index'

// describe('<Textarea />', () => {
//   it('renders', () => {
//     // see: https://on.cypress.io/mounting-react
//     cy.mount(<Textarea />)
//   })
// })


import React from 'react'
import Textarea from '../../src/components/main/baseComponents/textarea/index'
// import { mount } from '@cypress/react'

describe('<Textarea />', () => {
  it('renders with minimal props', () => {
    // Mount the component with minimum required props
    cy.mount(<Textarea title="Test Title" id="test" val="" setState={() => {}} />)
    // Check if title is rendered
    cy.contains('Test Title')
    // Check if mandatory asterisk is displayed
    cy.get('.input_title').should('contain', '*')
  })

  it('does not display an asterisk if mandatory is false', () => {
    // Mount the component with mandatory set to false
    cy.mount(<Textarea title="Optional Field" mandatory={false} id="test2" val="" setState={() => {}} />)
    // Check if asterisk is not displayed
    cy.get('.input_title').should('not.contain', '*')
  })

  it('displays hint when provided', () => {
    // Mount the component with a hint
    cy.mount(<Textarea title="With Hint" hint="This is a hint" id="test3" val="" setState={() => {}} />)
    // Check if hint is displayed
    cy.contains('This is a hint').should('be.visible')
  })

  it('displays error message when there is an error', () => {
    // Mount the component with an error message
    cy.mount(<Textarea title="Error Field" id="test5" val="" setState={() => {}} err="Error message" />)
    // Check if error message is displayed
    cy.contains('Error message').should('be.visible')
  })
})
