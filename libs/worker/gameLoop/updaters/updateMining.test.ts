import { updateMining } from "./updateMining";
import { produce } from "immer";
import {
  initialState,
  OwnedCargo,
  ShipAction,
  ShipLocation,
  State,
} from "@space/store";
import { belts, planets, stations } from "@space/data";

describe("updateMining", () => {
  it("launches from a station, after idling in a station", () => {
    const state: State = {
      ...initialState,
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.action).toEqual({ type: "launching" });
  });

  it("plans after idle outside a station", () => {
    const state: State = {
      ...initialState,
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

  it("plans after launching from a station", () => {
    const state: State = {
      ...initialState,
      ships: {
        "ship-1": {
          ...initialState.ships["ship-1"],
          action: {
            type: "launching",
          },
          location: {
            id: "station-1",
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

  it("travels to an explored belt after planning", () => {
    const state: State = {
      ...initialState,
      belts: {
        "belt-2": {
          ...belts["belt-2"],
          scanned: true,
          cargo: [],
        },
      },
      ships: {
        "ship-1": {
          ...initialState.ships["ship-1"],
          action: {
            type: "planning",
          },
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.action).toEqual<ShipAction>({
      type: "traveling",
      destination: {
        id: "belt-2",
        systemIndex: 0,
      },
    });
  });

  it("mines ore after traveling to a belt", () => {
    const state: State = {
      ...initialState,
      belts: {
        "belt-2": {
          ...belts["belt-2"],
          scanned: true,
          cargo: [],
        },
      },
      ships: {
        "ship-1": {
          ...initialState.ships["ship-1"],
          action: {
            type: "traveling",
            destination: {
              id: "belt-2",
              systemIndex: 0,
            },
          },
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.action).toEqual<ShipAction>({
      type: "mining",
    });
  });

  it("collects ore after mining, when cargo is not full", () => {
    const state: State = {
      ...initialState,
      belts: {
        "belt-2": {
          ...belts["belt-2"],
          scanned: true,
          cargo: [],
        },
      },
      ships: {
        "ship-1": {
          ...initialState.ships["ship-1"],
          action: {
            type: "mining",
          },
          location: {
            id: "belt-2",
            systemIndex: 0,
          },
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    const ship = result.ships[result.currentShipId];
    expect(ship.action).toEqual<ShipAction>({
      type: "collecting",
    });
    expect(result.belts["belt-2"]!.cargo).toEqual<OwnedCargo[]>([
      { id: "gold-ore", count: 1 },
    ]);
  });

  describe("after collecting", () => {
    it("mines when all ore is collected and cargo is not full", () => {
      const state: State = {
        ...initialState,
        belts: {
          "belt-2": {
            ...belts["belt-2"],
            scanned: true,
            cargo: [{ id: "gold-ore", count: 1 }],
          },
        },
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            action: {
              type: "collecting",
            },
            location: {
              id: "belt-2",
              systemIndex: 0,
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "mining",
      });
      expect(ship.cargo).toEqual<OwnedCargo[]>([{ id: "gold-ore", count: 1 }]);
      expect(result.belts["belt-2"]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 0 },
      ]);
    });

    it("collects when more ore is available and cargo is not full", () => {
      const state: State = {
        ...initialState,
        belts: {
          "belt-2": {
            ...belts["belt-2"],
            scanned: true,
            cargo: [{ id: "gold-ore", count: 3 }],
          },
        },
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            action: {
              type: "collecting",
            },
            location: {
              id: "belt-2",
              systemIndex: 0,
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "collecting",
      });
      expect(ship.cargo).toEqual<OwnedCargo[]>([{ id: "gold-ore", count: 1 }]);
      expect(result.belts["belt-2"]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 2 },
      ]);
    });

    it("travels to a station when cargo is full", () => {
      const state: State = {
        ...initialState,
        stations: {
          "station-2": {
            ...stations["station-2"],
            scanned: true,
            cargo: [],
          },
        },
        belts: {
          "belt-2": {
            ...belts["belt-2"],
            scanned: true,
            cargo: [{ id: "gold-ore", count: 4 }],
          },
        },
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            id: "ship-1",
            cargo: [{ id: "gold-ore", count: 4 }],
            location: {
              id: "belt-2",
              systemIndex: 0,
            },
            action: {
              type: "collecting",
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "traveling",
        destination: {
          id: "station-2",
          systemIndex: 0,
        },
      });
      expect(ship.cargo).toEqual<OwnedCargo[]>([{ id: "gold-ore", count: 5 }]);
      expect(result.belts["belt-2"]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 3 },
      ]);
    });
  });

  describe("after traveling to a station", () => {
    it("docks at the station", () => {
      const state: State = {
        ...initialState,
        belts: {
          "belt-2": {
            ...belts["belt-2"],
            scanned: true,
            cargo: [],
          },
        },
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            action: {
              type: "traveling",
              destination: {
                id: "station-2",
                systemIndex: 0,
              },
            },
            location: {
              id: "belt-2",
              systemIndex: 0,
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "docking",
      });
      expect(ship.location).toEqual<ShipLocation>({
        id: "station-2",
        systemIndex: 0,
      });
    });
  });

  describe("after docking at a station", () => {
    it("sells cargo if any can be sold", () => {
      const state: State = {
        ...initialState,
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            id: "ship-1",
            cargo: [
              { id: "iron-bars", count: 1 },
              { id: "gold-ore", count: 4 },
            ],
            location: {
              id: "station-2",
              systemIndex: 0,
            },
            action: {
              type: "docking",
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "selling",
      });
    });
  });

  describe("after selling at a station", () => {
    it("sells cargo if any can be sold", () => {
      const state: State = {
        ...initialState,
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            id: "ship-1",
            cargo: [
              { id: "iron-bars", count: 1 },
              { id: "gold-ore", count: 4 },
            ],
            location: {
              id: "station-2",
              systemIndex: 0,
            },
            action: {
              type: "selling",
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "selling",
      });
      expect(result.player.credits).toEqual(9);
      expect(ship.cargo).toEqual<OwnedCargo[]>([
        { id: "iron-bars", count: 1 },
        { id: "gold-ore", count: 3 },
      ]);
    });

    it("launches if no cargo can be sold", () => {
      const state: State = {
        ...initialState,
        ships: {
          "ship-1": {
            ...initialState.ships["ship-1"],
            id: "ship-1",
            cargo: [
              { id: "iron-bars", count: 1 },
              { id: "gold-ore", count: 0 },
            ],
            location: {
              id: "station-2",
              systemIndex: 0,
            },
            action: {
              type: "selling",
            },
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      const ship = result.ships[result.currentShipId];
      expect(ship.action).toEqual<ShipAction>({
        type: "launching",
      });
    });
  });
});
