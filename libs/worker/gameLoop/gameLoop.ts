import { State } from "@space/store";
import { Draft } from "immer";
import { updateMining } from "./updaters/updateMining";

export const gameLoop = (state: Draft<State>, delta: number) => {
  if (state.currentTask === "mining") {
    updateMining(state, delta);
  }
};
