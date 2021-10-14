import { State } from "@thing/store";
import { Draft } from "immer";

export const gameLoop = (state: Draft<State>, delta: number) => {
  const { timers } = state;
  if (state.autoIncrement) {
    timers.autoIncrement += delta;
    const counts = Math.floor(
      timers.autoIncrement / (1000 / state.autoIncrement),
    );

    if (counts) {
      timers.autoIncrement =
        timers.autoIncrement % (1000 / state.autoIncrement);
      state.count += counts;
    }
  }
};
