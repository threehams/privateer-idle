import { StateAction, State } from "@space/store";
import { useMemo, useCallback, useState, useEffect } from "react";
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
    if (!state) {
      return;
    }
    setState(applyPatches(state, action.payload));
  };

  const dispatch = useCallback((message: StateAction) => {
    worker?.postMessage(message);
  }, []);

  useEffect(() => {
    dispatch({ type: "READY" });
  }, [dispatch]);

  return useMemo(
    () => ({
      dispatch,
      state,
    }),
    [dispatch, state],
  );
};
