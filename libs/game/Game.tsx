import React from "react";
import { Actions } from "@space/panels/ship";
import { Reset } from "./Reset";
import { Status } from "../panels/ship/Status";
import { ImportGame } from "./ImportGame";
import { ExportGame } from "./ExportGame";

export const Game = () => {
  return (
    <div>
      <header className="flex items-center justify-between px-4 py-2">
        <div>Privateer Idle</div>
        <div>
          <ImportGame />
          <ExportGame />
          <Reset />
        </div>
      </header>
      <div className="px-4 py-2">
        <Status className="mb-3" />
        <Actions />
      </div>
    </div>
  );
};
