import { ResourceId, ShipData, StationId } from "@space/data";
import { Cargo } from "./Cargo";

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

export type ShipLocation = {
  systemIndex: number;
  id: string;
};

export type TradeQueueItem = {
  stationId: StationId;
  type: "buy" | "sell";
  resourceId: ResourceId;
};
export type ShipId = string;
export type Ship = ShipData & {
  id: ShipId;
  cargo: Cargo[];
  action: ShipAction;
  location: ShipLocation;
  tradeQueue: TradeQueueItem[];
};
