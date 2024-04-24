describe('Edit Question Functionality', () => {
  beforeEach(() => {
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.visit('http://localhost:3000');
    cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });
    cy.contains('Ask a Question').click();
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript t1 t2');
    cy.contains('Post Question').click();
    cy.reload();
    cy.contains('Test Question 1').click();
    cy.intercept('PUT', 'http://localhost:8000/question/getQuestionById/*', {
      statusCode: 200,
    }).as('getQuestionRequest');

  });
  afterEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('Allows user to edit their own question', () => {

    cy.contains('button', 'Edit Question').click();
    cy.get('#formTitleInput').should('have.value', 'Test Question 1');
    cy.get('#formTextInput').should('have.value', 'Test Question 1 Text');
    cy.get('#formTagInput').should('have.value', 'javascript t1 t2');

    // Modify the question title and text
    cy.get('#formTitleInput').clear().type('Updated Test Question');
    cy.get('#formTextInput').clear().type('This is the updated test question.');
    cy.get('#formTagInput').clear().type('java t1 t2 t3');

    // Click the submit button
    cy.contains('button', 'Edit Question').click();

    // Assert that the updated question is displayed
    cy.contains('Updated Test Question').should('be.visible');
    cy.contains('java').should('be.visible');
    cy.contains('t1').should('be.visible');
    cy.contains('t2').should('be.visible');
    cy.contains('t3').should('be.visible');
    cy.contains('Updated Test Question').click();
    cy.contains('This is the updated test question.').should('be.visible');
  });

  it('Prevents user from editing other users\' questions', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Quick question about storage on android').click();
    cy.get('Edit Question').should('not.exist');

  });

  it('Shows validation error when title is empty', () => {
    cy.contains('button', 'Edit Question').click();
    cy.get('#formTitleInput').clear();
    cy.contains('button', 'Edit Question').click();

    // Assert that the validation error is shown
    cy.contains('Title cannot be empty').should('be.visible');
  });

  it('Handles server error during question update', () => {

    // Mock the updateQuestion API endpoint to return a server error
    cy.intercept('PUT', 'http://localhost:8000/question/*/updateQuestion', {
      statusCode: 500,
      body: { success: false, message: 'Internal Server Error' },
    }).as('updateQuestionRequest');

    cy.contains('button', 'Edit Question').click();

    // Modify the question title and text
    cy.get('#formTitleInput').clear().type('Updated Test Question');
    cy.get('#formTextInput').clear().type('This is the updated test question.');

    // Click the submit button
    cy.contains('button', 'Edit Question').click();

    // Wait for the update request to complete
    cy.wait('@updateQuestionRequest');

    // Assert that the error message is displayed
    cy.contains('Error editing question').should('be.visible');
  });
});
