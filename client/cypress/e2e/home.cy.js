describe("Cypress Tests repeated from React assignment", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('successfully shows All Questions string', () => {
    cy.visit('http://localhost:3000');
    cy.contains('All Questions');
})
it('successfully shows Ask a Question button', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Ask a Question');
})
it('successfully shows total questions number', () => {
  cy.visit('http://localhost:3000');
  cy.contains('4 questions');
})
it('successfully shows filter buttons', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Newest');
  cy.contains('Active');
  cy.contains('Unanswered');
})
it('successfully shows menu items', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Questions');
  cy.contains('Tags');
})
it('successfully shows search bar', () => {
  cy.visit('http://localhost:3000');
  cy.get('#searchBar');
})
it('successfully shows page title', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Fake Stack Overflow');
})
it('successfully shows all questions in model', () => {
  const qTitles = ['Quick question about storage on android','Object storage for a web application','android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
  cy.visit('http://localhost:3000');
  cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
  })
})
it('successfully shows all question stats', () => {
  const answers = ['1 answers','2 answers','3 answers','2 answers'];
  const views = ['103 views','200 views', '121 views', '10 views'];
  cy.visit('http://localhost:3000');
  cy.get('.postStats').each(($el, index, $list) => {
      cy.wrap($el).should('contain', answers[index]);
      cy.wrap($el).should('contain', views[index]);
  })
})
it('successfully shows all question authors and date time', () => {
  const authors = ['elephantCDE','monkeyABC','saltyPeter', 'Joji John'];
  const date = ['Mar 10','Feb 18','Jan 10', 'Jan 20'];
  const times = ['14:28:01','01:02:15','11:24:30', '03:00:00'];
  cy.visit('http://localhost:3000');
  cy.get('.lastActivity').each(($el, index, $list) => {
      cy.wrap($el).should('contain', authors[index]);
      cy.wrap($el).should('contain', date[index]);
      cy.wrap($el).should('contain', times[index]);
  })
})
it('successfully shows all questions in model in active order', () => {
  const qTitles = ['Programmatically navigate using React router','android studio save string shared preference, start activity and load the saved string', 'Quick question about storage on android', 'Object storage for a web application'];
  cy.visit('http://localhost:3000');
  cy.contains('Active').click();
  cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
  })
})
it('successfully shows all unanswered questions in model', () => {
  const qTitles = ['Programmatically navigate using React router', 'Quick question about storage on android', 'Object storage for a web application', 'android studio save string shared preference, start activity and load the saved string'];
  cy.visit('http://localhost:3000');
  cy.contains('Unanswered').click();
  cy.contains('0 questions');
})
it('successfully highlights "Questions" link when on the home page', () => {
  cy.visit('http://localhost:3000');
  cy.get('.sideBarNav').contains('Questions').should('have.css', 'background-color', 'rgb(204, 204, 204)');
})
it('successfully highlights "Tags" link when on the Tags page', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Tags').click();
  cy.get('.sideBarNav').contains('Tags').should('have.css', 'background-color', 'rgb(204, 204, 204)');
})
// it("Adds a question, click unanswered button, verifies the sequence", () => {
//   cy.visit("http://localhost:3000");
//   // add a question
//   cy.contains("Ask a Question").click();
//   cy.get("#formTitleInput").type("Test Question A");
//   cy.get("#formTextInput").type("Test Question A Text");
//   cy.get("#formTagInput").type("javascript");
//   cy.contains("Post Question").click();
//   // add another question
//   cy.contains("Ask a Question").click();
//   cy.get("#formTitleInput").type("Test Question B");
//   cy.get("#formTextInput").type("Test Question B Text");
//   cy.get("#formTagInput").type("javascript");
//   cy.contains("Post Question").click();
//   // add another question
//   cy.contains("Ask a Question").click();
//   cy.get("#formTitleInput").type("Test Question C");
//   cy.get("#formTextInput").type("Test Question C Text");
//   cy.get("#formTagInput").type("javascript");
//   cy.contains("Post Question").click();
//   // add an answer to question A
//   cy.contains("Test Question A").click();
//   cy.contains("Answer Question").click();
//   cy.get("#answerTextInput").type("Answer Question A");
//   cy.contains("Post Answer").click();
//   // go back to main page
//   cy.contains("Questions").click();
//   // clicks unanswered
//   cy.contains("Unanswered").click();
//   cy.wait(1000); // Wait for the data to be updated.
//   const qTitles = ["Test Question C", "Test Question B"];
//   cy.get(".postTitle").each(($el, index, $list) => {
//     cy.wrap($el).should("contain", qTitles[index]);
//   });

// });
})