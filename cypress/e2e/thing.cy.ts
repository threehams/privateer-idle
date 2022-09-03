import { describe, it, cy } from "local-cypress";
import { range } from "lodash";

describe("things", () => {
  it("makes a thing", () => {
    cy.visit("/");
    cy.findByText("You have 0 things.");
    for (const index of range(0, 10)) {
      cy.findByText("Make a thing").click();
    }
    cy.findByText(/You have 10 things/i);
    cy.findByText(/Make a thing maker/i).click();
    cy.findByText(/Making 1 thing per second/);
  });
});
