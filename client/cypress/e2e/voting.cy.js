describe('Question Component Voting Functionality', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
    });
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it('Displays a warning message when user is not logged in', () => {
        cy.contains('button', 'Upvote').click();
        cy.intercept('PUT', 'http://localhost:8000/question/*/upvote', {
            statusCode: 200,
            body: { success: false },
        }).as('upvoteRequest');
        cy.contains('Login to vote!').should('be.visible');
    });

    it('Allows user to upvote a question', () => {
        cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });
        cy.intercept('POST', 'http://localhost:8000/question/*/upvote', {
            statusCode: 200,
            body: { success: true },
        }).as('upvoteRequest');
        cy.contains('button', 'Upvote').click();
        cy.wait('@upvoteRequest').then(() => {
            cy.contains('button', 'Downvote').should('be.visible');
        });
        cy.get('.upvote_section span').should('contain', '1');
        cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success: true } });
        cy.contains('Logout').click({ force: true });
    });

    it('Allows user to downvote a question', () => {
        cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });
        cy.intercept('POST', 'http://localhost:8000/question/*/downvote', {
            statusCode: 200,
            body: { success: true },
        }).as('downvoteRequest');

        cy.contains('button', 'Upvote').click();
        cy.contains('button', 'Downvote').click();

        cy.wait('@downvoteRequest').then(() => {
            cy.contains('button', 'Upvote').should('be.visible');
        });
        cy.get('.upvote_section span').should('contain', '0');
    });

});
