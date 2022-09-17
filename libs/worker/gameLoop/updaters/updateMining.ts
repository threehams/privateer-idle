import { Updater } from "./Updater";
import { times } from "@space/data";
import { Belt, OwnedCargo, Ship, ShipLocation, State } from "@space/store";
import { Station } from "libs/store/Station";
import { createBelt, createStation, findShipLocation } from "./entities";

export const updateMining: Updater = (state, delta) => {
  state.timers.ship += delta;
  const ship = state.ships[state.currentShipId];
  const time = times[ship.action.type];
  // calculate cost of current action for task

  if (state.timers.ship < time) {
    return;
  }
  state.timers.ship -= time;

  const currentLocation = findShipLocation(state, ship.location);
  switch (ship.action.type) {
    case "idling":
      if (currentLocation.type === "station") {
        ship.action = {
          type: "launching",
        };
      } else {
        ship.action = {
          type: "planning",
        };
      }
      break;
    case "launching":
      ship.action = {
        type: "planning",
      };
      break;
    case "planning":
      if (cargoCount(ship.cargo) > 0) {
        travelToSell(state);
        return;
      } else {
        const destination = findBelt(state);
        if (!destination) {
          ship.action = {
            type: "blocked",
            reason: "NO_BELT",
          };
          return;
        }
        ship.action = {
          type: "traveling",
          destination: {
            id: destination.id,
            systemIndex: destination.systemIndex,
          },
        };
      }
      break;
    case "traveling":
      ship.location = ship.action.destination;
      const destination = findShipLocation(state, ship.action.destination);
      switch (destination.type) {
        case "belt":
          ship.action = {
            type: "mining",
          };
          break;
        case "station":
          ship.action = {
            type: "docking",
          };
          break;
        default:
          ship.action = {
            type: "planning",
          };
      }
      break;
    case "selling": {
      if (currentLocation.type !== "station") {
        throw new Error("Attempted to mine something that wasn't a belt");
      }
      sellCargo(state);
      if (!canSellCargo(ship, currentLocation)) {
        ship.action = {
          type: "launching",
        };
      }
      break;
    }
    case "docking":
      if (cargoCount(ship.cargo) > 0) {
        ship.action = {
          type: "selling",
        };
      } else {
        ship.action = {
          type: "planning",
        };
      }
      break;
    case "mining": {
      if (currentLocation.type !== "belt") {
        throw new Error("Attempted to mine something that wasn't a belt");
      }
      const maxCargo = ship.stats.cargo;
      if (cargoCount(ship.cargo) >= maxCargo) {
        travelToSell(state);
        return;
      } else {
        dropOre(currentLocation);
        ship.action = {
          type: "collecting",
        };
      }
      break;
    }
    case "collecting": {
      if (currentLocation.type !== "belt") {
        throw new Error("attempted to collect ore outside a belt");
      }
      const maxCargo = ship.stats.cargo;
      collectOre(state, currentLocation);
      const cargoFull = cargoCount(ship.cargo) >= maxCargo;
      if (!cargoCount(currentLocation.cargo) && !cargoFull) {
        ship.action = {
          type: "mining",
        };
      }

      if (cargoFull) {
        travelToSell(state);
      }
      break;
    }
    default:
      // out of bounds for this task, so switch to idle to reset
      ship.action = {
        type: "idling",
      };
  }
};

const cargoCount = (cargo: OwnedCargo[]) => {
  return cargo.reduce((sum, item) => {
    return sum + item.count;
  }, 0);
};

const findSellStation = (
  state: State,
  cargo: OwnedCargo[],
): ShipLocation | undefined => {
  const ship = state.ships[state.currentShipId];
  const systemStations = findStations(state, ship.location.systemIndex);
  // eventually, look through available systems and calculate tradeoff:
  // distance
  // ore value (and time)
  // ore price at station
  //
  // later upgrades can use nearby systems (warp distance)
  for (const item of cargo) {
    for (const station of systemStations) {
      if (!station.scanned) {
        continue;
      }
      if (station.purchases.find((purchase) => purchase.id === item.id)) {
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
  const ship = state.ships[state.currentShipId];
  const systemBelts = findBelts(state, ship.location.systemIndex);
  for (const belt of systemBelts) {
    if (belt.scanned) {
      return belt;
    }
  }
};

/**
 * Look through all explored belts and find the best available to sell
 * or trade. Trading requires a pair of stations (so even more expensive!).
 */
const travelToSell = (state: State): void => {
  const ship = state.ships[state.currentShipId];
  const cargo = state.ships[state.currentShipId].cargo;
  const destination = findSellStation(state, cargo);
  if (!destination) {
    ship.action = {
      type: "blocked",
      reason: "NO_STATION",
    };
    return;
  }
  ship.action = {
    type: "traveling",
    destination: {
      id: destination.id,
      systemIndex: destination.systemIndex,
    },
  };
};

const sellCargo = (state: State) => {
  const ship = state.ships[state.currentShipId];
  const station = state.stations[ship.location.id];
  if (!station) {
    // why are we here? reset
    ship.action = { type: "idling" };
    return;
  }
  for (const purchase of station.purchases) {
    const available = ship.cargo.find((item) => item.id === purchase.id);
    if (available && available.count > 0) {
      available.count -= 1;
      state.player.credits += purchase.value;
      return;
    }
  }
  // unexpectedly ran out of stuff to sell
  ship.action = { type: "idling" };
};

const canSellCargo = (ship: Ship, station: Station) => {
  for (const purchase of station.purchases) {
    const available = ship.cargo.find((item) => item.id === purchase.id);
    if (available && available.count > 0) {
      return true;
    }
  }
  return false;
};

const dropOre = (belt: Belt): void => {
  const resourceId = belt.resources[0];
  const existing = belt.cargo.find((item) => item.id === resourceId);
  if (!existing) {
    belt.cargo.push({ id: resourceId, count: 1 });
    return;
  }
  existing.count += 1;
};

const collectOre = (state: State, belt: Belt): void => {
  const cargo = belt.cargo;
  const available = cargo[0];
  const ship = state.ships[state.currentShipId];
  if (available && available.count > 0) {
    const id = available.id;
    const currentCargo = ship.cargo.find((item) => item.id === id);
    if (currentCargo) {
      currentCargo.count += 1;
    } else {
      ship.cargo.push({ id, count: 1 });
    }
    available.count -= 1;
  } else {
    if (cargoCount(cargo) >= ship.stats.cargo) {
      travelToSell(state);
    } else {
      ship.action = {
        type: "mining",
      };
    }
  }
};

const findBelts = (state: State, systemIndex: number): Belt[] => {
  const system = state.systems[systemIndex];
  return system.entityIds.map((id) => {
    state.belts[id] ??= createBelt(id);
    return state.belts[id]!;
  });
};

const findStations = (state: State, systemIndex: number): Station[] => {
  const system = state.systems[systemIndex];
  return system.entityIds.map((id) => {
    state.stations[id] ??= createStation(id);
    return state.stations[id]!;
  });
};
