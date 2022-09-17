import { updateExploring } from "./updateExploring";
import { produce } from "immer";
import { initialState, ShipAction, State } from "@space/store";

describe("updateExploring", () => {
  describe("after idling", () => {
    it("launches from a station, if in a station", () => {
      const state: State = {
        ...initialState,
      };
      const result = produce(state, (draft) => {
        updateExploring(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual({ type: "launching" });
    });

    it("plans, if not in a station", () => {
      const state: State = {
        ...initialState,
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            location: {
              id: "belt-1",
              systemIndex: 0,
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateExploring(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "planning",
      });
    });
  });
});
