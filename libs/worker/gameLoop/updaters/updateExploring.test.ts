import { updateExploring } from "./updateExploring";
import { produce } from "immer";
import { initialState, ShipAction, State } from "@space/store";

describe("updateExploring", () => {
  describe("after idling", () => {
    it("launches from a station, if in a station", () => {
      const state: State = {
        ...initialState,
      };
      produce(state, (draft) => {
        updateExploring(draft, 1000);
        expect(draft.currentShipAction).toEqual({ type: "launching" });
      });
    });

    it("plans, if not in a station", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "belt-1",
          systemIndex: 0,
        },
      };
      produce(state, (draft) => {
        updateExploring(draft, 1000);
        expect(draft.currentShipAction).toEqual<ShipAction>({
          type: "planning",
        });
      });
    });
  });
});
