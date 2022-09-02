import { State } from "./State";

export const initialState: State = {
  version: "0.1",
  count: 0,
  autoIncrement: 0,
  timers: {
    autoIncrement: 0,
  },
};
