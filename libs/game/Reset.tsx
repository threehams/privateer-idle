import useStateMachine from "@cassiozen/usestatemachine";
import { Button } from "@space/ui";
import React from "react";
import { useDispatch } from "../store/StateProvider";

export const Reset = () => {
  const dispatch = useDispatch();
  const [resetState, send] = useStateMachine({
    initial: "inactive",
    states: {
      inactive: {
        on: {
          RESET: "requiresConfirmation",
        },
      },
      requiresConfirmation: {
        on: {
          CONFIRM: "reset",
          CANCEL: "inactive",
        },
      },
      reset: {
        on: {
          INACTIVE: "inactive",
        },
        effect: ({ send: sendEvent }) => {
          dispatch({ type: "RESET_GAME" });
          sendEvent("INACTIVE");
        },
      },
    },
  });

  return (
    <>
      {resetState.value === "inactive" && (
        <Button
          variant="danger"
          onClick={() => {
            send("RESET");
          }}
        >
          Reset
        </Button>
      )}
      {resetState.value === "requiresConfirmation" && (
        <>
          <Button
            variant="danger"
            onClick={() => {
              send("CONFIRM");
            }}
          >
            Confirm Reset
          </Button>
          <Button
            onClick={() => {
              send("CANCEL");
            }}
          >
            Cancel
          </Button>
        </>
      )}
    </>
  );
};
