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
  purchases: { id: ResourceId; value: number }[];
  systemIndex: number;
  /** Planet, moon, or belt ID */
  locationId: string;
};

export const stations: { [Key in StationId]: Station } = {
  "station-1": {
    name: "Hearth",
    id: "station-1",
    variant: "industrial",
    purchases: [
      { id: "iron-bars", value: 10 },
      { id: "gold-bars", value: 20 },
    ],
    systemIndex: 0,
    type: "station",
    locationId: "planet-3",
  },
  "station-2": {
    name: "Defiance",
    id: "station-2",
    variant: "refinery",
    purchases: [
      { id: "iron-ore", value: 3 },
      { id: "gold-ore", value: 9 },
    ],
    systemIndex: 0,
    type: "station",
    locationId: "planet-4",
  },
};
