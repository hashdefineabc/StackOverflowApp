describe('UserProfilePage Component', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
        cy.contains('Login').click();
        cy.intercept('POST', 'http://localhost:8000/auth/login', { statusCode: 200, body: { success: true, user: { id: 1, username: 'test_user' } } });
        cy.intercept('GET', 'http://localhost:8000/csrf-token', { statusCode: 200, body: { csrfToken: 'valid_csrf_token' } });
        cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });
        cy.get('#formEmailInput').type('test@example.com');
        cy.get('#formPasswordInput').type('password');

        // Click login button
        cy.contains('Login').click();
    });

    afterEach(() => {
        // Clear the database after each test
        cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success: true } });
        cy.contains('Logout').click({ force: true });
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it('Renders the component with default state', () => {
        // Assuming user context is already stubbed with a logged-in user
        cy.contains('My Profile').should('be.visible');
        cy.contains('My Profile').click();
        cy.contains('Username:').should('be.visible');
        cy.contains('Email:').should('be.visible');
        cy.contains('Title:').should('be.visible');
        cy.contains('About Me:').should('be.visible');
        cy.contains('Location:').should('be.visible');
        cy.contains('Github Link:').should('be.visible');
        cy.contains('LinkedIn:').should('be.visible');
        cy.get('.edit-profile-btn').scrollIntoView();
        cy.contains('Update Profile').should('be.visible');
    });

    it('Updates the user profile successfully', () => {
        // Stub updateUserProfile request
        cy.intercept('PUT', 'http://localhost:8000/profile/*/updateUserProfile', {
            statusCode: 200,
            body: { success: true }
        }).as('updateProfileRequest');

        // Assuming user context is already stubbed with a logged-in user
        cy.contains('My Profile').click();
        cy.get('#formTitleInput').clear().type('updated_title');
        cy.get('#formAboutMeInput').clear().type('Updated about me');
        cy.get('#formLocationInput').clear().type('Updated location');
        cy.get('#formGithubLinkInput').clear().type('https://github.com/updated_user');
        cy.get('#formLinkedInLinkInput').clear().type('https://linkedin.com/updated_user');
        cy.get('.edit-profile-btn').scrollIntoView();
        cy.contains('Update Profile').click();

        cy.wait('@updateProfileRequest').then((interception) => {
            expect(interception.response.body.success).to.equal(true);
        });
    });

    it('Displays error message when profile update fails', () => {
        // Stub updateUserProfile request to fail
        cy.intercept('PUT', 'http://localhost:8000/profile/*/updateUserProfile', {
            statusCode: 400,
            body: { success: false, message: 'Error updating profile' }
        }).as('updateProfileRequest');
        cy.contains('My Profile').click();

        // Assuming user context is already stubbed with a logged-in user
        cy.get('.edit-profile-btn').scrollIntoView();
        cy.contains('Update Profile').click();

        cy.wait('@updateProfileRequest').then((interception) => {
            expect(interception.response.body.success).to.equal(false);
        });

        cy.contains('Error updating profile').should('be.visible');
    });

});
