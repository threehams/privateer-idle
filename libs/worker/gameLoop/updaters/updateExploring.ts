import { Updater } from "./Updater";
import { systems, times } from "@space/data";
import { State, SystemEntity } from "@space/store";
import {
  findShipLocation,
  findOrCreateEntity,
  createBelt,
  createPlanet,
  createStation,
  createStar,
} from "./entities";

export const updateExploring: Updater = (state, delta) => {
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
    case "idling": {
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
    }
    case "launching": {
      ship.action = {
        type: "planning",
      };
      break;
    }
    case "planning": {
      const destination = findUnexploredLocation(state);
      if (!destination) {
        ship.action = {
          type: "blocked",
          reason: "FULLY_EXPLORED",
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
      break;
    }
    case "traveling": {
      ship.location = ship.action.destination;
      ship.action = {
        type: "scanning",
      };
      break;
    }
    case "scanning": {
      const entity = findOrCreateEntity(state, ship.location.id);
      switch (entity.type) {
        case "belt":
          state.belts[entity.id] ??= createBelt(entity.id);
          state.belts[entity.id]!.scanned = true;
          break;
        case "planet":
          state.planets[entity.id] ??= createPlanet(entity.id);
          state.planets[entity.id]!.scanned = true;
          break;
        case "station":
          state.stations[entity.id] ??= createStation(entity.id);
          state.stations[entity.id]!.scanned = true;
          break;
        case "star":
          state.stars[entity.id] ??= createStar(entity.id);
          state.stars[entity.id]!.scanned = true;
          break;
      }
      ship.action = { type: "planning" };
    }
  }
};

const findUnexploredLocation = (state: State): SystemEntity | undefined => {
  const ship = state.ships[state.currentShipId];
  const currentSystem = systems[ship.location.systemIndex];
  for (const entityId of currentSystem.entityIds) {
    const scanned =
      state.belts[entityId]?.scanned ||
      state.planets[entityId]?.scanned ||
      state.stars[entityId]?.scanned ||
      state.stations[entityId]?.scanned;

    if (!scanned) {
      return findOrCreateEntity(state, entityId);
    }
  }
};
