import "@testing-library/cypress/add-commands";

type Aliases = {
  // Add alias types here
  [key: string]: unknown;
};

const getAlias = <TAlias extends keyof Aliases>(
  alias: TAlias,
): Cypress.Chainable<Aliases[TAlias]> => {
  return cy.get(`@${alias}`) as any;
};
Cypress.Commands.add("alias", getAlias);
