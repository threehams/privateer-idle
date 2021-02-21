import { State } from "@thing/store";
import { Draft } from "immer";

export const gameLoop = (state: Draft<State>, delta: number) => {
  const { timers } = state;
  if (state.autoIncrement) {
    timers.autoIncrement += delta;
    if (timers.autoIncrement > 1000 / state.autoIncrement) {
      timers.autoIncrement = 0;
      state.count += 1;
    }
  }
};
