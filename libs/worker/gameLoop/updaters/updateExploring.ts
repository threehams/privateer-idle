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
  const time = times[state.currentShipAction.type];
  // calculate cost of current action for task

  if (state.timers.ship < time) {
    return;
  }
  state.timers.ship -= time;

  const action = state.currentShipAction;
  const currentLocation = findShipLocation(state, state.currentShipLocation);

  switch (action.type) {
    case "idling": {
      if (currentLocation.type === "station") {
        state.currentShipAction = {
          type: "launching",
        };
      } else {
        state.currentShipAction = {
          type: "planning",
        };
      }
      break;
    }
    case "launching": {
      state.currentShipAction = {
        type: "planning",
      };
      break;
    }
    case "planning": {
      const destination = findUnexploredLocation(state);
      if (!destination) {
        state.currentShipAction = {
          type: "blocked",
          reason: "FULLY_EXPLORED",
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
      break;
    }
    case "traveling": {
      state.currentShipLocation = action.destination;
      state.currentShipAction = {
        type: "scanning",
      };
      break;
    }
    case "scanning": {
      const entity = findOrCreateEntity(state, state.currentShipLocation.id);
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
      state.currentShipAction = { type: "planning" };
    }
  }
};

const findUnexploredLocation = (state: State): SystemEntity | undefined => {
  const currentSystem = systems[state.currentShipLocation.systemIndex];
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
