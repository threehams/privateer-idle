type ReadyAction = { type: "READY" };
type IncrementAction = { type: "INCREMENT" };
type AutoIncrementAction = { type: "AUTO_INCREMENT" };
type ResetGameAction = { type: "RESET_GAME" };
type ImportGameAction = {
  type: "IMPORT_GAME";
  payload: {
    value: string;
  };
};

export type StateAction =
  | ReadyAction
  | ImportGameAction
  | IncrementAction
  | AutoIncrementAction
  | ResetGameAction;
