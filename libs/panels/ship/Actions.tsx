import { Button } from "@space/ui";
import React from "react";
import { useDispatch, useSelector } from "@space/store";

export const Actions = () => {
  const currentTask = useSelector((state) => state.currentTask);
  const dispatch = useDispatch();
  return (
    <>
      <Button
        onClick={() => {
          dispatch({ type: "SELECT_TASK", payload: { task: "mining" } });
        }}
        active={currentTask === "mining"}
      >
        Mining
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: "SELECT_TASK", payload: { task: "trading" } });
        }}
        active={currentTask === "trading"}
      >
        Trading
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: "SELECT_TASK", payload: { task: "fighting" } });
        }}
        active={currentTask === "fighting"}
      >
        Fighting
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: "SELECT_TASK", payload: { task: "exploring" } });
        }}
        active={currentTask === "exploring"}
      >
        Exploring
      </Button>
    </>
  );
};
