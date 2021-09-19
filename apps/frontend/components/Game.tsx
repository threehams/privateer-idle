import React from "react";
import { useWorker } from "@thing/worker";
import { DispatchProvider, StateProvider } from "./StateProvider";
import { Status } from "./Status";
import { Actions } from "./Actions";
import { Reset } from "./Reset";

export const Game = () => {
  const { state, dispatch } = useWorker();

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <StateProvider value={state}>
      <DispatchProvider value={dispatch}>
        <Status />
        <Actions />
        <Reset />
      </DispatchProvider>
    </StateProvider>
  );
};
