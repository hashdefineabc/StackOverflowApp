describe('New Question Form', () => {
    it('Ask a Question without logging in displays please login toast message', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        //cy.contains('Post Question').click();
        // Intercept the request to prevent posting the question
        cy.intercept('POST', '/api/questions/addQuestion', (req) => {
            req.reply({ statusCode: 401, body: { error: 'Login to post your question!' } });
        }).as('postQuestion');

        cy.contains('Post Question').click();
        
        // Assert the toast message is displayed
        cy.contains('Login to post your question!').should('be.visible');
    })
});

describe('Login', () => {
    it('Logs in the user successfully', () => {
        cy.visit('http://localhost:3000/auth/login');
        // Assuming your login form has inputs for username and password
        cy.get('#usernameInput').type('my_username');
        cy.get('#emailInput').type('my_email@gmail.com');
        cy.get('#passwordInput').type('my_password');
        cy.contains('Login').click();
        cy.contains('User logged in successfully').should('be.visible');
    });
});

describe('New Question Form Metadata', () => {
    it('Ask a Question creates and displays expected meta data', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('3 questions');
        cy.contains('joym asked 0 seconds ago');
        const answers = ['0 answers', '3 answers','2 answers'];
        const views = ['0 views', '121 views','10 views'];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
        });
        cy.contains('Unanswered').click();
        cy.get('.postTitle').should('have.length', 1);
        cy.contains('1 question');
    })
})

describe('New Question Form with many tags 1', () => {
    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('t1');
        cy.contains('t2');
    })
})

describe('New Question Form with many tags 2', () => {
    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('android-studio');
        cy.contains('t2');
    })
})

describe('New Question Form Error Empty Title', () => {
    it('Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be empty');
    })
})

describe('New Question Form Error Long Title', () => {
    it('Ask a Question with long title shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();
        cy.contains('Title cannot be more than 100 characters');
    })
});

describe('New Question Form Error Empty Text', () => {
    it('Ask a Question with empty text shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();
        cy.contains('Question text cannot be empty');
    })
});

describe('New Question Form Error Extra Tags', () => {
    it('Ask a Question with more than 5 tags shows error', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
        cy.contains('Post Question').click();
        cy.contains('Cannot have more than 5 tags');
    })
});

describe('New Question Form Error Long New Tag', () => {
    it('Ask a Question with a long new tag', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
        cy.contains('Post Question').click();
        cy.contains('New tag length cannot be more than 20');
    })
});

describe('create a new question with a new and an old tag and the question should appear in both through old tag and new tag', () => {
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
        cy.contains('test1-tag1').click();
        cy.contains('1 questions');
        cy.contains('Test Question A');

        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('2 questions');
        cy.contains('Test Question A');
        cy.contains('Programmatically navigate using React router');
    });
});

describe('New Question Form with same tags', () => {
    it('Ask a Question creates and accepts only 1 tag for all the repeated tags', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();
        cy.contains('4 Tags');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('test-tag test-tag test-tag');
        cy.contains('Post Question').click();
        cy.contains('test-tag').should('have.length',1);
        cy.contains('Tags').click();
        cy.contains('5 Tags');
        cy.contains('test-tag').click();
        cy.contains('1 questions');
    });
});