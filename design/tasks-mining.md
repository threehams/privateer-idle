# Tasks: Mining

Mining task is about finding the best available ore in a system, traveling to the belt, shooting a rock, collecting anything valuable, and traveling to a station to sell it.

After each loop, the best available ore is recalculated.

# Chart

## Idle

If in a station, and cargo hold is not empty, sell off any cargo.

If in a station, launch.

If not in a station, plan.

## Planning

Planning is always done in space (for simplicity).

If cargo hold is not empty, find the best available belt. Calculate the $/hour based on ore mining speed

// if idle
// if in a station
// launch
// else
// plan
// if launching
// plan
// if planning
// travel to most valuable belt in system
// if traveling
// if destination is belt
// mine
// if destination is station
// dock
// else
// idle
// if mining
// if cargo is full
// travel to most valuable station for cargo
// collect
// if collecting
// if cargo is full
// travel to most valuable station for cargo
// mine
// else
// idle
