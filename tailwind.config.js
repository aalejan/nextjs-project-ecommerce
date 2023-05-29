/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        //puts product in grid and auto-fills. make sure when  products are smaller than 15rem then fit on one row
        fluid: "repeat(auto-fit, minmax(15rem, 1fr))",
      },
      fontFamily: {
        lobster: [`var(--font-lobster)`],
        roboto: [`var(--font-roboto)`],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
