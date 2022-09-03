const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./libs/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      monospace: ['"IBM Plex Mono"', "sans-serif"],
    },
    colors: {
      black: "#000000",
      gray: colors.gray,
      white: "#ffffff",
      red: colors.red,
    },
  },
  plugins: [],
};
