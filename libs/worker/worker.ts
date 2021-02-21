import { ReduxAction, State } from "@thing/store";
import { enablePatches, produceWithPatches } from "immer";
import localForage from "localforage";
import { eventHandler, gameLoop } from "./gameLoop";

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
    const initialState: State = {
      count: 0,
      autoIncrement: 0,
      timers: {
        autoIncrement: 0,
      },
    };
    const savedGame = (await localForage.getItem(savedGameKey)) as State;
    return savedGame ?? initialState;
  };

  let state = await getSavedGame();
  worker.postMessage({ type: "INITIAL", payload: state });

  setInterval(() => {
    localForage.setItem(savedGameKey, state);
  }, 5000);

  worker.addEventListener("message", (event: { data: ReduxAction }) => {
    const action = event.data;

    const [nextState, patches] = produceWithPatches(state, (draft) => {
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
