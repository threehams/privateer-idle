type IncrementAction = { type: "INCREMENT" };
type AutoIncrementAction = { type: "AUTO_INCREMENT" };
type ResetGameAction = { type: "RESET_GAME" };

export type ReduxAction =
  | IncrementAction
  | AutoIncrementAction
  | ResetGameAction;
