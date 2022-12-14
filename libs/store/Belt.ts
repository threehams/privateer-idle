import { BeltData } from "@space/data";
import { Cargo } from "./Cargo";

export type Belt = BeltData & {
  cargo: Cargo[];
  scanned: boolean;
};
