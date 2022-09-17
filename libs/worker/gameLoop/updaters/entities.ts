import {
  systems,
  BeltId,
  belts,
  StationId,
  stations,
  PlanetId,
  planets,
  StarId,
  stars,
} from "@space/data";
import { State, ShipLocation, SystemEntity, Belt } from "@space/store";
import { Planet } from "@space/store";
import { Star } from "@space/store";
import { Station } from "@space/store";

export const findShipLocation = (
  state: State,
  location: ShipLocation,
): SystemEntity => {
  const system = systems[location.systemIndex];
  const found = system.entityIds.find((id) => id === location.id);
  if (!found) {
    throw new Error(
      `no entity found with id ${location.id} in system ${location.systemIndex}`,
    );
  }

  return findOrCreateEntity(state, found);
};

// consider changing to a flat list of entities, this is kind of miserable
export const findOrCreateEntity = (
  state: State,
  entityId: string,
): SystemEntity => {
  const entity =
    state.stations[entityId] ??
    state.belts[entityId] ??
    state.planets[entityId] ??
    state.stars[entityId];

  if (entity) {
    return entity;
  }
  if (stations[entityId]) {
    state.stations[entityId] = createStation(entityId);
    return state.stations[entityId]!;
  }
  if (belts[entityId]) {
    state.belts[entityId] = createBelt(entityId);
    return state.belts[entityId]!;
  }
  if (planets[entityId]) {
    state.planets[entityId] = createPlanet(entityId);
    return state.planets[entityId]!;
  }
  if (stars[entityId]) {
    state.stars[entityId] = createStar(entityId);
    return state.stars[entityId]!;
  }

  throw new Error(`no entity found with id ${entityId}`);
};

export const createBelt = (id: BeltId): Belt => {
  return {
    ...belts[id],
    cargo: [],
    scanned: false,
  };
};

export const createStation = (id: StationId): Station => {
  return {
    ...stations[id],
    cargo: [],
    scanned: false,
  };
};

export const createPlanet = (id: PlanetId): Planet => {
  return {
    ...planets[id],
    cargo: [],
    scanned: false,
  };
};

export const createStar = (id: StarId): Star => {
  return {
    ...stars[id],
    cargo: [],
    scanned: false,
  };
};
