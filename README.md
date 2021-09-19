# worker-engine

Basic React/TypeScript game engine for incremental games.
All game loop logic is run in a worker. Games are saved to indexedDB.

# Development

## Client

Install the latest version of node.js. Best done with NVM (node version manager).

Old versions might work, but are not tested.

[NVM for Windows](https://github.com/coreybutler/nvm-windows)
[NVM for everything else](https://github.com/creationix/nvm)

`$ nvm install 16`
`$ nvm use 16`

`$ pnpm install` to install all dependencies
`$ npm run dev` to start and open a dev server

## Tests

`$ npm run cy:dev` to start a dev server and run Cypress (browser) tests in watch mode
`$ npm run cy:test` to build and start a production server, and run Cypress tests once
