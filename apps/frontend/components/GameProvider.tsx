import React from "react";
import { useWorker } from "@thing/worker";
import { DispatchProvider, StateProvider } from "./StateProvider";
import { Game } from "./Game";

const children = <Game />;

export const GameProvider = () => {
  const { state, dispatch } = useWorker();

  if (!state) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        Loading...
      </div>
    );
  }

  return (
    <StateProvider value={state}>
      <DispatchProvider value={dispatch}>{children}</DispatchProvider>
    </StateProvider>
  );
};
