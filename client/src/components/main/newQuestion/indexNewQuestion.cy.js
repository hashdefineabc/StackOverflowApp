import React from 'react'
import NewQuestion from './index'

describe('<NewQuestion />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<NewQuestion />)
  })
})

/**
 * Spy is like a stub which allows us to track 
 */