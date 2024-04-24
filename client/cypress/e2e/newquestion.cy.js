describe('post question without loggin in', () => {
    it('Ask a Question without logging in displays please login toast message', () => {
        cy.visit('http://localhost:3000');
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.intercept('POST', '/api/questions/addQuestion', (req) => {
            req.reply({ statusCode: 401, body: { error: 'Login to post your question!' } });
        }).as('postQuestion');

        cy.contains('Post Question').click();
        
        // Assert the toast message is displayed
        cy.contains('Login to post your question!').should('be.visible');
    })
})
describe('Question Component Voting Functionality', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.intercept('GET', 'http://localhost:8000/csrf-token', { statusCode: 200, body: { csrfToken: 'valid_csrf_token' } });
        cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });
        cy.intercept('POST', 'http://localhost:8000/auth/login', { statusCode: 200, body: { success: true, user: { id: 1, username: 'test_user' } } });
        cy.intercept('POST', 'http://localhost:8000/question/addQuestion', { statusCode: 200, body: { success: true } });
        cy.get('#formEmailInput').type('test@example.com');
        cy.get('#formPasswordInput').type('password');
        cy.contains('Login').click();
    });
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success: true } });
        cy.contains('Logout').click({ force: true });
    });
    
    it('Ask a Question creates and displays expected meta data', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.reload();
        cy.contains('Fake Stack Overflow');
        cy.contains('4 questions');
        // cy.contains('joym asked 0 seconds ago');
        // const answers = ['0 answers', '3 answers','2 answers'];
        // const views = ['0 views', '121 views','10 views'];
        // cy.get('.postStats').each(($el, index, $list) => {
        //     cy.wrap($el).should('contain', answers[index]);
        //     cy.wrap($el).should('contain', views[index]);
        // });
        // cy.contains('Unanswered').click();
        // cy.get('.postTitle').should('have.length', 1);
        // cy.contains('1 question');
    })

    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        // cy.contains('javascript');
        // cy.contains('t1');
        // cy.contains('t2');
    })
    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        // cy.contains('javascript');
        // cy.contains('android-studio');
        // cy.contains('t2');
    })
    it('Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be empty');
    })
    it('Ask a Question with long title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be more than 100 characters');
    })
    it('Ask a Question with empty text shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Question text cannot be empty');
    })
    it('Ask a Question with more than 5 tags shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
        cy.contains('Post Question').click();
        cy.contains('Cannot have more than 5 tags');
    })
    it('Ask a Question with a long new tag', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
        cy.contains('Post Question').click();
        cy.contains('New tag length cannot be more than 20');
    })
    it('create a new question with a new tag and finds the question through tag', () => {
        cy.visit('http://localhost:3000');
        
        // add a question with tags
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('test1-tag1 react');
        cy.contains('Post Question').click();

        // clicks tags
        cy.contains('Tags').click();
        // cy.contains('test1-tag1').click();
        // cy.contains('1 questions');
        // cy.contains('Test Question A');

        // cy.contains('Tags').click();
        // cy.contains('react').click();
        // cy.contains('2 questions');
        // cy.contains('Test Question A');
        // cy.contains('Programmatically navigate using React router');
    });
    it('Ask a Question creates and accepts only 1 tag for all the repeated tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.contains('7 Tags');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('test-tag test-tag test-tag');
        cy.contains('Post Question').click();
        // cy.contains('test-tag').should('have.length',1);
        // cy.contains('Tags').click();
        // cy.contains('5 Tags');
        // cy.contains('test-tag').click();
        // cy.contains('1 questions');
    });
});