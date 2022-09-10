export type System = {
  name: string;
  index: number;
  size: number;
  // anything that can exist within a system
  entityIds: string[];
};

export const systems: System[] = [
  {
    name: "Sol",
    index: 0,
    size: 3,
    entityIds: [
      "star-1",
      "planet-1",
      "planet-2",
      "planet-3",
      "planet-4",
      "planet-5",
      "station-1",
      "station-2",
      "belt-1",
      "belt-2",
    ],
  },
];
