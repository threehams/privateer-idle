import { StarData } from "@space/data";
import { Cargo } from "./Cargo";

export type Star = StarData & {
  cargo: Cargo[];
  scanned: boolean;
};
