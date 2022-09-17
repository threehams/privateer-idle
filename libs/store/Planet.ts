import { PlanetData } from "@space/data";
import { Cargo } from "./Cargo";

export type Planet = PlanetData & {
  cargo: Cargo[];
  scanned: boolean;
};
