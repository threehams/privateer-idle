import { Button } from "@thing/ui";

describe("Button.cy.ts", () => {
  it("playground", () => {
    cy.mount(<Button variant="primary">Hi!</Button>);
  });
});
