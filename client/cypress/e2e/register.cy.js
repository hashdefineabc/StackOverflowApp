describe('Register Component', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000'); // Assuming your component is rendered at this URL
    });

    it('Renders the component with default state', () => {
        cy.contains('Register').should('be.visible');
        cy.contains('Register').click();
        cy.contains('Username').should('be.visible');
        cy.contains('Email').should('be.visible');
        cy.contains('Password').should('be.visible');
        cy.get('#formUsernameInput').should('be.visible');
        cy.get('#formEmailInput').should('be.visible');
        cy.get('#formPasswordInput').should('be.visible');
    });

    it('Displays error messages when form is submitted with empty fields', () => {
        cy.contains('Register').click();
        cy.contains('Register').should('be.visible');
        cy.contains('Register').click();
        cy.contains('Username cannot be empty').should('be.visible');
        cy.contains('Email cannot be empty').should('be.visible');
        cy.contains('Password cannot be empty').should('be.visible');
    });

    it('Registers a new user successfully', () => {
        cy.intercept('POST', 'http://localhost:8000/auth/register', {
            statusCode: 200,
            body: { success: true, user: { id: 1, username: 'test_user', email: 'test@example.com' } }
        }).as('registerRequest');

        cy.contains('Register').click();
        cy.get('#formUsernameInput').type('test_user');
        cy.get('#formEmailInput').type('test@example.com');
        cy.get('#formPasswordInput').type('password');
        cy.contains('Register').click();

        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.body.success).to.equal(true);
        });

        cy.contains('Welcome, test_user!').should('be.visible');
        cy.contains('Logout').should('be.visible');
    });

    it('Displays error message when registration fails', () => {
        cy.intercept('POST', 'http://localhost:8000/auth/register', {
            statusCode: 400,
            body: { success: false, message: 'Error registering' }
        }).as('registerRequest');

        cy.contains('Register').click();
        cy.get('#formUsernameInput').type('existing_user');
        cy.get('#formEmailInput').type('existing@example.com');
        cy.get('#formPasswordInput').type('password');
        cy.contains('Register').click();

        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.body.success).to.equal(false);
        });

        cy.contains('Error registering').should('be.visible');
    });

    it('Logs out the user when "Logout" button is clicked', () => {
        cy.intercept('POST', 'http://localhost:8000/auth/register', {
            statusCode: 200,
            body: { success: true, user: { id: 1, username: 'test_user', email: 'test@example.com' } }
        }).as('registerRequest');

        cy.contains('Register').click();
        cy.get('#formUsernameInput').type('test_user');
        cy.get('#formEmailInput').type('test@example.com');
        cy.get('#formPasswordInput').type('password');
        cy.contains('Register').click();

        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.body.success).to.equal(true);
        });

        cy.contains('Welcome, test_user!').should('be.visible');
        cy.contains('Logout').should('be.visible');
        cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success:true }});

        cy.contains('Logout').click({ force: true });
        cy.contains('See you soon!').should('be.visible');
        cy.contains('Register').should('be.visible');
        cy.contains('Login').should('be.visible');
    });
});
