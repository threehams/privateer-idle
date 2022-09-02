import { StateAction, State, initialState } from "@thing/store";
import { enablePatches, produceWithPatches } from "immer";
import localForage from "localforage";
import { eventHandler, gameLoop } from "./gameLoop";
import { migrateSave } from "./migrateSave";

const VERSION = 1;

const databaseName = "thing_game";
const savedGameKey = "saved_game";

localForage.config({
  version: VERSION,
  name: databaseName,
  storeName: databaseName,
});

enablePatches();
const worker = self as unknown as Worker;

const main = async () => {
  const getSavedGame = async () => {
    const savedGame = (await localForage.getItem(savedGameKey)) as State;
    if (!savedGame) {
      return initialState;
    }
    return migrateSave(savedGame);
  };

  let state = await getSavedGame();
  worker.postMessage({ type: "INITIAL", payload: state });

  setInterval(() => {
    localForage.setItem(savedGameKey, state);
  }, 5000);

  worker.addEventListener("message", (event: { data: StateAction }) => {
    const action = event.data;

    if (action.type === "READY") {
      worker.postMessage({ type: "INITIAL", payload: state });
    }
    const [nextState, patches] = produceWithPatches(state, (draft) => {
      if (action.type === "IMPORT_GAME") {
        localForage.setItem(savedGameKey, JSON.parse(action.payload.value));
        return;
      }
      if (action.type === "RESET_GAME") {
        localForage.removeItem(savedGameKey);
        return initialState;
      }
      return eventHandler(draft, action);
    });

    state = nextState;
    if (patches.length) {
      worker.postMessage({ type: "UPDATE", payload: patches });
    }
  });

  let previous: number | undefined = undefined;

  const loop = () => {
    const time = new Date().valueOf();
    if (previous === undefined) {
      previous = time;
    }
    const delta = time - previous;
    const [nextState, patches] = produceWithPatches(state, (draft) => {
      gameLoop(draft, delta);
    });

    state = nextState;
    if (patches.length) {
      worker.postMessage({ type: "UPDATE", payload: patches });
    }

    previous = time;
    requestAnimationFrame(loop);
  };

  loop();
};

main();
