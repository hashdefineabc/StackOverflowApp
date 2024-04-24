[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| Feature 1 | This is feature 1. | /path/to/test | path/to/test    | path/to/test   |
| Feature 2 | This is feature 2. | /path/to/test | path/to/test    | path/to/test   |
. . .


Feature 1 - View posts
Description: user can view the posts once they click on the post link
E2E Tests: home.cy.js
Component Tests: indexQuestionPage.cy.js, indexQuestion.cy.js
Jest Tests: questions.test.js

Feature 2 - Create new posts
Description: user can create new posts after loging in
E2E Tests: newquestion.cy.js
Component Tests: indexLogin.cy.js, indexNewQuestion.cy.js, indexQuestionBody.cy.js, indexQuestionHeader.cy.js
Jest Tests: newQuestions.test.js, authController.test.js

Feature 3 - Search for existing posts
Description:  User can search for posts through search box
E2E Tests: search.cy.js
Component Tests: header.cy.js
Jest Tests: question.test.js, tags.test.js

Feature 4 - Commenting on posts
Description: User can add comments in post
E2E Tests: newanswer.cy.js
Component Tests: indexAnswerPage.cy.js, indexAnswerHeader.cy.js, indexAnswer.cy.js, indexNewAnswer.cy.js
Jest Tests: newAnswer.test.js, authController.test.js

Feature 5 - Voting on posts
Description: User can vote useful answers
E2E Tests: voting.cy.js
Component Tests: indexAnswer.cy.js, indexAnswerHeader.cy.js, indexAnswer.cy.js
Jest Tests: question.test.js, authController.test.js

Feature 6 - Tagging posts
Description: Users can add tags to the posts to categorise them
E2E Tests: tags.cy.js
Component Tests: indexTagPage.cy.js, indexTag.cy.js
Jest Tests: question.test.js, tags.test.js, authController.test.js

Feature 7 - User profiles
Description: Users can edit their profiles
E2E Tests: userProfile.cy.js
Component Tests: indexRegister.cy.js, indexUserProfilePage.cy.js
Jest Tests: authController.test.js

Feature 8 - Post moderation
Description: Users can edit their posts
E2E Tests: postModeration.cy.js
Component Tests: indexQuestionPage.cy.js, indexQuestionHeader.cy.js, indexQuestionBody.cy.js
Jest Tests: authController.test.js, question.test.js

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