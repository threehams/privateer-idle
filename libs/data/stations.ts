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
export type StationData = {
  id: StationId;
  name: string;
  type: "station";
  variant: StationType;
  purchases: { id: ResourceId; value: number }[];
  sells: { id: ResourceId; value: number }[];
  systemIndex: number;
  /** Planet, moon, or belt ID */
  locationId: string;
};

export const stations: { [Key in StationId]: StationData } = {
  "station-1": {
    name: "Hearth",
    id: "station-1",
    variant: "industrial",
    purchases: [
      { id: "iron-bars", value: 15 },
      { id: "gold-bars", value: 35 },
    ],
    sells: [
      { id: "furniture", value: 45 },
      { id: "semiconductors", value: 105 },
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
    sells: [
      { id: "iron-bars", value: 10 },
      { id: "gold-bars", value: 20 },
    ],
    systemIndex: 0,
    type: "station",
    locationId: "planet-4",
  },
};
