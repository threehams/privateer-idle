import { ReduxAction, State } from "@thing/store";
import { Draft } from "immer";

export const eventHandler = (state: Draft<State>, action: ReduxAction) => {
  switch (action.type) {
    case "INCREMENT":
      state.count += 1;
      break;
    case "AUTO_INCREMENT": {
      if (state.count >= 10 * state.autoIncrement) {
        state.count -= 10 * state.autoIncrement;
        state.autoIncrement += 1;
        break;
      }
    }
  }
};
