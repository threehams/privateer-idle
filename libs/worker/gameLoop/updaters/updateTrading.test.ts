import { updateMining } from "./updateMining";
import { produce } from "immer";
import { initialState, ShipAction, State, TradeQueueItem } from "@space/store";
import { planets, stations } from "@space/data";
import { updateTrading } from "./updateTrading";

describe("updateMining", () => {
  it("launches from a station, after idling in a station", () => {
    const state: State = {
      ...initialState,
      currentTask: "trading",
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.action).toEqual({ type: "launching" });
  });

  it("plans after idling outside a station", () => {
    const state: State = {
      ...initialState,
      currentTask: "trading",
      planets: {
        "planet-1": {
          ...planets["planet-1"],
          scanned: true,
          cargo: [],
        },
      },
      ships: {
        "ship-1": {
          ...initialState.ships["ship-1"],
          action: {
            type: "idling",
          },
          location: {
            id: "planet-1",
            systemIndex: 0,
          },
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.action).toEqual({ type: "planning" });
  });

  it("sets up a trade route after planning", () => {
    const state: State = {
      ...initialState,
      currentTask: "trading",
      ships: {
        "ship-1": {
          ...initialState.ships["ship-1"],
          action: {
            type: "planning",
          },
          location: {
            id: "station-1",
            systemIndex: 0,
          },
        },
      },
      stations: {
        "station-1": {
          ...stations["station-1"],
          cargo: [],
          scanned: true,
        },
        "station-2": {
          ...stations["station-2"],
          cargo: [],
          scanned: true,
        },
        "station-3": {
          ...stations["station-3"],
          cargo: [],
          scanned: true,
        },
      },
    };
    const result = produce(state, (draft) => {
      updateTrading(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.tradeQueue).toEqual<TradeQueueItem[]>([
      {
        resourceId: "gold-bars",
        stationId: "station-2",
        type: "buy",
      },
      {
        resourceId: "gold-bars",
        stationId: "station-1",
        type: "sell",
      },
    ]);
    expect(ship.action).toEqual<ShipAction>({
      type: "traveling",
      destination: {
        id: "station-2",
        systemIndex: 0,
      },
    });
  });
});
