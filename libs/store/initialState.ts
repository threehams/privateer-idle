import { State } from "./State";

export const initialState: State = {
  currentShip: "1",
  version: "0.1",
  currentTask: "mining",
  timers: {
    mining: 0,
  },
};
