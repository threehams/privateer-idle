import { initialState } from "@thing/store";
import { migrateSave } from "./migrateSave";

describe("something", () => {
  it("returns the save if no migrations are needed", () => {
    const migrated = migrateSave({
      ...initialState,
    });
    expect(migrated).toEqual(initialState);
  });
});
