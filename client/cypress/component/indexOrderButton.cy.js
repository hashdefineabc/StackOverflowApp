import React from 'react'
import OrderButton from '../../src/components/main/questionPage/header/orderButton/index'
// import { mount } from 'cypress/react'

describe('<OrderButton />', () => {
  it('renders the button with the correct message', () => {
    // Mount the component with props
    const message = 'Submit Order'
    cy.mount(<OrderButton message={message} setQuestionOrder={() => {}} />)

    // Check if the button contains the correct text
    cy.get('button').should('contain', message)
  })

  it('calls setQuestionOrder with message when clicked', () => {
    const message = 'Submit Order'
    const spy = cy.spy().as('setQuestionOrderSpy')
    cy.mount(<OrderButton message={message} setQuestionOrder={spy} />)

    // Click the button
    cy.get('button').click()

    // Check if the setQuestionOrder function was called with the correct argument
    cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message)
  })
})
