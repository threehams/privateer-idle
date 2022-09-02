module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, ...args) => {
    if (process.env.PROFILE) {
      config.resolve.alias["react-dom$"] = "react-dom/profiling";
      config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";
      config.optimization.minimize = false;
    }

    return config;
  },
};
