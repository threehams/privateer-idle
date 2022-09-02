export type Version = "0.1";

export type State = {
  version: Version;
  count: number;
  autoIncrement: number;
  timers: {
    autoIncrement: number;
  };
};
