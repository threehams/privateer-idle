import { State } from "./State";

export const initialState: State = {
  currentShipId: "ship-1",
  version: "0.1",
  currentTask: "mining",
  timers: {
    ship: 0,
  },
  currentShipAction: { type: "idling" },
  currentShipLocation: {
    systemIndex: 0,
    id: "station-1",
  },
  ships: {
    "ship-1": {
      id: "ship-1",
      shipId: "light-fighter-1",
      cargo: [],
    },
  },
  belts: {},
  planets: {},
  stations: {},
};
