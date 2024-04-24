// import React from 'react'
// import FakeStackOverflow from '../../src/components/fakestackoverflow'

// describe('<FakeStackOverflow />', () => {
//   it('renders', () => {
//     // see: https://on.cypress.io/mounting-react
//     cy.mount(<FakeStackOverflow />)
//   })
// })

import React from 'react'
import FakeStackOverflow from '../../src/components/fakestackoverflow'


describe('<FakeStackOverflow />', () => {
  it('renders successfully', () => {
    cy.mount(<FakeStackOverflow />)
    cy.get('title').should('exist')
  })
})
