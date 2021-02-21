describe("things", () => {
  it("makes a thing", () => {
    cy.visit("/");
    cy.findByText("You have 0 things.");
    cy.findByText("Make a thing").click();
    cy.findByText("You have 1 thing.");
  });
});
