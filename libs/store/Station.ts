import { StationData } from "@space/data";
import { Cargo } from "./Cargo";

export type Station = StationData & {
  scanned: boolean;
  cargo: Cargo[];
};
