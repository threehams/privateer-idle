export type Version = "0.1";

export type Task = "mining" | "trading" | "fighting";
export type Ship = {
  name: string;
  key: string;
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
export type Resource = {
  name: string;
  key: string;
  range: {
    min: number;
    max: number;
  };
};
type OwnedCargo = {
  key: string;
  count: number;
};
export type OwnedShip = {
  id: string;
  cargo: OwnedCargo[];
};

export type State = {
  version: Version;
  currentTask: Task;
  currentShip: string;
  timers: {
    mining: number;
  };
};
