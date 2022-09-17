import { BeltData } from "@space/data";
import { Cargo } from "./Cargo";
import { ShipId } from "./Ship";

export type Belt = BeltData & {
  cargo: Cargo[];
  ships: ShipId[];
  scanned: boolean;
};
