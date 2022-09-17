import { State } from "@space/store";
import { Draft } from "immer";
import { updateExploring } from "./updaters/updateExploring";
import { updateMining } from "./updaters/updateMining";
import { updateTrading } from "./updaters/updateTrading";

export const gameLoop = (state: Draft<State>, delta: number) => {
  if (state.currentTask === "mining") {
    updateMining(state, delta);
  } else if (state.currentTask === "exploring") {
    updateExploring(state, delta);
  } else if (state.currentTask === "trading") {
    updateTrading(state, delta);
  }
};
