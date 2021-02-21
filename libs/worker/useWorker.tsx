import { ReduxAction, State } from "@thing/store";
import { useMemo, useCallback, useState } from "react";
import { applyPatches, enablePatches } from "immer";
import { Message } from "./types";

const worker = (
  typeof window === "undefined"
    ? undefined
    : new Worker(new URL("./worker.ts", import.meta.url))
) as Worker;

enablePatches();

export const useWorker = () => {
  const [state, setState] = useState<State | undefined>(undefined);

  worker.onmessage = (event: { data: Message }) => {
    const action = event.data;
    if (action.type === "INITIAL") {
      setState(action.payload);
      return;
    }
    setState(applyPatches(state!, action.payload));
  };

  const dispatch = useCallback((message: ReduxAction) => {
    worker?.postMessage(message);
  }, []);

  return useMemo(
    () => ({
      dispatch,
      state,
    }),
    [dispatch, state],
  );
};
