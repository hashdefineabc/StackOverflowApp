describe('Question Component Voting Functionality', () => {
    beforeEach(() => {
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.visit('http://localhost:3000');
    });
    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("3.1 | Search for a question using text content that does not exist", () => {
        const searchText = "Web3";
    
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type(`${searchText}{enter}`);
        cy.get(".postTitle").should("have.length", 0);
      });
    
      it("3.2 | Search string in question text", () => {
        const qTitles = ["Object storage for a web application"];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("40 million{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("3.3 | earch string in question text", () => {
        const qTitles = ["Quick question about storage on android"];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("data remains{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("4.1 | Search a question by tag (t1)", () => {
        const qTitles = ["Programmatically navigate using React router"];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[react]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("4.2 | Search a question by tag (t2)", () => {
        const qTitles = [
          "android studio save string shared preference, start activity and load the saved string",
          "Programmatically navigate using React router",
        ];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[javascript]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("4.3 | Search a question by tag (t3)", () => {
        const qTitles = [
          "Quick question about storage on android",
          "android studio save string shared preference, start activity and load the saved string",
        ];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[android-studio]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("4.4 | Search a question by tag (t4)", () => {
        const qTitles = [
          "Quick question about storage on android",
          "android studio save string shared preference, start activity and load the saved string",
        ];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[shared-preferences]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("4.5 | Search for a question using a tag that does not exist", () => {
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[nonExistentTag]{enter}");
        cy.get(".postTitle").should("have.length", 0);
      });

      it('Search string in question text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
    it('Search string matches tag and text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
    
    it('Output of the search should be in newest order by default', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    });
    it('Output of the search should show number of results found', () => {
        const qTitles = ["Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.contains(qTitles.length+" questions");
    });
    it('Output of the empty search should show all results ', () => {
        const qTitles = ["Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('{enter}');
        cy.contains(qTitles.length+" questions");
    });
    it('Search string with non-existing tag and non-tag word', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[NonExistingTag] nonexistingword{enter}');
        cy.contains('No Questions Found');
    });
    it('Search string with case-insensitive matching', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('AnDrOiD{enter}');
        cy.contains('android');
    });

});
