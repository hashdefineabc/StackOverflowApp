import React from 'react';
import { UserContext } from '../../src/UserContext'; // adjust path as necessary
import SideBarNav from '../../src/components/main/sideBarNav/index';

describe('<SideBarNav />', () => {
  const mountSideBarNav = (user, selected) => {
    const handleQuestions = cy.stub().as('handleQuestions');
    const handleTags = cy.stub().as('handleTags');
    const handleUserProfile = cy.stub().as('handleUserProfile');

    cy.mount(
      <UserContext.Provider value={{ user }}>
        <SideBarNav
          selected={selected}
          handleQuestions={handleQuestions}
          handleTags={handleTags}
          handleUserProfile={handleUserProfile}
        />
      </UserContext.Provider>
    );

    return { handleQuestions, handleTags, handleUserProfile };
  };

  it('renders without user logged in', () => {
    mountSideBarNav(null, '');
    cy.get('#sideBarNav').should('exist');
    cy.get('#menu_question').should('exist');
    cy.get('#menu_tag').should('exist');
    cy.get('#menu_user').should('not.exist'); 
  });


  it('handles click on Questions button', () => {
    mountSideBarNav(null, '');
    cy.get('#menu_question').click();
    cy.get('@handleQuestions').should('have.been.calledOnce');
  });

  it('handles click on Tags button', () => {
    mountSideBarNav(null, '');
    cy.get('#menu_tag').click();
    cy.get('@handleTags').should('have.been.calledOnce');
  });

  it('menu button gets selected class when selected', () => {
    mountSideBarNav(null, 'q');
    cy.get('#menu_question').should('have.class', 'menu_selected');
    cy.get('#menu_tag').should('not.have.class', 'menu_selected');
  });
});
