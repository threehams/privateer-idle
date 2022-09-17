import {
  BeltId,
  PlanetId,
  ResourceId,
  StationId,
  StarId,
  System,
} from "@space/data";
import { Ship, ShipId } from "./Ship";
import { Belt } from "./Belt";
import { Station } from "./Station";
import { Planet } from "./Planet";
import { Star } from "./Star";

export type Version = "0.1";

export type Task = "mining" | "trading" | "fighting" | "exploring";
export type SystemEntity = Belt | Planet | Station | Star;

export type OwnedCargo = {
  id: ResourceId;
  count: number;
};

export type ShipLocation = {
  systemIndex: number;
  id: string;
};

type BlockedReason =
  | "NO_BELT"
  | "NO_TRADE"
  | "NO_STATION"
  | "FULLY_EXPLORED"
  | "TOO_DANGEROUS";

export type ShipAction =
  | { type: "blocked"; reason: BlockedReason }
  | { type: "idling" }
  | { type: "launching" }
  | { type: "planning" }
  | { type: "traveling"; destination: ShipLocation }
  | { type: "warping"; destination: number }
  | { type: "docking" }
  | { type: "selling" }
  | { type: "buying" }
  | { type: "scanning" }
  | { type: "mining" }
  | { type: "collecting" };

export type State = {
  version: Version;
  currentTask: Task;
  currentShipId: string;
  currentShipAction: ShipAction;
  currentShipLocation: ShipLocation;
  player: {
    credits: number;
  };
  timers: {
    ship: number;
  };
  ships: {
    [Id in ShipId]: Ship;
  };
  belts: Partial<{
    [Id in BeltId]: Belt;
  }>;
  planets: Partial<{
    [Id in PlanetId]: Planet;
  }>;
  stars: Partial<{
    [Id in StarId]: Star;
  }>;
  stations: Partial<{
    [Id in StationId]: Station;
  }>;
  systems: System[];
};
