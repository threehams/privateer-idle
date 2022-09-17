import {
  BeltId,
  Belt,
  PlanetId,
  Planet,
  ResourceId,
  ShipId,
  StationId,
  Station,
  Star,
  StarId,
} from "@space/data";

export type Version = "0.1";

export type Task = "mining" | "trading" | "fighting" | "exploring";
export type SystemEntity = Belt | Planet | Station | Star;

export type OwnedCargo = {
  id: ResourceId;
  count: number;
};
export type OwnedShip = {
  id: string;
  shipId: ShipId;
  cargo: OwnedCargo[];
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
    [Id in string]: OwnedShip;
  };
  belts: Partial<{
    [Id in BeltId]: {
      cargo: OwnedCargo[];
      ships: OwnedShip[];
      scanned: boolean;
    };
  }>;
  planets: Partial<{
    [Id in PlanetId]: {
      cargo: OwnedCargo[];
      ships: OwnedShip[];
      scanned: boolean;
    };
  }>;
  stars: Partial<{
    [Id in StarId]: {
      scanned: boolean;
    };
  }>;
  stations: Partial<{
    [Id in StationId]: {
      scanned: boolean;
    };
  }>;
};
