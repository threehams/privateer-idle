import { updateMining } from "./updateMining";
import { produce } from "immer";
import {
  initialState,
  OwnedCargo,
  ShipAction,
  ShipLocation,
  State,
} from "@space/store";

describe("updateMining", () => {
  it("launches from a station, after idling in a station", () => {
    const state: State = {
      ...initialState,
    };
    produce(state, (draft) => {
      updateMining(draft, 1000);
      expect(draft.currentShipAction).toEqual({ type: "launching" });
    });
  });

  it("plans after idle outside a station", () => {
    const state: State = {
      ...initialState,
      currentShipAction: {
        type: "idling",
      },
      currentShipLocation: {
        id: "planet-1",
        systemIndex: 0,
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    expect(result.currentShipAction).toEqual({ type: "planning" });
  });

  it("plans after launching from a station", () => {
    const state: State = {
      ...initialState,
      currentShipAction: {
        type: "launching",
      },
      currentShipLocation: {
        id: "station-1",
        systemIndex: 0,
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    expect(result.currentShipAction).toEqual({ type: "planning" });
  });

  it("travels to an explored belt after planning", () => {
    const state: State = {
      ...initialState,
      currentShipAction: {
        type: "planning",
      },
      belts: {
        "belt-2": {
          scanned: true,
          cargo: [],
          ships: [],
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    expect(result.currentShipAction).toEqual<ShipAction>({
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
      currentShipAction: {
        type: "traveling",
        destination: {
          id: "belt-2",
          systemIndex: 0,
        },
      },
      belts: {
        "belt-2": {
          scanned: true,
          cargo: [],
          ships: [],
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    expect(result.currentShipAction).toEqual<ShipAction>({
      type: "mining",
    });
  });

  it("collects ore after mining, when cargo is not full", () => {
    const state: State = {
      ...initialState,
      currentShipLocation: {
        id: "belt-2",
        systemIndex: 0,
      },
      currentShipAction: {
        type: "mining",
      },
      belts: {
        "belt-2": {
          scanned: true,
          cargo: [],
          ships: [],
        },
      },
    };
    const result = produce(state, (draft) => {
      updateMining(draft, 1000);
    });
    expect(result.currentShipAction).toEqual<ShipAction>({
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
        currentShipLocation: {
          id: "belt-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "collecting",
        },
        belts: {
          "belt-2": {
            scanned: true,
            cargo: [{ id: "gold-ore", count: 1 }],
            ships: [],
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "mining",
      });
      expect(result.ships[result.currentShipId]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 1 },
      ]);
      expect(result.belts["belt-2"]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 0 },
      ]);
    });

    it("collects when more ore is available and cargo is not full", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "belt-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "collecting",
        },
        belts: {
          "belt-2": {
            scanned: true,
            cargo: [{ id: "gold-ore", count: 3 }],
            ships: [],
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "collecting",
      });
      expect(result.ships[result.currentShipId]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 1 },
      ]);
      expect(result.belts["belt-2"]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 2 },
      ]);
    });

    it("travels to a station when cargo is full", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "belt-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "collecting",
        },
        stations: {
          "station-2": {
            scanned: true,
          },
        },
        belts: {
          "belt-2": {
            scanned: true,
            cargo: [{ id: "gold-ore", count: 4 }],
            ships: [],
          },
        },
        ships: {
          "ship-1": {
            id: "ship-1",
            cargo: [{ id: "gold-ore", count: 4 }],
            shipId: "light-fighter-1",
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "traveling",
        destination: {
          id: "station-2",
          systemIndex: 0,
        },
      });
      expect(result.ships[result.currentShipId]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 5 },
      ]);
      expect(result.belts["belt-2"]?.cargo).toEqual<OwnedCargo[]>([
        { id: "gold-ore", count: 3 },
      ]);
    });
  });

  describe("after traveling to a station", () => {
    it("docks at the station", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "belt-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "traveling",
          destination: {
            id: "station-2",
            systemIndex: 0,
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "docking",
      });
      expect(result.currentShipLocation).toEqual<ShipLocation>({
        id: "station-2",
        systemIndex: 0,
      });
    });
  });

  describe("after docking at a station", () => {
    it("sells cargo if any can be sold", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "station-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "docking",
        },
        ships: {
          "ship-1": {
            id: "ship-1",
            shipId: "light-fighter-1",
            cargo: [
              { id: "iron-bars", count: 1 },
              { id: "gold-ore", count: 4 },
            ],
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "selling",
      });
    });
  });

  describe("after selling at a station", () => {
    it("sells cargo if any can be sold", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "station-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "selling",
        },
        ships: {
          "ship-1": {
            id: "ship-1",
            shipId: "light-fighter-1",
            cargo: [
              { id: "iron-bars", count: 1 },
              { id: "gold-ore", count: 4 },
            ],
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "selling",
      });
      expect(result.player.credits).toEqual(9);
      expect(result.ships[result.currentShipId].cargo).toEqual<OwnedCargo[]>([
        { id: "iron-bars", count: 1 },
        { id: "gold-ore", count: 3 },
      ]);
    });

    it("launches if no cargo can be sold", () => {
      const state: State = {
        ...initialState,
        currentShipLocation: {
          id: "station-2",
          systemIndex: 0,
        },
        currentShipAction: {
          type: "selling",
        },
        ships: {
          "ship-1": {
            id: "ship-1",
            shipId: "light-fighter-1",
            cargo: [
              { id: "iron-bars", count: 1 },
              { id: "gold-ore", count: 0 },
            ],
          },
        },
      };
      const result = produce(state, (draft) => {
        updateMining(draft, 1000);
      });
      expect(result.currentShipAction).toEqual<ShipAction>({
        type: "launching",
      });
    });
  });
});
