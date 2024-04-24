describe('Question Component Voting Functionality', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.intercept('GET', 'http://localhost:8000/csrf-token', { statusCode: 200, body: { csrfToken: 'valid_csrf_token' } });
        cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });
        cy.intercept('POST', 'http://localhost:8000/auth/login', { statusCode: 200, body: { success: true, user: { id: 1, username: 'test_user' } } });
        cy.get('#formEmailInput').type('test@example.com');
        cy.get('#formPasswordInput').type('password');
        cy.contains('Login').click();
    });
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success: true } });
        cy.contains('Logout').click({ force: true });
    });
    it('Answer Page displays expected header', () => {
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
        cy.get('#answersHeader').should('contain', '2 answers');
        cy.get('#answersHeader').should('contain', 'Ask a Question');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
    })

    it('Answer Page displays expected question text', () => {
        const text = "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.";
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#questionBody').should('contain', '10 views');
        cy.get('#questionBody').should('contain', text);
        cy.get('#questionBody').should('contain', 'Joji John');
        cy.get('#questionBody').should('contain', 'Jan 20, 2022');
        cy.get('#questionBody').should('contain', '03:00');
    })
    it('Answer Page displays expected answers', () => {
        const answers = ["React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
        "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
    });
    it('Answer Page displays expected authors', () => {
        const authors = ['hamkalo', 'azad'];
        const date = ['Nov 20','Nov 23'];
        const times = ['03:24','08:24'];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerAuthor').each(($el, index) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        });
    });
});


