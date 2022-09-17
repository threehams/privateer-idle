import { Updater } from "./Updater";
import {
  Belt,
  belts,
  planets,
  ships,
  stars,
  Station,
  stations,
  systems,
  times,
} from "@space/data";
import {
  OwnedCargo,
  OwnedShip,
  ShipLocation,
  State,
  SystemEntity,
} from "@space/store";

export const updateTrading: Updater = (state, delta) => {
  state.timers.ship += delta;
  const time = times[state.currentShipAction.type];

  if (state.timers.ship < time) {
    return;
  }
  state.timers.ship -= time;

  const ship = state.ships[state.currentShipId];
  const action = state.currentShipAction;
  const currentLocation = findShipLocation(state.currentShipLocation);

  switch (action.type) {
    case "idling":
      state.currentShipAction = {
        type: "planning",
      };
      break;
    case "launching":
      state.currentShipAction = {
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
          state.currentShipAction = {
            type: "blocked",
            reason: "NO_BELT",
          };
          return;
        }
        state.currentShipAction = {
          type: "traveling",
          destination: {
            id: destination.id,
            systemIndex: destination.systemIndex,
          },
        };
      }
      break;
    case "traveling":
      state.currentShipLocation = action.destination;
      const destination = findShipLocation(action.destination);
      switch (destination.type) {
        case "belt":
          state.currentShipAction = {
            type: "mining",
          };
          break;
        case "station":
          state.currentShipAction = {
            type: "docking",
          };
          break;
        default:
          state.currentShipAction = {
            type: "planning",
          };
      }
      break;
    case "selling": {
      const station = findShipLocation(state.currentShipLocation);
      if (station.type !== "station") {
        throw new Error("Attempted to mine something that wasn't a belt");
      }
      sellCargo(state);
      if (!canSellCargo(ship, station)) {
        state.currentShipAction = {
          type: "launching",
        };
      }
      break;
    }
    case "docking":
      if (cargoCount(ship.cargo) > 0) {
        state.currentShipAction = {
          type: "selling",
        };
      } else {
        state.currentShipAction = {
          type: "planning",
        };
      }
      break;
    case "mining": {
      if (currentLocation.type !== "belt") {
        throw new Error("Attempted to mine something that wasn't a belt");
      }
      const maxCargo = ships[ship.shipId].cargo;
      if (cargoCount(ship.cargo) >= maxCargo) {
        travelToSell(state);
        return;
      } else {
        dropOre(state, currentLocation);
        state.currentShipAction = {
          type: "collecting",
        };
      }
      break;
    }
    case "collecting": {
      const belt = findShipLocation(state.currentShipLocation);
      if (belt.type !== "belt") {
        throw new Error("attempted to collect ore outside a belt");
      }
      const maxCargo = ships[ship.shipId].cargo;
      collectOre(state, belt);
      const cargoFull = cargoCount(ship.cargo) >= maxCargo;
      if (!cargoCount(state.belts[belt.id]?.cargo ?? []) && !cargoFull) {
        state.currentShipAction = {
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
      state.currentShipAction = {
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
  const systemBelts = findBelts(state.currentShipLocation.systemIndex);
  for (const belt of systemBelts) {
    if (state.belts[belt.id]?.scanned) {
      return belt;
    }
  }
};

/**
 * Look through all explored belts and find the best available to sell
 * or trade. Trading requires a pair of stations (so even more expensive!).
 */
const travelToSell = (state: State): void => {
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
    destination: {
      id: destination.id,
      systemIndex: destination.systemIndex,
    },
  };
};

const sellCargo = (state: State) => {
  const station = stations[state.currentShipLocation.id];
  if (!station) {
    // why are we here? reset
    state.currentShipAction = { type: "idling" };
    return;
  }
  const ship = state.ships[state.currentShipId];
  for (const purchase of station.purchases) {
    const available = ship.cargo.find((item) => item.id === purchase.id);
    if (available && available.count > 0) {
      available.count -= 1;
      state.player.credits += purchase.value;
      return;
    }
  }
  // unexpectedly ran out of stuff to sell
  state.currentShipAction = { type: "idling" };
};

const canSellCargo = (ship: OwnedShip, station: Station) => {
  for (const purchase of station.purchases) {
    const available = ship.cargo.find((item) => item.id === purchase.id);
    if (available && available.count > 0) {
      return true;
    }
  }
  return false;
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
  const cargo = state.belts[belt.id]?.cargo ?? [];
  const available = cargo?.[0];
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
    if (cargoCount(cargo) >= ships[ship.shipId].cargo) {
      travelToSell(state);
    } else {
      state.currentShipAction = {
        type: "mining",
      };
    }
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
