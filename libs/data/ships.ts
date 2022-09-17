export type ShipKey = string;
export type ShipData = {
  name: string;
  key: ShipKey;
  stats: {
    speed: number;
    cargo: number;
    shields: number;
    hull: number;
    fuel: number;
    hardpoints: {
      gun: number;
      missile: number;
      torpedo: number;
      countermeasures: number;
    };
  };
};

export const ships: { [Key in ShipKey]: ShipData } = {
  "light-fighter-1": {
    name: "Stralthi",
    key: "light-fighter-1",
    stats: {
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
  },
};
