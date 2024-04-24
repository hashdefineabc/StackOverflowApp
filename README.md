[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

E2E tests - client/cypress/e2e
Component Tests - client/cypress/component
Jest Tests - server/tests

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View posts | user can view the posts once they click on the post link | home.cy.js | indexQuestionPage.cy.js, indexQuestion.cy.js   | questions.test.js   |
| Create new posts | user can create new posts after loging in | newquestion.cy.js | indexLogin.cy.js, indexNewQuestion.cy.js, indexQuestionBody.cy.js, indexQuestionHeader.cy.js    | newQuestions.test.js, authController.test.js  |
| Search for existing posts |  User can search for posts through search box | search.cy.js | header.cy.js | question.test.js, tags.test.js |
| Commenting on posts | User can add comments in post | newanswer.cy.js | indexAnswerPage.cy.js, indexAnswerHeader.cy.js, indexAnswer.cy.js, indexNewAnswer.cy.js | newAnswer.test.js, authController.test.js |
| Voting on posts | User can vote useful answers | voting.cy.js | indexAnswer.cy.js, indexAnswerHeader.cy.js, indexAnswer.cy.js  | question.test.js, authController.test.js |
| Tagging posts | Users can add tags to the posts to categorise them | tags.cy.js | indexTagPage.cy.js, indexTag.cy.js | question.test.js, tags.test.js, authController.test.js |
| User profiles | Users can edit their profiles | userProfile.cy.js | indexRegister.cy.js, indexUserProfilePage.cy.js | authController.test.js |
| Post moderation | Users can edit their posts | postModeration.cy.js | indexQuestionPage.cy.js, indexQuestionHeader.cy.js, indexQuestionBody.cy.js  | authController.test.js, question.test.js |
. . .


## Instructions to generate and view coverage report 

1. clone the repo
2. cd into server
3. Run command - npm install
4. cd into client
5. Run command - npm install
6. cd into server 
7. make sure MongoDB is running in background in local
8. Run command - npx jest --coverage

This process will give the coverage for all the jest tests in our project.

## Extra Credit Section (if applicable)