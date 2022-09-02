const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./libs/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      black: "#000000",
      gray: colors.gray,
      white: "#ffffff",
      red: colors.red,
    },
  },
  plugins: [],
};
