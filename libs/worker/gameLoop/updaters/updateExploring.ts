import { Updater } from "./Updater";
import { belts, planets, stars, stations, systems, times } from "@space/data";
import { ShipLocation, State, SystemEntity } from "@space/store";

export const updateExploring: Updater = (state, delta) => {
  state.timers.ship += delta;
  const time = times[state.currentShipAction.type];
  // calculate cost of current action for task

  if (state.timers.ship < time) {
    return;
  }
  state.timers.ship -= time;

  const action = state.currentShipAction;
  const currentLocation = findShipLocation(state.currentShipLocation);

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
      const entity = findEntity(state.currentShipLocation.id);
      switch (entity.type) {
        case "belt":
          state.belts[entity.id] ??= { scanned: true, cargo: [], ships: [] };
          state.belts[entity.id]!.scanned = true;
          break;
        case "planet":
          state.planets[entity.id] ??= { scanned: true, cargo: [], ships: [] };
          state.planets[entity.id]!.scanned = true;
          break;
        case "station":
          state.stations[entity.id] ??= { scanned: true };
          state.stations[entity.id]!.scanned = true;
          break;
        case "star":
          state.stars[entity.id] ??= { scanned: true };
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
      return findEntity(entityId);
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
