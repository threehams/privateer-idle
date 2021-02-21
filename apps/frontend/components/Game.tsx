import React from "react";
import { useWorker } from "@thing/worker";
import { Button } from "@thing/ui";

export const Game = () => {
  const { state, dispatch } = useWorker();

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        You have {state.count} thing{state.count === 1 ? "" : "s"}.{" "}
        {!!state.autoIncrement && (
          <>
            Making {state.autoIncrement} thing
            {state.autoIncrement === 1 ? "" : "s"} per second
          </>
        )}
      </div>
      <Button
        onClick={() => {
          dispatch({ type: "INCREMENT" });
        }}
      >
        Make a thing
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: "AUTO_INCREMENT" });
        }}
      >
        Make a thing maker (costs {(state.autoIncrement + 1) * 10} things)
      </Button>
    </div>
  );
};
