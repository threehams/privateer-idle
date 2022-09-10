import { ResourceId } from "./resources";

export type StationType =
  | "mining"
  | "agricultural"
  | "tourism"
  | "tech"
  | "industrial"
  | "service"
  | "refinery";

export type StationId = string;
export type Station = {
  id: StationId;
  name: string;
  type: "station";
  variant: StationType;
  purchases: ResourceId[];
  systemIndex: number;
  /** Planet, moon, or belt ID */
  locationId: string;
};

export const stations: { [Key in StationId]: Station } = {
  "station-1": {
    name: "Hearth",
    id: "station-1",
    variant: "industrial",
    purchases: ["iron-bars", "gold-bars"],
    systemIndex: 0,
    type: "station",
    locationId: "planet-3",
  },
  "station-2": {
    name: "Defiance",
    id: "station-2",
    variant: "refinery",
    purchases: ["iron-ore", "gold-ore"],
    systemIndex: 0,
    type: "station",
    locationId: "planet-4",
  },
};
