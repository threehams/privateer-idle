import { Updater } from "./Updater";
import { ResourceId, times } from "@space/data";
import { findShipLocation, findStations } from "./entities";
import { Ship, State, Station } from "@space/store";

export const updateTrading: Updater = (state, delta) => {
  state.timers.ship += delta;
  const ship = state.ships[state.currentShipId];
  const time = times[ship.action.type];
  // calculate cost of current action for task

  if (state.timers.ship < time) {
    return;
  }
  state.timers.ship -= time;

  const currentLocation = findShipLocation(state, ship.location);
  switch (ship.action.type) {
    case "idling":
      if (currentLocation.type === "station") {
        ship.action = {
          type: "launching",
        };
      } else {
        ship.action = {
          type: "planning",
        };
      }
      break;
    case "launching": {
      ship.action = {
        type: "planning",
      };
      break;
    }
    case "planning": {
      const route = findTrade(state, ship);
      if (!route) {
        ship.action = {
          type: "blocked",
          reason: "NO_TRADE",
        };
        return;
      }
      ship.tradeQueue = [
        {
          stationId: route.start.id,
          resourceId: route.resourceId,
          type: "buy",
        },
        {
          stationId: route.end.id,
          resourceId: route.resourceId,
          type: "sell",
        },
      ];
      ship.action = {
        type: "traveling",
        destination: {
          id: route.start.id,
          systemIndex: route.end.systemIndex,
        },
      };
      break;
    }
    default:
      // out of bounds for this task, so switch to idle to reset
      ship.action = {
        type: "idling",
      };
  }
};

type TradeRoute = {
  start: Station;
  end: Station;
  resourceId: ResourceId;
};
export const findTrade = (state: State, ship: Ship): TradeRoute | undefined => {
  const stations = findStations(state, ship.location.systemIndex);
  let bestTrade:
    | {
        start: Station;
        end: Station;
        resourceId: ResourceId;
        value: number;
      }
    | undefined;

  for (const buyStation of stations) {
    if (!buyStation.scanned) {
      continue;
    }
    for (const purchase of buyStation.sells) {
      for (const sellStation of stations) {
        if (!sellStation.scanned) {
          continue;
        }
        for (const sale of sellStation.purchases) {
          const profit = sale.value - purchase.value;
          const distance =
            Math.abs(ship.location.systemIndex - buyStation.systemIndex) +
            Math.abs(buyStation.systemIndex - sellStation.systemIndex) +
            1;
          if (sale.id === purchase.id && profit > 0) {
            // too simplified, tweak this over time
            const value = profit / distance;
            if (value > (bestTrade?.value ?? 0)) {
              bestTrade = {
                start: buyStation,
                end: sellStation,
                resourceId: purchase.id,
                value,
              };
            }
          }
        }
      }
    }
  }
  return bestTrade;
};
