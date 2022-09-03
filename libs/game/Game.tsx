import React from "react";
import { Actions } from "@thing/panels/ship";
import { Reset } from "./Reset";
import { Status } from "../panels/ship/Status";

export const Game = () => {
  return (
    <div className="p-4">
      <Status className="mb-3" />
      <Actions />
      <Reset />
    </div>
  );
};
