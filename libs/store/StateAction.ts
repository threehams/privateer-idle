import { Task } from "./State";

type ReadyAction = { type: "READY" };
type ResetGameAction = { type: "RESET_GAME" };
type ImportGameAction = {
  type: "IMPORT_GAME";
  payload: {
    value: string;
  };
};
type SelectTaskAction = {
  type: "SELECT_TASK";
  payload: {
    task: Task;
  };
};

export type StateAction =
  | ReadyAction
  | ImportGameAction
  | ResetGameAction
  | SelectTaskAction;
