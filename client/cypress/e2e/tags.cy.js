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
    

    it("Clicks on a tag and verifies the tag is displayed", () => {
        const tagNames = "javascript";
        cy.contains("Tags").click();

        cy.contains(tagNames).click();
        cy.get(".question_tags").each(($el, index, $list) => {
            cy.wrap($el).should("contain", tagNames);
        });
    });

    it("Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
        const tagNames = "storage";
        //clicks the 3rd tag associated with the question.
        cy.get(".question_tag_button").eq(2).click();

        cy.get(".question_tags").each(($el, index, $list) => {
            cy.wrap($el).should("contain", tagNames);
        });
    });

    it("Adds a question with tags, checks the tags existied", () => {
        // add a question with tags
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1 test2 test3");
        cy.intercept('POST', 'http://localhost:8000/question/addQuestion', { statusCode: 200, body: { success: true } });

        cy.contains("Post Question").click();

        // clicks tags
        cy.contains("Tags").click();
        cy.contains("test1");
        cy.contains("test2");
        cy.contains("test3");
    });

    it("Checks if all tags exist", () => {
        // all tags exist in the page
        cy.contains("Tags").click();
        cy.contains("react", { matchCase: false });
        cy.contains("javascript", { matchCase: false });
        cy.contains("android-studio", { matchCase: false });
        cy.contains("shared-preferences", { matchCase: false });
        cy.contains("storage", { matchCase: false });
        cy.contains("website", { matchCase: false });
        cy.contains("Flutter", { matchCase: false });
    });

    it("Checks if all questions exist inside tags", () => {
        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("7 Tags");
        cy.contains("1 question");
        cy.contains("2 question");
        cy.contains("0 question");
    });

    it("go to question in tag react", () => {
        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("react").click();
        cy.contains("Programmatically navigate using React router");
    });

    it("go to questions in tag storage", () => {
        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("storage").click();
        cy.contains("Quick question about storage on android");
        cy.contains("Object storage for a web application");
    });

    it("create a new question with a new tag and finds the question through tag", () => {

        // add a question with tags
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1-tag1");
        cy.contains("Post Question").click();

        // clicks tags
        cy.contains("Tags").click();
        cy.contains("test1-tag1").click();
        cy.contains("Test Question A");
    });

    it('Total Tag Count', () => {
        cy.contains('Tags').click();
        cy.contains('All Tags');
        cy.contains('4 Tags');
        cy.contains('Ask a Question');
    })
    it('Tag names and count', () => {
        const tagNames = ['react', 'javascript', 'android-studio', 'shared-preferences'];
        const tagCounts = ['1 question', '2 questions', '1 question', '1 question'];
        cy.contains('Tags').click();
        cy.get('.tagNode').each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagNames[index]);
            cy.wrap($el).should('contain', tagCounts[index]);
        })
    })
    it('Click Tag Name', () => {
        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('Programmatically navigate using React router');
        cy.contains('2 answers');
        cy.contains('10 views');
        cy.contains('JoJi John');
        cy.contains('Dec 17');
        cy.contains('03:24');
    })

});
