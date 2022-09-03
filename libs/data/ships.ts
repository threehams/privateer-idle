import { Ship } from "@thing/store";

export const ships: Ship[] = [
  {
    name: "Stralthi",
    key: "light-fighter-1",
    cargo: 5,
    speed: 6,
    fuel: 0,
    hull: 20,
    shields: 30,
    hardpoints: {
      gun: 2,
      missile: 1,
      torpedo: 0,
      countermeasures: 1,
    },
  },
];
