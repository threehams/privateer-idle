type ReadyAction = { type: "READY" };
type IncrementAction = { type: "INCREMENT" };
type AutoIncrementAction = { type: "AUTO_INCREMENT" };
type ResetGameAction = { type: "RESET_GAME" };

export type ReduxAction =
  | ReadyAction
  | IncrementAction
  | AutoIncrementAction
  | ResetGameAction;
