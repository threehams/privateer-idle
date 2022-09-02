const path = require("path");
const appRootPath = require("app-root-path").toString();

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    externalDir: true,
  },
  webpack: (config, ...args) => {
    // config.module.rules[1].include.unshift(path.resolve(appRootPath, "libs"));
    if (process.env.PROFILE) {
      config.resolve.alias["react-dom$"] = "react-dom/profiling";
      config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";
      config.optimization.minimize = false;
    }

    return config;
  },
};
