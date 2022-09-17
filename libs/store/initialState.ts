import { belts, ships, systems } from "@space/data";
import { State } from "./State";

export const initialState: State = {
  player: {
    credits: 0,
  },
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
      ...ships["light-fighter-1"],
      id: "ship-1",
      cargo: [],
    },
  },
  belts: {
    "belt-1": {
      ...belts["belt-1"],
      scanned: true,
      cargo: [],
      ships: [],
    },
  },
  planets: {},
  stations: {
    "station-1": {
      scanned: true,
    },
    "station-2": {
      scanned: true,
    },
  },
  stars: {},
  systems: [systems[0]],
};
