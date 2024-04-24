describe('Header Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Assuming your component is rendered at this URL
  });

  it('Renders the component with default state', () => {
    cy.contains('Fake Stack Overflow').should('be.visible');
    cy.get('#searchBar').should('be.visible');
    cy.contains('Register').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('Renders the SignUp component when "Register" button is clicked', () => {
    cy.contains('Register').click();
    cy.contains('Register').should('be.visible');
  });

  it('Renders the Login component when "Login" button is clicked', () => {
    cy.contains('Login').click();
    cy.contains('Login').should('be.visible');
  });

  it('Displays welcome message and logout button when user is logged in', () => {
    // Stub user context with logged-in user
    cy.intercept('GET', 'http://localhost:8000/csrf-token', { statusCode: 200 });
    cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });

    cy.reload(); // Reload the page to trigger useEffect and checkLoginStatus

    cy.contains('Welcome, test_user!').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });

  it('Logs out the user when "Logout" button is clicked', () => {
    // Stub user context with logged-in user
    cy.intercept('GET', 'http://localhost:8000/csrf-token', { statusCode: 200 });
    cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });

    cy.reload(); // Reload the page to trigger useEffect and checkLoginStatus
    cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success: true } });
    cy.contains('Logout').click({ force: true });
    cy.contains('See you soon!').should('be.visible');
    cy.reload();
    cy.contains('Register').should('be.visible');
    cy.contains('Login').should('be.visible');
    
  });

  it('Renders the login form with email and password inputs', () => {
    cy.contains('Login').click();
    cy.contains('Login').should('be.visible');
    cy.get('#formEmailInput').should('be.visible');
    cy.get('#formPasswordInput').should('be.visible');
  });

  it('Displays validation error messages for empty email and password fields', () => {
    // Click login button without entering anything
    cy.contains('Login').click();
    cy.contains('Login').should('be.visible');
    cy.get('#formEmailInput').should('be.visible');
    cy.get('#formPasswordInput').should('be.visible');
    cy.contains('Login').click();
    // Check for error messages
    cy.contains('Email cannot be empty').should('be.visible');
    cy.contains('Password cannot be empty').should('be.visible');
    //cy.contains('Logout').click();
  });

  it('Displays error message when login fails due to incorrect credentials', () => {
    // Stub login request to return failure
    cy.intercept('POST', 'http://localhost:8000/auth/login', { statusCode: 200, body: { success: false } });
    cy.contains('Login').click();
    // Enter valid email and password
    cy.get('#formEmailInput').type('test@example.com');
    cy.get('#formPasswordInput').type('password');

    // Click login button
    cy.contains('Login').click();

    // Check for error message
    cy.contains('Incorrect email or password.').should('be.visible');
    cy.contains('Close').click();
  });

  it('Calls handleQuestions function and shows success toast message when login is successful', () => {
    cy.contains('Login').click();
    // Stub login request to return success
    cy.intercept('POST', 'http://localhost:8000/auth/login', { statusCode: 200, body: { success: true, user: { id: 1, username: 'test_user' } } });

    // Stub CSRF token request
    cy.intercept('GET', 'http://localhost:8000/csrf-token', { statusCode: 200, body: { csrfToken: 'valid_csrf_token' } });

    // Stub check login request
    cy.intercept('GET', 'http://localhost:8000/check-login', { statusCode: 200, body: { loggedIn: true, user: { id: 1, username: 'test_user' } } });


    // Enter valid email and password
    cy.get('#formEmailInput').type('test@example.com');
    cy.get('#formPasswordInput').type('password');

    // Click login button
    cy.contains('Login').click();

    // Check if handleQuestions function is called
    cy.contains('Welcome back!').should('be.visible');

    // Check if success toast message is displayed
    cy.contains('Welcome back!').should('be.visible');
    cy.intercept('POST', 'http://localhost:8000/auth/logout', { statusCode: 200, body: { success: true } });

    cy.contains('Logout').click({ force: true });
  });
});
