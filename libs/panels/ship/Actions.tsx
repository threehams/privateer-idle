import { Button } from "@thing/ui";
import React from "react";
import { useDispatch, useSelector } from "@thing/store";

export const Actions = () => {
  const autoIncrement = useSelector((state) => state.autoIncrement);
  const dispatch = useDispatch();
  return (
    <>
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
        Make a thing maker (costs {(autoIncrement + 1) * 10} things)
      </Button>
    </>
  );
};
