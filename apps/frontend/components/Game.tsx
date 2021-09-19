import React from "react";
import { Actions } from "./Actions";
import { Reset } from "./Reset";
import { Status } from "./Status";

export const Game = () => {
  return (
    <div className="p-4">
      <Status className="mb-3" />
      <Actions />
      <Reset />
    </div>
  );
};
