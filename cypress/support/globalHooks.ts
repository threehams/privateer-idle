import { beforeEach, cy, Cypress } from "local-cypress";

beforeEach(() => {
  console.log(Cypress.config());
  cy.visit("/");
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.indexedDB.deleteDatabase("thing_game");
  });
});
