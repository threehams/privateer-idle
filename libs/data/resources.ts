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
      min: 15,
      max: 25,
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
      min: 30,
      max: 50,
    },
  },
  furniture: {
    id: "furniture",
    name: "Furniture",
    range: {
      min: 40,
      max: 60,
    },
  },
  semiconductors: {
    id: "semiconductors",
    name: "Semiconductors",
    range: {
      min: 100,
      max: 120,
    },
  },
};
