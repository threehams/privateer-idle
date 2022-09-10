import { Updater } from "./Updater";
import {
  Belt,
  belts,
  planets,
  ships,
  stars,
  stations,
  systems,
  times,
} from "@space/data";
import { OwnedCargo, ShipLocation, State, SystemEntity } from "@space/store";

export const updateMining: Updater = (state, delta) => {
  state.timers.ship += delta;
  const time = times[state.currentShipAction.type];
  // calculate cost of current action for task

  if (state.timers.ship < time) {
    return;
  }
  state.timers.ship -= time;

  const ship = state.ships[state.currentShipId];
  const action = state.currentShipAction;
  const currentLocation = findShipLocation(state.currentShipLocation);
  switch (action.type) {
    case "idling":
      if (currentLocation.type === "station") {
        state.currentShipAction = {
          type: "launching",
        };
      }
      break;
    case "launching":
      state.currentShipAction = {
        type: "planning",
      };
      break;
    case "planning":
      if (ship.cargo.length > 0) {
        sellCargo(state);
        return;
      } else {
        const destination = findBelt(state);
        if (!destination) {
          state.currentShipAction = {
            type: "blocked",
            reason: "NO_BELT",
          };
          return;
        }
        state.currentShipAction = {
          type: "traveling",
          destination,
        };
      }
      break;
    case "traveling":
      state.currentShipLocation = action.destination;
      switch (currentLocation.type) {
        case "belt":
          state.currentShipAction = {
            type: "mining",
          };
          break;
        case "station":
          if (ship.cargo.length > 0) {
            state.currentShipAction = {
              type: "docking",
            };
          } else {
            state.currentShipAction = {
              type: "planning",
            };
          }
          break;
        default:
          state.currentShipAction = {
            type: "planning",
          };
      }
      break;
    case "docking":
      if (ship.cargo.length > 0) {
        state.currentShipAction = {
          type: "selling",
        };
      } else {
        state.currentShipAction = {
          type: "planning",
        };
      }
      break;
    case "mining":
      if (currentLocation.type !== "belt") {
        state.currentShipAction = {
          type: "idling",
        };
        return;
      }
      if (ship.cargo.length > 0) {
        sellCargo(state);
        return;
      } else {
        dropOre(state, currentLocation);
        state.currentShipAction = {
          type: "collecting",
        };
      }
      break;
    case "collecting": {
      if (currentLocation.type !== "belt") {
        state.currentShipAction = {
          type: "idling",
        };
        return;
      }
      const maxCargo = ships.find((s) => s.id === ship.id)?.cargo ?? 0;
      collectOre(state, currentLocation);
      if (ship.cargo.length >= maxCargo) {
        sellCargo(state);
      }
      break;
    }
    default:
      // out of bounds for this task, so switch to idle to reset
      state.currentShipAction = {
        type: "idling",
      };
  }
};

const findSellStation = (
  state: State,
  cargo: OwnedCargo[],
): ShipLocation | undefined => {
  const systemStations = findStations(state.currentShipLocation.systemIndex);
  // eventually, look through available systems and calculate tradeoff:
  // distance
  // ore value (and time)
  // ore price at station
  //
  // later upgrades can use nearby systems (warp distance)
  for (const item of cargo) {
    for (const station of systemStations) {
      if (!state.stations[station.id]?.scanned) {
        continue;
      }
      if (station.purchases.includes(item.id)) {
        return station;
      }
    }
  }
  return undefined;
};

/**
 * Look through all explored belts and find the best available one for mining.
 */
const findBelt = (state: State): Belt | undefined => {
  const systemBelts = findBelts(state.currentShipLocation.systemIndex);
  return systemBelts[0];
};

/**
 * Look through all explored belts and find the best available to sell
 * or trade. Trading requires a pair of stations (so even more expensive!).
 */
const sellCargo = (state: State): void => {
  const cargo = state.ships[state.currentShipId].cargo;
  const destination = findSellStation(state, cargo);
  if (!destination) {
    state.currentShipAction = {
      type: "blocked",
      reason: "NO_STATION",
    };
    return;
  }
  state.currentShipAction = {
    type: "traveling",
    destination,
  };
};

const dropOre = (state: State, belt: Belt): void => {
  state.belts[belt.id] ??= { cargo: [], scanned: false, ships: [] };
  const resourceId = belts[belt.id].resources[0];
  const existing = state.belts[belt.id]?.cargo.find(
    (item) => item.id === resourceId,
  );
  if (!existing) {
    state.belts[belt.id]?.cargo.push({ id: resourceId, count: 1 });
    return;
  }
  existing.count += 1;
};
const collectOre = (state: State, belt: Belt): void => {
  const cargo = state.belts[belt.id]?.cargo;
  const available = cargo?.[0];
  if (available) {
    const id = available.id;
    const currentCargo = state.ships[state.currentShipId].cargo.find(
      (item) => item.id === id,
    );
    if (currentCargo) {
      currentCargo.count += 1;
    } else {
      state.ships[state.currentShipId].cargo.push({ id, count: 1 });
    }
    available.count -= 1;
  }
};

const findShipLocation = (location: ShipLocation): SystemEntity => {
  const system = systems[location.systemIndex];
  const found = system.entityIds.find((id) => id === location.id);
  if (!found) {
    throw new Error(
      `no entity found with id ${location.id} in system ${location.systemIndex}`,
    );
  }

  return findEntity(found);
};
const findEntity = (entityId: string): SystemEntity => {
  const entity =
    stations[entityId] ??
    belts[entityId] ??
    planets[entityId] ??
    stars[entityId];
  if (!entity) {
    throw new Error(`no entity found with id ${entityId}`);
  }
  return entity;
};

const findBelts = (systemIndex: number) => {
  const system = systems[systemIndex];
  return system.entityIds.map((id) => belts[id]).filter(Boolean);
};

const findStations = (systemIndex: number) => {
  const system = systems[systemIndex];
  return system.entityIds.map((id) => stations[id]).filter(Boolean);
};
