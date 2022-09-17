import { ShipData } from "@space/data";
import { Cargo } from "./Cargo";

export type ShipId = string;
export type Ship = ShipData & {
  id: ShipId;
  cargo: Cargo[];
};
