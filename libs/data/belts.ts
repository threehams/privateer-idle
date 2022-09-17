import { ResourceId } from "./resources";

export type BeltId = string;
export type BeltData = {
  id: BeltId;
  type: "belt";
  name: string;
  systemIndex: number;
  resources: ResourceId[];
};

export const belts: { [Key in BeltId]: BeltData } = {
  "belt-1": {
    id: "belt-1",
    name: "Oort Cloud",
    type: "belt",
    systemIndex: 0,
    resources: ["iron-ore"],
  },

  "belt-2": {
    id: "belt-2",
    name: "Kuiper Belt",
    type: "belt",
    systemIndex: 0,
    resources: ["gold-ore"],
  },
};
