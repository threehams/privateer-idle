export type PlanetId = string;
export type Planet = {
  id: PlanetId;
  name: string;
  type: "planet";
  stationId?: string;
  systemIndex: number;
  moonIds: string[];
};

export const planets: { [Key in PlanetId]: Planet } = {
  "planet-1": {
    id: "planet-1",
    name: "Mercury",
    systemIndex: 0,
    moonIds: [],
    type: "planet",
  },
  "planet-2": {
    id: "planet-2",
    name: "Venus",
    systemIndex: 0,
    moonIds: [],
    type: "planet",
  },
  "planet-3": {
    id: "planet-3",
    name: "Earth",
    systemIndex: 0,
    moonIds: [],
    type: "planet",
    stationId: "station-1",
  },
  "planet-4": {
    id: "planet-4",
    name: "Mars",
    systemIndex: 0,
    moonIds: [],
    type: "planet",
    stationId: "station-2",
  },
  "planet-5": {
    id: "planet-5",
    name: "Jupiter",
    systemIndex: 0,
    moonIds: [],
    type: "planet",
  },
};
