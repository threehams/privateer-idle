import { StateAction, State } from "@space/store";
import { Draft } from "immer";

export const eventHandler = (state: Draft<State>, action: StateAction) => {
  switch (action.type) {
    case "SELECT_TASK":
      state.currentTask = action.payload.task;
      state.timers.ship = 0;
      state.currentShipAction = {
        type: "idling",
      };
      break;
  }
};
