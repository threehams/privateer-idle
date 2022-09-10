export type ShipId = string;
export type Ship = {
  name: string;
  id: ShipId;
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

export const ships: { [Key in ShipId]: Ship } = {
  "light-fighter-1": {
    name: "Stralthi",
    id: "light-fighter-1",
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
};
