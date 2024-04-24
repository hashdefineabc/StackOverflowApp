import React from 'react';
// import { mount } from '@cypress/react'; // Ensure to import the mount function
import Tag from '../../src/components/main/tagPage/tag/index'; // Assuming the file is named Tag.js, adjust the import if needed

describe('<Tag />', () => {
  it('renders the tag with the correct data', () => {
    // Mock data for the tag
    const tagData = {
      name: 'JavaScript',
      qcnt: 123
    };

    // Mock function to handle click event
    const handleClick = cy.stub().as('clickTag');

    // Mount the component with the provided data and function
    cy.mount(<Tag t={tagData} clickTag={handleClick} />);

    // Assert that the tag's name and question count are rendered correctly
    cy.get('.tagName').should('contain', tagData.name);
    cy.get('.tagNode').should('contain', `${tagData.qcnt} questions`);

    // Click the tag and assert that the clickTag function was called with the correct argument
    cy.get('.tagNode').click();
    cy.get('@clickTag').should('have.been.calledOnceWith', tagData.name);
  });
});
