import { State } from "@thing/store";
import { Draft } from "immer";

export const gameLoop = (state: Draft<State>, delta: number) => {
  const { timers } = state;
  if (state.currentTask === "mining") {
    // mining is:
    // move to an asteroid belt in system
    // mine until cargo is full
    // move to station with highest sale price
    // sell everything
    // repeat
    // timers.autoIncrement += delta;
    // const counts = Math.floor(
    //   timers.autoIncrement / (1000 / state.autoIncrement),
    // );
    // if (counts) {
    //   timers.autoIncrement =
    //     timers.autoIncrement % (1000 / state.autoIncrement);
    //   state.count += counts;
    // }
  }
};
