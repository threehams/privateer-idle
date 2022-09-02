import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { StateAction, State } from "@thing/store";
import { createContext as reactCreateContext, useContext } from "react";

const StateContext = createContext<State>(undefined as any);
const DispatchContext = reactCreateContext<(action: StateAction) => void>(
  undefined as any,
);

export const StateProvider = StateContext.Provider;
export const useSelector = <TSelected extends unknown>(
  callback: (state: State) => TSelected,
): TSelected => {
  return useContextSelector(StateContext, callback);
};

export const DispatchProvider = DispatchContext.Provider;
export const useDispatch = () => {
  return useContext(DispatchContext);
};
