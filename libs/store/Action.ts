type IncrementAction = { type: "INCREMENT" };
type AutoIncrementAction = { type: "AUTO_INCREMENT" };

export type ReduxAction = IncrementAction | AutoIncrementAction;
