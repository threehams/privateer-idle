import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
  },
  projectId: "64ugpg",
  fileServerFolder: ".",
  video: true,
  viewportWidth: 1280,
  viewportHeight: 720,
  videosFolder: "../dist/cypress/videos",
  screenshotsFolder: "../dist/cypress/screenshots",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
});
