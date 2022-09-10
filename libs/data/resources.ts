export type ResourceId = string;
export type Resource = {
  name: string;
  id: ResourceId;
  range: {
    min: number;
    max: number;
  };
};

export const resources: { [Key in ResourceId]: Resource } = {
  "iron-ore": {
    id: "iron-ore",
    name: "Iron Ore",
    range: {
      min: 1,
      max: 10,
    },
  },
  "gold-ore": {
    id: "gold-ore",
    name: "Gold Ore",
    range: {
      min: 50,
      max: 90,
    },
  },
  "iron-bars": {
    id: "iron-bars",
    name: "Iron Bars",
    range: {
      min: 5,
      max: 20,
    },
  },
  "gold-bars": {
    id: "gold-bars",
    name: "Gold Bars",
    range: {
      min: 150,
      max: 270,
    },
  },
};
